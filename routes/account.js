var Account = require('../models/account'),
    passport = require('passport');

app.get('/register', function(req, res) {
  res.render('accounts/new', {
    title: 'Register'
  });
});

app.post('/register', function(req, res) {
  var account = new Account({
    username: req.body.username,
    password: req.body.password
  });

  account.save(function(err) {
    if (err) {
      req.flash('error', 'There was a problem');
      res.redirect('/');
    } else {
      req.flash('success', 'You may now log in');
      res.redirect('/login');
    }
  });
});

app.get('/login', function(req, res) {
  res.render('accounts/login', {
    title: 'Login'
  });
});

app.post('/login', function(req, res, next) {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: 'Failed to log in, check your user name and password and try again' 
  })(req, res, next);
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});
