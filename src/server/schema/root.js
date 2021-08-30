const { GraphQLString, GraphQLObjectType, GraphQLSchema } = require('graphql');
const { LoginRequest, LoginResponse, LogoutResponse } = require('./models/salesforce');

const jsforce = require('jsforce');
require('dotenv').config();
const { LOGIN_URL, INSTANCE_URL, USERNAME, PASSWORD , SECURITY_TOKEN} = process.env;

// Stores in local cache the connection details
currentUser = {};

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Root of all queries',
    fields: {
        // calls query methods
        hello: {
            type: GraphQLString,
            args: {
                message: { type: GraphQLString }
            },
            async resolve(
                parentValue, args, context
            ) {
                return args.message;
            }
        },
        // Login to Salesforce
        login: {
            type: LoginResponse,
            args: {
                credentials: { type: LoginRequest },
            },
            async resolve(
                parentValue,
                args
            ) {
                try {
                    // simple auth connection
                    const connection = new jsforce.Connection({
                        loginUrl: LOGIN_URL,
                        instanceUrl: INSTANCE_URL
                    });
                    // Get details from client app as input and replace .env details
                    const { username, password, securityToken, instanceUrl } = args.credentials;
                    let response = {};
                    // login
                    await connection.login(USERNAME, PASSWORD + SECURITY_TOKEN, (err, userInfo) => {
                        if (err) {
                            console.log(err);
                            response = {
                                success: false,
                                errorMessage: `${err.name} : ${err.message}`
                            };
                        }
                        else {
                            // Stores in cache
                            currentUser = {
                                userId: userInfo.id,
                                organizationId: userInfo.organizationId,
                                instanceUrl: userInfo.url,
                                accessToken: connection.accessToken
                            }
                            // Build login response
                            response = {
                                success: true,
                                ...currentUser
                           };
                        }
                   });
                   return response;
                    
                } catch (e) {
                    console.log(e);
                    throw e;
                }
            }
        },
        // Logout from Salesforce
        logout: {
            type: LogoutResponse,
            args: {},
            async resolve(
                parentValue,
                args
            ) {
                let response = {};
                try {
                    const connection = new jsforce.Connection({
                        sessionId : currentUser.accessToken,
                        serverUrl : currentUser.instanceUrl
                    });
                    await connection.logout(function(err) {
                        if (err) {
                            console.error(`${err.name} : ${err.message}`);
                            response = {
                                success: false,
                                errorMessage: `${err.name} : ${err.message}`
                            };
                        }
                        else {
                            // logout successully
                            response = { success:true };
                        }
                       
                    });
                } catch (error) {
                   throw error;
                }
                return response;
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});