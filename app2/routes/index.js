var router = require('express').Router();
var Words = require('../models/Words');

//root
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


//get text weight
router.post('/text', function(req, res) {
  var text = req.body.text;

  if (typeof(text) === 'undefined' || text === ''){
    res.status(400);
    res.send({"msg": "Please, pass the text"});
    return;
  }
  
  Words.find({}, (err, words) => {
    if (err) {
      res.status(500);
      res.send({"msg": "Internal Server Error"});
      return;
    }

    var textWords = text.split(/[^a-zA-Z]+/g);
    if (textWords[0] === "") textWords.shift();
    if (textWords[textWords.length - 1] === "") textWords.pop();

    var ans = textWords.reduce((acc, wordStr) => {
          for (var word of words){
            if (word.str === wordStr) return acc + word.weight;
          }
          return acc;
    }, 0).toString();
    res.status(200);
    res.send({"weight": ans});
  });
});

module.exports = router;
