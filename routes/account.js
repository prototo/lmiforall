var Account = require('../models/account'),
    Job = require('../models/job'),
    passport = require('passport'),
    request = require('request');

var skills = ['mathreason', 'programming', 'techdesign', 'mean', 'numbers', 'science', 'maths', 'principal', 'ordering', 'dedreason'];

app.get('/user', function(req, res) {
  if (!req.user) {
    res.redirect('/');
    return;
  }

  Job.findOne({soc: req.user.job}, function(err, job) {
    if (err) {
      req.flash('Something went wrong, sorry');
      res.redirect('/');
      return;
    }

    var api = 'http://lmiforall.eu01.aws.af.cm/backend/api.php',
      uparam = [], jparam = [];

    req.user.skills.forEach(function(skill) {
      uparam.push(skill.ratio);
    });

    job.skills.forEach(function(skill) {
      jparam.push(skill.ratio);
    });

    var url = api + '?character=' + uparam.join(',') + '&soc=' + jparam.join(',');
    console.log(url);

    request({
      method: 'POST',
      uri: url
    }, function(err, response, body) {
      var books = JSON.parse(body);

      res.render('user', {
        title: 'Quests',
        books: books
      });
    });
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
    Job.find(function(err, jobs) {
      if (err) {
        console.error(err);
        req.flash('Something went wrong, sorry');
        res.redirect('back');
        return;
      }

      var bestTot = 99999,
        bestSoc = 0;

      jobs.forEach(function(job) {
        var total = 0;
        var jskills = {}, bskills = {};

        job.skills.forEach(function(skill) {
          jskills[skill.name] = parseInt(skill.ratio);
        });
        build.forEach(function(skill) {
          bskills[skill.name] = parseInt(skill.ratio);
        });

        skills.forEach(function(skill) {
          var bratio = bskills[skill],
            jratio = jskills[skill];
console.log(jratio, bratio, jratio < bratio, (jratio - bratio));
          if (jratio > bratio) total += (jratio - bratio);
        });
console.log(total, bestTot);
        if (total < bestTot) {
          bestTot = total;
          bestSoc = job.soc;
        }
      });

console.log(bestTot, bestSoc);
      var account = new Account({
        username: req.body.username,
        password: req.body.password,
        skills: build,
        job: bestSoc
      });

      account.save(function(err) {
        if (err) {
          req.flash('error', 'Something went wrong, sorry');
          res.redirect('/');
        } else {
          req.flash('success', 'You may now log in');
          res.redirect('/login');
        }
      });
    });
  }
});

app.get('/login', function(req, res) {
  if (req.user) {
    res.redirect('/job');
    return;
  }

  res.render('accounts/login', {
    title: 'Login'
  });
});

app.post('/login', function(req, res, next) {
  passport.authenticate('local', {
    successRedirect: '/job',
    failureRedirect: '/login',
    failureFlash: 'Failed to log in, check your user name and password and try again' 
  })(req, res, next);
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

