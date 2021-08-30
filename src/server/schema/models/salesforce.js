const { GraphQLID, GraphQLString, GraphQLBoolean, GraphQLObjectType, GraphQLInputObjectType } = require('graphql');
const jsforce = require('jsforce');

// Authentication Request
const LoginRequest = new GraphQLInputObjectType({
    name: 'LoginRequest',
    description: 'User Login Details',
    fields: () => ({
        username: { type: GraphQLString },
        password: { type: GraphQLString },
        securityToken: { type: GraphQLString },
        instanceUrl: { type: GraphQLString }
    })
});

// Authentication Request
const UserObject = new GraphQLObjectType({
    name: 'UserObject',
    description: 'User Details',
    fields: () => ({
        Id: { type: GraphQLID },
        Name: { type: GraphQLString }
    })
});

const LogoutResponse = new GraphQLObjectType({
    name: 'LogoutResponse',
    description: 'Logout Details',
    fields: () => ({
        success: { type: GraphQLBoolean },
        errorMessage: { type: GraphQLString },
        timestamp: {
            type: GraphQLString,
            async resolve(parentValue, args, context) {
                return new Date().toLocaleString();
            }
        }
    })
});
// Schema for the Login Authentication and other sequential calls information
const LoginResponse = new GraphQLObjectType({
    name: 'LoginResponse',
    description: 'Authentication Details',
    fields: () => ({
        success: { type: GraphQLBoolean },
        errorMessage: { type: GraphQLString },
        accessToken: { type: GraphQLString },
        instanceUrl: { type: GraphQLString },
        userId: { type: GraphQLString },
        organizationId: { type: GraphQLString },
        loggedInDate: {
            type: GraphQLString,
            async resolve(parentValue, args, context) {
                return new Date().toLocaleString();
            },
        },
        loggedInUser: {
            type: UserObject,
            async resolve(parentValue, args, context) {
                // QUERY
                const soql = `SELECT Id, Name FROM User WHERE Id='${parentValue.userId}'`;
                let response = {};
                
                const connection = new jsforce.Connection({
                        sessionId : parentValue.accessToken,
                        serverUrl : parentValue.instanceUrl
                    });

                // GET RECORD
                await connection.query(soql, function(err, res) {
                    if (err) {
                        throw err;
                    }
                    if (res.records) {
                        console.log('user response: ', res.records);
                        response = res.records[0];
                    }
                });
                return response;
            },
        },

    })
});

module.exports = { LoginRequest, LoginResponse, LogoutResponse };