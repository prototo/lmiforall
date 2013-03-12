var http = require('http'),
    request = require('request'),
    mongoose = require('mongoose'),
    _ = require('underscore');

db = mongoose.connect('mongodb://localhost/lmiforall');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function() {
  console.log('connected to db');
  scrape();
});

var Job = require('./models/job');

var socs = [ 2136, 2137 ],
    base = 'http://api.lmiforall.org.uk/api/';

function scrape() {
  var jobs = socs.length;

  (function exitWhenReady() {
    if (!jobs) process.exit();
    setTimeout(exitWhenReady, 500);
  })();

  _.each(socs, function(code) {
    Job.count({ soc: code }, function(err, count) {
      if (!count) {
        request(base + 'soc/code/' + code, function(err, res, body) {
          var soc = JSON.parse(body);

          request(base + 'onet/levels/' + code, function(err, res, body) {
            var onet = JSON.parse(body),
                skills = normalise(onet);

            request(base + 'ashe/estimate?soc=' + code, function(err, res, body) {
              var ashe = JSON.parse(body),
                  pay = ashe.years[ashe.years.length - 1].estpay;
                  pay = Math.round(pay);
              
              var job = new Job({
                soc: code,
                title: soc.title,
                description: soc.description,
                skills: skills,
                pay: pay
              });

              job.save(function(err, job) {
                if (err) console.error(err);
                else console.log('saved', soc.title);
                jobs--;
              });
            });
          });
        });
      } else {
        jobs--;
      }
    });
  });
}

function normalise(onet) {
  var result = [],
      total = 0;

  _.each(onet.skills, function(skill) {
    total += skill.score;
  });

  _.each(onet.skills, function(skill) {
    var ratio = Math.round((skill.score / total) * 100);
    result.push({
      name: skill.name,
      ratio: ratio
    });
  });

  return result;
}


