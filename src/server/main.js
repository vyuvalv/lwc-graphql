// Simple Express server setup to serve for local testing/dev API server
const compression = require('compression');
const helmet = require('helmet');
const express = require('express');
const path = require('path');

const app = express();
// ACTIVATE MODULES
app.use(helmet(), compression(), express.json());

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 5000;
const SERVER_URL = `http://${HOST}:${PORT}`;
// PRODUCTION BUILD
const DIST_DIR = './dist';

// API Sample Endpoints 

// GET
app.get("/api/v1/data", (req, res) => {
    // Grab query parameters from URL
    const query = req.query;
    res.send({ data: { query, success: true } });
});
// POST
app.post("/api/v1/service/:type", (req, res) => {
    // Grab parameters from URL Path
    const parameters = req.params.type;
    // Grab body request payload
    const body = req.body;
    res.send({ data: { parameters, body } });
});

app.use(express.static(DIST_DIR));
// Use SPA and ignore any url path locations and always serves index
app.use('*', (req, res) => {
    res.sendFile(path.resolve(DIST_DIR, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`✅  API Server started: ${SERVER_URL}`)
});
