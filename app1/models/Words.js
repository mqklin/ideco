var mongoose = require('mongoose');

var WordsSchema = new mongoose.Schema({
  str: String,
  weight: String
});

module.exports = mongoose.model('words', WordsSchema);