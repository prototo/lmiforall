var Account = require('../models/account'),
    passport = require('passport');

app.get('/accounts', function(req, res) {
  res.render('index', {
    title: 'accounts'
  });
});
