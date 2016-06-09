const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');



// Middleware

// By default, passport wants to create a cookie-based sesson.  Setting
// session to false overrides that (since we're using tokens, not cookies)
const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = function(app) {
  app.post('/signup', Authentication.signup);
}
