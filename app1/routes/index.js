var router = require('express').Router();
var Words = require('../models/Words');
var RAM = require('./RAM');
var validator = require('./validator');

//ДОБАВИТЬ
router.post('/add', function(req, res) {
  var word = {
    str: req.body.word,
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
router.get('/get', function(req, res, next) {
  res.json(RAM.getWords());
});


//ИЗМЕНИТЬ
router.put('/change', function(req, res, next) {
  var word = {
    str: req.body.word,
    weight: req.body.weight
  };

  var err = validator.addOrChangeForm(word);
  if (err){
    res.send(err);
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
router.delete('/delete', function(req, res, next) {
  var word = {
    str: req.body.word,
    weight: req.body.weight
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


//СОСЧИТАТЬ ВЕС СЛОВ
router.post('/text', function(req, res) {
  var text = req.body.text;

  var err = validator.textForm(text);
  if (err){
    res.send(err);
    return;
  } 

  res.send(RAM.getTextWeight(text));
});




module.exports = router;
