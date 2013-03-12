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

var JobSchema = new mongoose.Schema({
  soc: Number,
  title: String,
  description: String,
  skills: [{
    name: String,
    ratio: Number
  }]
});
var Job = mongoose.model('job', JobSchema);

var socs = [ 2136, 2137 ],
    base = 'http://api.lmiforall.org.uk/api/';

function scrape() {
  var jobs = socs.length;

  (function exitWhenReady() {
    console.log('jobs left', jobs);
    if (!jobs) process.exit();

    setTimeout(exitWhenReady, 500);
  })();

  _.each(socs, function(code) {
    Job.count({ soc: code }, function(err, count) {
      if (!count) {
        console.log('requesting', code);

        request(base + 'soc/code/' + code, function(err, res, body) {
          var soc = JSON.parse(body);
          console.log(soc.title);

          request(base + 'onet/levels/' + code, function(err, res, body) {
            var onet = JSON.parse(body),
                skills = normalise(onet);

            var job = new Job({
              soc: code,
              title: soc.title,
              description: soc.description,
              skills: skills
            });

            job.save(function(err, job) {
              if (err) console.error(err);
              else console.log('saved', soc.title);
              jobs--;
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


