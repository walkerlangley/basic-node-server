const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');


/**
 * [LocalStrategy description]
 * @param {[type]} {} by default, LocalStrategy expects a username and password
 * Since we're not using username but instead are using email, we set usernameField
 * to email.  The password field is handled automatically.
 * We could also just pass the options object in directly as the first
 * parameter in the LocalStrategy function
 */

const localLoginOptions = {
  usernameField: 'email'
}

const localLogin = new LocalStrategy(localLoginOptions, function(email, password, done) {

  // Verify the email and password, call done with user
  // if it is the correct email and password
  // Otherwise, call done with false
  User.findOne({ email: email }, function(err, user) {
    if (err) { return done(err); }

    if (!user) { return done(null, false); }

    // Verify that the password matches user.password, but the password saved in
    // the db is the encrypted password (salt and hash)
    user.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err); };
      if (!isMatch) { return done(null, false); }

      return done(null, user);
    })
  })
})


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
passport.use(localLogin);
