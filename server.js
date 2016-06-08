// Base setup
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const http = require('http');
const app = express();
const PORT = process.env.PORT || 4001;
const server = http.createServer(app);

// project imports
const login = require('./login');


// Middleware
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));
app.use('/', router);

// get an instance of router
var router = express.Router();

// home page route (http://localhost:8080)
router.get('/', function(req, res) {
    res.send('im the home page!');
});

// about page route (http://localhost:8080/about)
router.get('/about', function(req, res) {
    res.send('im the about page!');
});


// Start the server!
server.listen(PORT);
console.log("Listening on port : " +  PORT);
