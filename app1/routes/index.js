var router = require('express').Router();
var Words = require('../models/Words');
var RAM = require('./RAM');
var validator = require('./validator');

//ДОБАВИТЬ
router.post('/words', function(req, res) {
  if (req.body.length !== 2 || 
    !(Object.keys(req.body)[0] === 'str' && Object.keys(req.body)[1] === 'weight') || 
    !(Object.keys(req.body)[0] === 'weight' && Object.keys(req.body)[1] === 'str')) {
    res.status(400); 
    res.send('Please, pass str and weigth');
    return;
  }
  var word = {
    str: req.body.str,
    weight: req.body.weight
  };

  var err = validator.addOrChangeForm(word);
  if (err){
    res.send(err);
    return;
  } 

  if (RAM.exist(word)) {
    res.status(400);
    res.send(word);
    return;
  }

  word.weight = validator.toFloat(word.weight);
  Words.create(word, function(err){
    if (err) res.send(err);
    else {
      RAM.addWord(word);
      res.status(201);
      res.send('Word successfully added');
    }
  });
});


//ПОЛУЧИТЬ

//все слова
router.get('/words', function(req, res, next) {
  res.status(200);
  res.json(RAM.getWords());
});

//одно слово
router.get('/words/:str', function(req, res, next) {
  var word = {
    str: req.params.str,
    weight: null
  };

  if (!RAM.exist(word)){
    res.status(404);
    res.send('Word is not exist');
    return;
  }

  Words.findOne({str: word.str}, function(err, word){
    if (err) res.send(err);
    else {
      res.status(200);
      res.send({str: word.str, weight: word.weight});
    }
  });
});


//ИЗМЕНИТЬ
router.put('/words/:str', function(req, res, next) {
  var word = {
    str: req.params.str,
    weight: req.body.weight
  };

  var err = validator.addOrChangeForm(word);
  if (err){
    res.status(400);
    res.send(err);
    return;
  } 

  if (!RAM.exist(word)){
    res.status(400);
    res.send('Word is not exist');
    return;
  }

  word.weight = validator.toFloat(word.weight);
  Words.update({str: word.str},{$set:{weight: word.weight}}, function(err){
    if (err) res.send(err);
    else {
      res.status(200);
      RAM.setWeight(word);
      res.send('Word successfully modified');
    }
  });
});


//УДАЛИТЬ
router.delete('/words/:str', function(req, res, next) {
  var word = {
    str: req.params.str,
    weight: null
  };

  if (!RAM.exist(word)){
    res.status(400);
    res.send('Word is not exist');
    return;
  }

  Words.remove({str: word.str}, function(err){
    if (err) res.send(err);
    else {
      res.status(200);
      RAM.removeWord(word);
      res.send('Word successfully deleted');
    }
  });
});


module.exports = router;
