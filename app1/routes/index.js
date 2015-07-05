var router = require('express').Router();
var Words = require('../models/Words');
var validator = require('./validator');
var template = require('es6-template-strings');


function forClients(obj){
  if (obj.constructor === Array) {
    return obj.map(word => {
      return {str: word.str, weight: word.weight};
    });
  }
  else return {str: obj.str, weight: obj.weight};
}

//ПОЛУЧИТЬ

//все слова
router.get('/words', (req, res) => {
  Words.find({}, (err, words) => {
    if (err) {
      res.status(500);
      res.send({err: "Internal Server Error"}); 
      return;
    }
    res.status(200);
    res.send(forClients(words));
    return;
  });  
});

//одно слово
router.get('/words/:str', (req, res) => {
  var str = req.params.str;
  Words.findOne({str: str}, (err, findedWord) => {
    if (err) {
      res.status(500);
      res.send({err: "Internal Server Error"});
      return;
    }
    if (findedWord === null) {
      res.status(400);
      res.send({err: template('Word `${place}` is not exist', {place: str})}); // здесь должно было быть `Word ${str} is not exist`, но это пока не поддреживается в node
      return;
    }
    res.status(200);
    res.send(forClients(findedWord));
    return;
  });
});


//ДОБАВИТЬ
router.post('/words', (req, res) => {
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
      res.status(500);
      res.send({err: "Internal Server Error"});
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
        res.status(500);
        res.send({err: "Internal Server Error"});
        return;
      }
      else {
        //res.status(201);
        //не знаю точно, что нужно возвращать -- добавленное слово или сообщение о том, что слово добавлено
        //res.send(forClients(createdWord));
        //res.send({msg: template('Word `${place}` successfully added', {place: createdWord.str})}); 
        //UPD: решил просто отправлять 204
        res.status(204);
        return;
      }
    });
  });
});


//ИЗМЕНИТЬ
router.put('/words/:str', (req, res) => {
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
      res.status(500);
      res.send({err: "Internal Server Error"});
      return;
    }
    if (findedWord === null) {
      res.status(400);
      res.send({err: template('Word `${place}` is not exist', {place: str})}); // здесь должно было быть `Word ${str} is not exist`, но это пока не поддреживается в node
      return;
    }

    findedWord.weight = validator.toFloat(word.weight);
    findedWord.save((err) => {
      if (err) {
        res.status(500);
        res.send({err: "Internal Server Error"});
        return;
      }
      res.status(204);
      //res.send({msg: template('Word `${place}` successfully modified', {place: findedWord.str})});
      return;
    });
  });
});


//УДАЛИТЬ
router.delete('/words/:str', (req, res) => {
  var str = req.params.str;

  Words.findOne({str: str}, (err, findedWord) => {
    if (err) {
      res.status(500);
      res.send({err: "Internal Server Error"});
      return;
    }
    if (findedWord === null) {
      res.status(400);
      res.send({err: template('Word `${place}` is not exist', {place: str})}); 
      return;
    }

    Words.remove({str: str}, (err, removedWord) => {
      if (err) {
        res.status(500);
        res.send({err: "Internal Server Error"});
        return;
      }
      //res.status(200);
      //res.send({msg: template('Word `${place}` successfully deleted', {place: str})}); 
      res.status(204);
      return;
    });
  });
});


module.exports = router;
