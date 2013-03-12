var mongoose = require('mongoose');

var JobSchema = new mongoose.Schema({
  soc: Number,
  title: String,
  description: String,
  skills: [{
    name: String,
    ratio: Number
  }],
  pay: Number
});

module.exports = mongoose.model('job', JobSchema);
