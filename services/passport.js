const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;


// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};


// Create JWT Strategy
/**
 * @param {[object]} payload, [Decoded jwt token, in this case an object
 * with a sub property and an iat property (see tokenForUser fn)]
 */
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // See if a user in the supplied payload exists in our db.
  // If it does, called 'done' with the user
  // If not, call done without the user object
  User.findById(payload.sub, function(err, user) {
    if (err) { return done(err, false); };

    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  });

})



// Tell passport to use this Strategy
passport.use(jwtLogin);
