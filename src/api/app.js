const express = require('express');
const bodyParser = require('body-parser');

// Middlewares
const authenticate = require('./middleware/authenticate');
const checkToken = require('./middleware/checkToken');
const root = require('./middleware/root');
const send = require('./middleware/send');

const app = express();

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/api', root);
app.post('/api/send', checkToken, send)
app.post('/api/authenticate', authenticate)

module.exports = app;
