const { GraphQLString, GraphQLObjectType, GraphQLSchema } = require('graphql');

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
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});