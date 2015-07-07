var router = require('express').Router();
var Words = require('../models/Words');
var validator = require('./validator');

//корень
router.get('/', (req, res) => {
  res.status(200);
  res.send({
    "links": [
      {
          "href": "/text",
          "rel": "textWeight",
          "method": "POST",
          "require": {
            "text": "String"
          }
      }
    ]
  });
});

var _words = [];
//СОСЧИТАТЬ ВЕС СЛОВ
router.post('/text', function(req, res) {
  var text = req.body.text;

  var err = validator.textForm(text);
  if (err){
    res.status(400);
    res.send({"msg": err});
    return;
  }
  
  _words = [];
  Words.find({}, (err, words) => {
    if (err) {
      res.status(500);
      res.send({"msg": "Internal Server Error"});
      return;
    }
    words.forEach(word => _words.push(word));
    var textWords = text.split(/[^a-zA-Z]+/g);
    if (textWords[0] === "") textWords.shift();
    if (textWords[textWords.length - 1] === "") textWords.pop();
    var ans = 
      textWords.reduce(
        (acc, word) => {
          var _word = findWord(word);
          if (_word === null) return acc;
          return acc + _word.weight;
        }, 
        0
      ).toString();
    res.status(200);
    res.send({"weight": ans});
  });
});

function findWord(str){
  for (var word of _words){
    if (word.str === str) return word;
  }
  return null;
}



module.exports = router;
