const { GraphQLID, GraphQLString, GraphQLBoolean, GraphQLInt, GraphQLObjectType, GraphQLInputObjectType, GraphQLList } = require('graphql');

const Author = new GraphQLObjectType({
    name: 'author',
    description: 'Author',
    fields: () => ({
        ID: { type: GraphQLID },
        login: { type: GraphQLString },
        email: { type: GraphQLString },
        name: { type: GraphQLString },
        first_name: { type: GraphQLString },
        last_name: { type: GraphQLString },
        nice_name: { type: GraphQLString },
        URL: { type: GraphQLString },
        avatar_URL: { type: GraphQLString },
        profile_URL: { type: GraphQLString },
        ip_address: { type: GraphQLString },
        site_ID: { type: GraphQLString },
        site_visible: { type: GraphQLBoolean },
    })
});
const Link = new GraphQLObjectType({
    name: 'link',
    description: 'post link',
    fields: () => ({
        self: { type: GraphQLString },
    })
});    
const Tag = new GraphQLObjectType({
    name: 'tag',
    description: 'post tag',
    fields: () => ({
        ID: { type: GraphQLID },
        name: { type: GraphQLString },
        slug: { type: GraphQLString },
        description: { type: GraphQLString },
        feed_url: { type: GraphQLString },
    })
});    
const Category = new GraphQLObjectType({
    name: 'category',
    description: 'post category',
    fields: () => ({
        ID: { type: GraphQLID },
        name: { type: GraphQLString },
        slug: { type: GraphQLString },
        description: { type: GraphQLString },
        feed_url: { type: GraphQLString }
    })
});    

const Post = new GraphQLObjectType({
    name: 'post',
    description: 'wp post',
    fields: () => ({
        ID: { type: GraphQLID },
        site_ID: { type: GraphQLString },
        author: { type: Author },
        date: { type: GraphQLString },
        modified: { type: GraphQLString },
        title: { type: GraphQLString },
        URL: { type: GraphQLString },
        short_URL: { type: GraphQLString },
        content: { type: GraphQLString },
        excerpt: { type: GraphQLString },
        slug: { type: GraphQLString },
        guid: { type: GraphQLString },
        status: { type: GraphQLString },
        type: { type: GraphQLString },
        featured_image: { type: GraphQLString },
        post_thumbnail: { type: GraphQLString },
        menu_order: { type: GraphQLInt },
        tags: { type: new GraphQLList(Tag) },
        categories: { type: new GraphQLList (Category)},
    })
});

const WpResponse = new GraphQLObjectType({
    name: 'response',
    description: 'wp response',
    fields: () => ({
        found: { type: GraphQLInt },
        post: { type: Post },
        posts: { type: new GraphQLList (Post)},
        categories: { type: new GraphQLList (Category)},
        tags: { type: new GraphQLList (Tag)},
    })
});

module.exports = { WpResponse };