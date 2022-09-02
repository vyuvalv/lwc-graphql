const { GraphQLInt, GraphQLObjectType, GraphQLSchema, GraphQLString } = require('graphql');
const { WpResponse } = require('./models/wordpress');
const axios = require('axios').default;

// Stores in local cache the connection details
currentUser = {};

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Root of all queries',
    fields: {
        // calls query methods
        posts: {
            type: WpResponse,
            args: {
                search: { type: GraphQLString },
                itemsPerPage: { type: GraphQLInt },
                pageNumber: { type: GraphQLInt }
            },
            async resolve(
                parentValue, args, context
            ) {
                const { itemsPerPage, pageNumber, search } = args;
                const base_endpoint = `https://public-api.wordpress.com`;
                const site_endpoint = `rest/v1/sites/153067956/posts?number=${itemsPerPage}&page=${pageNumber}`;
                
                const endpoint = search.length > 1 ? `${base_endpoint}/${site_endpoint}&search=${search}` : `${base_endpoint}/${site_endpoint}`;
                const results = await axios.get(endpoint);
                if (results) {
                    const response = results.data;
                    // console.log(response);
                    if (response.found > 0) {
                        const posts = response.posts.map(post => ({
                            ...post,
                            tags: post.tags ? Object.keys(post.tags).map(tagName => ({
                                ...post.tags[tagName]
                            })):[],
                            categories: post.categories ?Object.keys(post.categories).map(catName => ({
                                ...post.categories[catName]
                            })):[],
                        }));
                 
                        return {
                            found: response.found,
                            posts: [...posts]
                        }
                    }
                }
               
                return results.data;
            }
        },
        get_post: {
            type: WpResponse,
            args: {
                postId: { type: GraphQLString},
            },
            async resolve( parentValue, args, context ) {
                const { postId } = args;
                const base_endpoint = `https://public-api.wordpress.com/`;
                const specificPost = `rest/v1/sites/153067956/posts/${postId}`;
                const results = await axios.get(base_endpoint + specificPost);
                if (results.error) {
                    console.log('error getting post : ' + results.error );
                }
                return {
                    post: { ...results.data }
                };
            }
        },
        categories: {
            type: WpResponse,
            args: {
                itemsPerPage: { type: GraphQLInt },
                pageNumber: { type: GraphQLInt }
            },
            async resolve(
                parentValue, args, context
            ) {
                const { itemsPerPage, pageNumber } = args;
                const base_endpoint = `https://public-api.wordpress.com/`;
                const site_domain = `yvforce.com`;
                const site_domain_id = `153067956`;
                const site_endpoint = `rest/v1/sites/${site_domain_id}/categories`;
                
                const results = await axios.get(base_endpoint + site_endpoint);
                if (results) {
                    const response = results.data;
                    // console.log(response);
                    if (response.found > 0) {
                        const categories = response.categories.map(category => ({
                            ...category
                        }));
                 
                        return {
                            found: response.found,
                            categories: [...categories]
                        }
                    }
                }
               
                return results.data;
            }
        },
        tags: {
            type: WpResponse,
            args: {
                itemsPerPage: { type: GraphQLInt },
                pageNumber: { type: GraphQLInt }
            },
            async resolve(
                parentValue, args, context
            ) {
                const { itemsPerPage, pageNumber } = args;
                const base_endpoint = `https://public-api.wordpress.com/`;
                const site_domain = `yvforce.com`;
                const site_domain_id = `153067956`;
                const site_endpoint = `rest/v1/sites/${site_domain_id}/tags`;
                
                const results = await axios.get(base_endpoint + site_endpoint);
                if (results) {
                    const response = results.data;
                    // console.log(response);
                    if (response.found > 0) {
                        const tags = response.tags.map(tag => ({
                            ...tag
                        }));
                 
                        return {
                            found: response.found,
                            tags: [...tags]
                        }
                    }
                }
               
                return results.data;
            }
        },
        search: {
            type: WpResponse,
            args: {
                keyword: { type: GraphQLString },
                itemsPerPage: { type: GraphQLInt },
                pageNumber: { type: GraphQLInt }
            },
            async resolve(
                parentValue, args, context
            ) {
                const { itemsPerPage, pageNumber, keyword } = args;
                const base_endpoint = `http://vardi.xyz`;
                const site_domain = `yvforce.com`;
                const site_domain_id = `153067956`;
                const site_endpoint = `/wp-json/wp/v2/search?search=${keyword}&page=${pageNumber}&per_page=${itemsPerPage}`;
                
                const results = await axios.get(base_endpoint + site_endpoint);
                if (results) {
                    const response = results.data;
            
                 
                        return {
                            found: response.length,
                            posts: [...response]
                        }
                    }
            
            }
        },
    }
});
function formatObjectToList(obj) {
    const objKeys = Object.keys(post.tags);
    let keyList = [];
    if (objKeys.length) {
        objKeys.forEach(key => {
            const formattedItem = {
                ...obj[key]
            }
            keyList.push(formattedItem);
        });
    }
    return keyList;
}

module.exports = new GraphQLSchema({
    query: RootQuery
});