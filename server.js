const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const http = require('http');

const app = express();


// Middleware

app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));

// Routes Setup
app.get("/", (req, res, next) => {
  res.sendFile(__dirname + '/index.html');
})


// Server Setup
const PORT = process.env.PORT || 4001;
const server = http.createServer(app);
server.listen(PORT);
console.log("Listening on port : " +  PORT);
