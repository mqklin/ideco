var router = require('express').Router();
var Words = require('../models/Words');
var RAM = require('./RAM');
var validator = require('./validator');

//ДОБАВИТЬ
router.post('/words', function(req, res) {
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
    res.send('Word is already exist');
    return;
  }

  word.weight = validator.toFloat(word.weight);
  Words.create(word, function(err){
    if (err) res.send(err);
    else {
      RAM.addWord(word);
      res.send('Word successfully added');
    }
  });
});


//ПОЛУЧИТЬ
router.get('/words', function(req, res, next) {
  res.json(RAM.getWords());
});


//ИЗМЕНИТЬ
router.put('/words/:str', function(req, res, next) {
  var word = {
    str: req.params.str,
    weight: req.body.weight
  };

  var err = validator.addOrChangeForm(word);
  if (err){
    res.send(err);
    return;
  } 

  if (!RAM.exist(word)){
    res.send('word is not exist');
    return;
  }

  word.weight = validator.toFloat(word.weight);
  Words.update({str: word.str},{$set:{weight: word.weight}}, function(err){
    if (err) res.send(err);
    else {
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
    res.send('Word is not exist');
    return;
  }

  Words.remove({str: word.str}, function(err){
    if (err) res.send(err);
    else {
      RAM.removeWord(word);
      res.send('Word successfully deleted');
    }
  });
});


module.exports = router;
