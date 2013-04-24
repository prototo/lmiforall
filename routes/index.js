var mongoose = require('mongoose'),
    Job = require('../models/job');

app.get('/', function(req, res) {
  if (req.user) {
    res.redirect('/user');
    return;
  }

  res.render('index', {
    title: 'Job Quest'
  });
});

app.post('/jobs', function(req, res) {
  Job.find(function(err, jobs) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(jobs));
  });
});
