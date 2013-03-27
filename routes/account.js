var Account = require('../models/account'),
    passport = require('passport');

app.get('/accounts', function(req, res) {
  res.render('index', {
    title: 'accounts'
  });
});

app.get('/accounts/new', function(req, res) {
  res.render('accounts/new', {
    title: 'new account'
  });
});

app.post('/accounts/new', function(req, res) {
  var account = new Account({
    username: req.body.username,
    password: req.body.password
  });

  account.save(function(err) {
    if (err) {
      req.flash('error', 'there was a problem');
      res.redirect('back');
    } else {
      res.redirect('/');
    }
  });
});

app.get('/login', function(req, res) {
  res.render('accounts/login', {
    title: 'login'
  });
});

app.post('/login', function(req, res, next) {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: 'you failed' 
  })(req, res, next);
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});
