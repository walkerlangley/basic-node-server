const express = require('express');
const router = express.Router();



function login(req, res, next) {
  app.get("/", (req, res, next) => {
    res.sendFile(__dirname + '/index.html');
    next();
  });
}


router.post('/login', login);

module.exports = router;
