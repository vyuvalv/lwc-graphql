// Simple Express server setup to serve for local testing/dev API server
const compression = require('compression');
const helmet = require('helmet');
const express = require('express');
const path = require('path');
// GraphQL
const { graphqlHTTP } = require('express-graphql');
const rootSchema = require('./schema/root');

const app = express();
// ACTIVATE MODULES
app.use(helmet(), compression(), express.json());

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 5000;
const SERVER_URL = `http://${HOST}:${PORT}`;
// PRODUCTION BUILD
const DIST_DIR = './dist';

// GraphQL Endpoint for all callouts
app.use('/api/graphql', async (req, res) => {
    // GraphQL Configuration
    graphqlHTTP({
        schema: rootSchema,
        graphiql: true,
        context: req
    })(req, res);
});

app.use(express.static(DIST_DIR));
// Use SPA and ignore any url path locations and always serves index
app.use('*', (req, res) => {
    res.sendFile(path.resolve(DIST_DIR, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`✅  API Server started: ${SERVER_URL}`)
});
