var router = require('express').Router();
var Words = require('../models/Words');
var RAM = require('./RAM');
var validator = require('./validator');

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
