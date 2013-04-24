var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , Account = require('../models/account');

passport.use(new LocalStrategy(
  function(username, password, done) {
    Account.findOne({ username: username }, function(err, account) {
      if (err) return done(err);
      if (!account || !account.validPassword(password)) {
        return done(null, false);
      }
      return done(null, account);
    });
  }
));

passport.serializeUser(function(account, done) {
  done(null, account.id);
});

passport.deserializeUser(function(id, done) {
  Account.findById(id, function(err, account) {
    done(err, account);
  });
});
