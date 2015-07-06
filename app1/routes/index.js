var router = require('express').Router();
var Words = require('../models/Words');
var validator = require('./validator');
var template = require('es6-template-strings');

function resToGetWords(words){
  return {
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
  }
}

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



function send500(res){
  res.status(500);
  res.send({"msg": "Internal Server Error"}); 
}

//ПОЛУЧИТЬ

//все слова
router.get('/word', (req, res) => {
  Words.find({}, (err, words) => {
    if (err) {
      send500(res);
      return;
    }
    res.status(200);
    res.send(resToGetWords(words));
    return;
  });
});


//одно слово
router.get('/word/:str', (req, res) => {
  var str = req.params.str;
  Words.findOne({str: str}, (err, findedWord) => {
    if (err) {
      send500(res);
      return;
    }
    if (findedWord === null) {
      res.status(400);
      res.send({"msg": template('Word `${place}` is not exist', {place: str})}); // здесь должно было быть `Word ${str} is not exist`, но нативные templates es6 не поддерживаются в node
      return;
    }
    res.status(200);
    res.send(resToGetWord(findedWord));
    return;
  });
});


//ДОБАВИТЬ
router.post('/word', (req, res) => {
  var word = {
    str: req.body.str,
    weight: req.body.weight
  };

  var err = validator.addOrChangeForm(word);
  if (err){
    res.status(400);
    res.send({err: err});
    return;
  } 

  Words.findOne({str: word.str}, (err, findedWord) => {
    if (err) {
      send500(err);
      return;
    }
    if (findedWord !== null) {
      res.status(400);
      res.send({err: template('Word `${place}` is already exist', {place: findedWord.str})}); 
      return;
    }

    word.weight = validator.toFloat(word.weight);
    Words.create(word, (err, createdWord) => {
      if (err) {
        send500(err);
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


//ИЗМЕНИТЬ
router.put('/word/:str', (req, res) => {
  var word = {
    str: req.params.str,
    weight: req.body.weight
  };

  var err = validator.addOrChangeForm(word);
  if (err){
    res.status(400);
    res.send({err: err});
    return;
  }

  Words.findOne({str: word.str}, (err, findedWord) => {
    if (err) {
      send500(res);
      return;
    }
    if (findedWord === null) {
      res.status(400);
      res.send({err: template('Word `${place}` is not exist', {place: str})}); // здесь должно быть `Word ${str} is not exist`
      return;
    }

    findedWord.weight = validator.toFloat(word.weight);
    findedWord.save((err) => {
      if (err) {
        send500(res);
        return;
      }
      res.status(200);
      res.send(resToGetWord(findedWord));
      return;
    });
  });
});


//УДАЛИТЬ
router.delete('/word/:str', (req, res) => {
  var str = req.params.str;

  Words.findOne({str: str}, (err, findedWord) => {
    if (err) {
      send500(res);
      return;
    }
    if (findedWord === null) {
      res.status(400);
      res.send({err: template('Word `${place}` is not exist', {place: str})}); 
      return;
    }

    Words.remove({str: str}, (err, removedWord) => {
      if (err) {
        send500(res);
        return;
      }
      res.status(204);
      res.end();
      return;
    });
  });
});


module.exports = router;
