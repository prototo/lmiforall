var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt');

// account object schema
var AccountSchema = new Schema({
  username: { type: String, required: true, unique: true },
  
  // password
  salt: { type: String, required: true },
  hash: { type: String, required: true },

  // add all that other stuff
  skills: [{
    name: String,
    ratio: Number
  }],

  job: Number // soc 
});

// generate the salt and hash for the new user object
AccountSchema.virtual('password').set(function(password) {
  var salt = this.salt = bcrypt.genSaltSync(10);
  this.hash = bcrypt.hashSync(password, salt);
});

// authenticate a password for this account object
AccountSchema.method('validPassword', function(password) {
  return bcrypt.compareSync(password, this.hash);
});

// authenticate account details
AccountSchema.static('authenticate', function(username, password, callback) {
  this.findOne({username: username}, function(err, account) {
    if (err) callback(err, null);

    var authenticated = account.validPassword(password);
    if (!authenticated) callback('account details invalid', null);
    
    // user has been authenticated, return the object
    callback(null, account);
  });
});

module.exports = mongoose.model('account', AccountSchema);
