const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middlewares
const authenticate = require('./middleware/authenticate');
const checkToken = require('./middleware/checkToken');
const root = require('./middleware/root');
const send = require('./middleware/send');

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

// Routes
app.get('/api', root);
app.post('/api/send', checkToken, send)
app.post('/api/authenticate', authenticate)

module.exports = app;
