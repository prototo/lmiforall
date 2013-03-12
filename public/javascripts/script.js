// jobs array should have been embedded in template...

$(function() {

  // SOME SETUP
  var MAX_POINTS = 30;
  var jobs;
  var skillList = [
    'mathreason',
    'programming',
    'techdesign',
    'mean',
    'numbers',
    'science',
    'maths',
    'principal',
    'ordering',
    'dedreason'
  ];

  // character object
  window.character = (function() {
    var name = '',
        points = MAX_POINTS,
        skills = {},
        ratios = {},
        elm = $('#character');

    _.each(skillList, function(skill) {
      skills[skill] = 0;
      ratios[skill] = 0;
    });

    // increment a skill point
    function skillUp(skill) {
      if (!points) return false;

      points--;
      skills[skill]++;
      _calcRatio(skill);
    }

    // decrement a skill point
    function skillDown(skill) {
      if (points >= MAX_POINTS || skills[skill] <= 0) return false;

      points++;
      skills[skill]--;
      _calcRatio(skill);
    }

    // calculate the ratio of a skill point
    function _calcRatio(skill) {
      var val = skills[skill];
      ratios[skill] = Math.round((val/MAX_POINTS) * 100);
    }

    // compare the user with a list of jobs
    function compareJobs(jobs) {
      var bestScore = 9999, bestJob;

      _.each(jobs, function(job) {
        var score = _compareJob(job);

        if (!bestJob || score < bestScore) {
          bestJob = job;
          bestScore = score;
        }
      });

      return bestJob;
    }

    // compare the user with a job
    // outputs the total points difference (lower == better)
    function _compareJob(job) {
      var totalDiff = 0;

      _.each(job.skills, function(skill) {
        var diff = ratios[skill.name] - skill.ratio;
            diff = Math.abs(diff);
            totalDiff += diff;
      });

      return totalDiff;
    }

    function render() {
      if (!elm.length) alert('page doesn\'t look right...');

      // render available job points
      elm.find('#points span').html(points);

      _.each(skillList, function(skill) {
        elm.find('.skill.' + skill).find('.level').html(skills[skill]);
        elm.find('.skill.' + skill).find('.ratio span').html(ratios[skill]);
      });

      compareJobs(jobs);
    }

    return {
      name: name,
      points: points,
      skills: skills,
      ratios: ratios,

      compareJobs: compareJobs,

      skillUp: skillUp,
      skillDown: skillDown,

      render: render
    };
  })();

  window.bestJob = function() {
    var elm = $('#bestJob'),
        job = character.compareJobs(jobs);

    elm.find('#title').html(job.title);
    elm.find('#description').html(job.description);
    
    _.each(job.skills, function(skill) {
      console.log(skill.name, skill.ratio);
      elm.find('.skill.' + skill.name).find('.ratio span').html(skill.ratio);
    });
  }

  // DOM EVENTS
  $(document).on('click', '.skill .up', function(e) {
    var skillElm = $(this).parent(),
        name = skillElm.data('skill');

    character.skillUp(name);
    character.render();
    bestJob();
  });

  $(document).on('click', '.skill .down', function(e) {
    var skillElm = $(this).parent(),
        name = skillElm.data('skill')

    character.skillDown(name);
    character.render();
    bestJob();
  });

  // INIT CODES
  $.ajax('/jobs', {
    method: 'post',
    success: function(res) {
      jobs = res;

      character.render();
    }
  });

});
