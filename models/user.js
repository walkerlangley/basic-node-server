const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');


/**
 * Define a user model
 * @param {[type]} unique:    true    [this tells Mongo to only allow 1 instance of something, ie 1 instance of an email]
 * @param {[type]} lowercase: true    [this ensures that an email is converted to lowercase before saving so
 * walkerlangley@gmail.com and WALKERLANGLEY@gmail.com would be considered the same email and the second email
 * would throw an error upon saving]
 */
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true
  },
  password: String
})

// On Save Hook, encrypt password
userSchema.pre('save', function(next) {
  const user = this;

  // generate a salt
  bcrypt.genSalt(10, function(err, salt) {
    if (err) { return next(err); }
    console.log('password', user.password);

    // use the salt to encrypt (hash) the password
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if(err) { return next(err); }

      // overwrite plain text password with hash (encrypted password)
      // Do this so the users unencrypted password isn't stored in Mongo
      user.password = hash;
      next();
    });
  });
});


// Create the model class
const ModelClass = mongoose.model('user', userSchema);


module.exports = ModelClass;
