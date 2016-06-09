const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');


function tokenForUser(user) {
  const timestamp = new Date().getTime();

  /**
   * sub is short of subject, referencing 'who' the token is about
   * iat is short for issued at time
   */

  const properties = {
    sub: user.id,
    iat: timestamp
  }
  return jwt.encode(properties, config.secret);
}


exports.signin = function(req, res, next) {
  // User has already had their email and password authed,
  // We just need to give them their token

  // user is supplied by the callback from the passport middleware as
  // req.user.  Thanks Passport!
  res.send({ token: tokenForUser(req.user) });
}


exports.signup = function(req, res, next) {
  // See if a user with the submitted email exists
  const pattern = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;

  const password = req.body.password;
  const email = req.body.email;

  if(!email || !password) {
    res.status(422).send({ error: 'Please make sure to supply an email and password'});
  }

  if(email && !pattern.test(email)) {
    res.status(422).send({ error: 'Email doesn\'t meet requirements.  Please use another email'});
  }

  if(password && password.length<4) {
    res.status(422).send({ error: 'Please make sure your password has at least 4 characters'});
  }


  User.findOne({ email: email }, (err, existingUser) => {
    if(err) { return next(err); }

    // If a user with the email does exist, return an error
    if (existingUser) {
      return res.status(422).send({ error: 'The email is in use' });
    }

    // If a user with the email DOES NOT exist, create and save user record in
    // memory.  This DOES NOT save the record in Mongo!!!
    const user = new User({
      email: email,
      password: password
    });

    // Have to call the save method to actually save the user in the db
    user.save((err) => {
      if (err) { return next(err);}

      // Respond to request saying a user was created
      res.json({ token: tokenForUser(user) });
    });
  })
}
