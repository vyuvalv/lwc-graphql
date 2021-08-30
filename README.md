# Using LWC OSS With GraphQL - Starter Kit
- Official Documentation - https://lwc.dev/ 
- This Project is using Lightning Web Components OSS - Starter Kit was cloned and extended from [`vyuvalv/lwc-oss`](https://github.com/vyuvalv/lwc-oss)

## GraphQL Demo
- Includes a `Hello World` example using LWC app with [GraphQL](https://graphql.org)
- Connection to Salesforce Api via [JSForce](https://jsforce.github.io/)
- Schema Stiching to complete payload from callouts

## Quick Preview
![Preview](./docs/Hola.png)


## How to start?
- Clone this repository and all will be setup for you. 
- `git clone https://github.com/vyuvalv/lwc-graphql.git` 
- Run `npm install` from this project directory.
- `npm run build` - will build our package
- Then Start simple by running `yarn watch` (or `npm run watch`


# The Breakdown of Steps 
* Install the latest following dependencies with `npm install`
    - Go to your `project.json` file
    - Add the following dependencies:
        * `graphql` - GraphQL library
        * `express-graphql` - GraphQL adapter for Express Server
        * `jsforce` - Connection to Salesforce
        * `axios` - Making Rest Calls easier
        * `dotenv`- Storing parameters used for the connection to Salesforce Connected App option

    ```json
    "dependencies": {
            "@lwc/synthetic-shadow": "^1.17.6",
            "@salesforce-ux/design-system": "^2.14.3",
            "compression": "^1.7.4",
            "cors": "^2.8.5",
            "express": "^4.17.1",
            "helmet": "^3.23.3",
            "lightning-base-components": "^1.11.5-alpha",
            "express-graphql": "^0.12.0",
            "graphql": "^15.5.0"
        },
        "devDependencies": {
            "dotenv": "^8.2.0",
            "eslint": "^6.8.0",
            "husky": "^4.3.8",
            "lint-staged": "^10.5.4",
            "lwc-services": "^2.3.2",
            "npm-run-all": "^4.1.5",
            "prettier": "^1.19.1"
        },
    ```

## Setting Up your GraphQL Server
* We are using Express JS and we will create an endpoint to serve graphQL
    - Go to your server file `/server/main.js`
    - `express-graphql` whill help us bridge between Express to GraphQL Schema.

    ```js
    const { graphqlHTTP } = require('express-graphql');
    const rootSchema = require('./schema/root');

    // GraphQL Endpoint for all callouts
    app.use('/graphql', async(req, res) => {
        graphqlHTTP({
            schema: rootSchema,
            graphiql: true,
            context: req
        })(req, res);
    });
    ```
* Setup your GraphQL Schema  
    - GraphQL Schema Builder - `/server/schema/root.js`
    - It will provide us with strongly typed schema interface for our request and response payloads.

    ```js
        const { GraphQLString, GraphQLObjectType, GraphQLSchema, GraphQLList } = require('graphql');

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
    ```

* Call graphQL from your LWC App
    - Go  `/client/modules/core/app` - Thats your main LWC app.
    - Inside `/client/modules/data/services/` - There is an expose http request function that we will inport into our app and use it for calling our server. 

    ```js
        import { LightningElement, api } from 'lwc';
        import { getData } from '../../data/services/services';

        export default class App extends LightningElement {

            message = 'Whoo hooo!!';
            response = '';

            // button click
            handleClick() {
                // build basic graphQL query
                const baseQuery = {
                    query: `{
                        hello(message:"${this.message}")
                    }`
                };
                this.fetchData(baseQuery);
            }

            // input value on change
            handleInputChange(event) {
                this.message = event.target.value;
            }


            // get Data
            async fetchData(query) {
                try {
                    const response = await getData(query);
                    if (response.data) {
                        console.log('SUCCESS ' + JSON.stringify(response));
                        this.response = JSON.stringify(response);
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        }

    ```

### GraphQL Query - add a new Data Object

- Create a GraphQL Schema Object for your Response


```js
    const { GraphQLString, GraphQLObjectType, GraphQLID } = require('graphql');

    const ObjectResponseSchema = new GraphQLObjectType({
        name: 'ObjectName',
        description: 'Describe your object fields and query methods',
            fields: () => ({
                id: { type: GraphQLID },
                name: { type: GraphQLString }
            })
        });

```

- Add a master query method that build the Reuqest and return the Response object
- Inside your `root.js` we have our master root Query where we will add this ne method


```js
        
        const RootQuery = new GraphQLObjectType({
            name: 'RootQueryType',
            description: 'Root Mother of all queries',
            fields: {
                hello: {
                        type: ObjectResponseSchema,
                        args: {
                            name: { type: GraphQLString }
                        },
                        async resolve(
                            parentValue, args, context
                        ) {
                            return { 
                                id:'1',
                                name: args.name
                            };
                        }
                    },
                }
            });
```

## Build and Run it

- `npm run build` - will build our package
- Then Start simple by running `yarn watch` (or `npm run watch`
- View on your port - by default `http://localhost:3001` for DEV and hor reloading and  `http://localhost:5000` for production view.