var mongoose = require('mongoose');

var WordsSchema = new mongoose.Schema({
  str: String,
  weight: Number
});

module.exports = mongoose.model('words', WordsSchema);