var Account = require('../models/account'),
    passport = require('passport');

var skills = ['mathreason', 'programming', 'techdesign', 'mean', 'numbers', 'science', 'maths', 'principal', 'ordering', 'dedreason'];

app.get('/user', function(req, res) {
  if (!req.user) {
    res.redirect('/');
    return;
  }

  res.render('user', {
    title: req.user.username
  });
});

app.get('/register', function(req, res) {
  if (req.user) {
    res.redirect('/user');
    return;
  }

  res.render('accounts/new', {
    title: 'Register',
    skills: skills
  });
});

app.post('/register', function(req, res) {
  var build = [],
    total = 0;

    console.log(req.body.skills);

  skills.forEach(function(skill) {
    var ratio = parseInt(req.body.skills[skill]);
    total += ratio;

    build.push({
      name: skill,
      ratio: ratio
    });
  });

  if (total !== 100) {
    req.flash('error', 'Please allocate all job points');
    res.redirect('/register');
  } else {
    var account = new Account({
      username: req.body.username,
      password: req.body.password,
      skills: build
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
  }
});

app.get('/login', function(req, res) {
  if (req.user) {
    res.redirect('/user');
    return;
  }

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
