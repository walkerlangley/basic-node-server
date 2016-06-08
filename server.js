const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const http = require('http');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');


// DB Setup
mongoose.connect('mongodb://localhost:auth/auth')


// Middleware

app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));

router(app);



// Server Setup
const PORT = process.env.PORT || 4001;
const server = http.createServer(app);
server.listen(PORT);
console.log("Listening on port : " +  PORT);
