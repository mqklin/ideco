var router = require('express').Router();
var Words = require('../models/Words');
var validator = require('./validator');
var template = require('es6-template-strings');

//GET/POST/PUT WORD
function resToGetWord(word){
  return {
    "word": {
      "str": word.str, 
      "weight": word.weight,
      "links": [
        {
          "href": "/word/" + word.str,
          "rel": "self",
          "method": "GET"
        },
        {
          "href": "/word/" + word.str,
          "rel": "edit",
          "method": "PUT",
          "require": {
            "weight": "Number"
          }
        },
        {
          "href": "/word/" + word.str,
          "rel": "delete",
          "method": "DELETE"
        }
      ]
    },
    "links": [
      {
          "href": "/word",
          "rel": "list",
          "method": "GET"
      },
      {
          "href": "/word",
          "rel": "create",
          "method": "POST",
          "require": {
            "str": "String",
            "weight": "Number"
          }
      }
    ]
  }
}


//INTERNAL SERVER ERROR
function sendDatabaseError(res){
  res.status(500);
  res.send({"msg": "Internal Server Error"}); 
}


//GET ROOT
router.get('/', (req, res) => {
  res.status(200);
  res.send({
    "links": [
      {
          "href": "/word",
          "rel": "list",
          "method": "GET"
      },
      {
          "href": "/word",
          "rel": "create",
          "method": "POST",
          "require": {
            "str": "String",
            "weight": "Number"
          }
      }
    ]
  });
});


//GET ALL WORDS
router.get('/word', (req, res) => {
  Words.find({}, (err, words) => {
    if (err) {
      sendDatabaseError(res);
      return;
    }
    res.status(200);
    res.send({
      "words": words.map(word => {
        return {
          "str": word.str, 
          "weight": word.weight,
          "links": [
            {
              "href": "/word/" + word.str,
              "rel": "self",
              "method": "GET"
            },
            {
              "href": "/word/" + word.str,
              "rel": "edit",
              "method": "PUT",
              "require": {
                "weight": "Number"
              }
            },
            {
              "href": "/word/" + word.str,
              "rel": "delete",
              "method": "DELETE"
            }
          ]
        };
      }),
      "links": [
        {
          "href": "/word",
          "rel": "list",
          "method": "GET"
        },
        {
            "href": "/word",
            "rel": "create",
            "method": "POST",
            "require": {
              "str": "String",
              "weight": "Number"
            }
        }
      ]
    });
    return;
  });
});


//GET WORD
router.get('/word/:str', (req, res) => {
  var str = req.params.str;
  Words.findOne({str: str}, (err, findedWord) => {
    if (err) {
      sendDatabaseError(res);
      return;
    }
    if (findedWord === null) {
      res.status(400);
      res.send({"msg": template('Word `${place}` is not exist', {place: str})}); // здесь должно было быть `Word ${str} is not exist`
      return;
    }
    res.status(200);
    res.send(resToGetWord(findedWord));
    return;
  });
});


//POST WORD
router.post('/word', (req, res) => {
  var word = {
    str: req.body.str,
    weight: req.body.weight
  };

  var err = validator.addOrChangeForm(word);
  if (err){
    res.status(400);
    res.send({"msg": err});
    return;
  } 

  Words.findOne({str: word.str}, (err, findedWord) => {
    if (err) {
      sendDatabaseError(err);
      return;
    }
    if (findedWord !== null) {
      res.status(400);
      res.send({"msg": template('Word `${place}` is already exist', {place: findedWord.str})}); 
      return;
    }

    word.weight = validator.toFloat(word.weight);
    Words.create(word, (err, createdWord) => {
      if (err) {
        sendDatabaseError(err);
        return;
      }
      else {
        res.status(201);
        res.send(resToGetWord(createdWord));
        return;
      }
    });
  });
});


//PUT WORD
router.put('/word/:str', (req, res) => {
  var word = {
    str: req.params.str,
    weight: req.body.weight
  };

  var err = validator.addOrChangeForm(word);
  if (err){
    res.status(400);
    res.send({"msg": err});
    return;
  }

  Words.findOne({str: word.str}, (err, findedWord) => {
    if (err) {
      sendDatabaseError(res);
      return;
    }
    if (findedWord === null) {
      res.status(400);
      res.send({"msg": template('Word `${place}` is not exist', {place: str})}); // здесь должно быть `Word ${str} is not exist`
      return;
    }

    findedWord.weight = validator.toFloat(word.weight);
    findedWord.save((err) => {
      if (err) {
        sendDatabaseError(res);
        return;
      }
      res.status(200);
      res.send(resToGetWord(findedWord));
      return;
    });
  });
});


//DELETE WORD
router.delete('/word/:str', (req, res) => {
  var str = req.params.str;

  Words.findOne({str: str}, (err, findedWord) => {
    if (err) {
      sendDatabaseError(res);
      return;
    }
    if (findedWord === null) {
      res.status(400);
      res.send({"msg": template('Word `${place}` is not exist', {place: str})}); 
      return;
    }

    Words.remove({str: str}, (err, removedWord) => {
      if (err) {
        sendDatabaseError(res);
        return;
      }
      res.status(204);
      res.end();
      return;
    });
  });
});


module.exports = router;
