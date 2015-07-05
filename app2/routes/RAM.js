var Words = require('../models/Words');


var Word = function(id, word){
  var _id = id;
  var _str = word.str;
  var _weight = word.weight;

  this.getId = function(){
    return _id;
  };
  this.getStr = function(){
    return _str;
  };
  this.getWeight = function(){
    return _weight;
  };
  this.setWeight = function(weight){
    _weight = weight;
  };
};


var RAM = function(){
  var _words = [];
  Words.find({}, function(err, words){
    words.forEach(function(word){ 
      addWord(word);
    });
  });

  this.addWord = addWord;
  function addWord(word){
    var _word = new Word(_words.length, word);
    _words.push(_word);
  };

  this.getWords = function(){
    return _words.map(function(word){
      return {
        str: word.getStr(),
        weight: word.getWeight()
      }
    });
  };

  this.exist = function(word){
    return _words.some(function(_word){
      return _word.getStr() === word.str;
    });
  };

  this.removeWord = function(word){
    for (var i = 0; i< _words.length; i++){
      if (_words[i].getStr() === word.str){
        _words.splice(i, 1);
        return;
      }
    }
  };

  this.setWeight = function(word){
    findWord(word.str).setWeight(word.weight);
  };

  this.getTextWeight = function(text){
    var textWords = text.split(/[^a-zA-Z]+/g);
    if (textWords[0] === "") textWords.shift();
    if (textWords[textWords.length - 1] === "") textWords.pop();

    return textWords
    .reduce(
      function(acc, word){
        var _word = findWord(word);
        if (_word === null) return acc;
        return acc + _word.getWeight();
      }, 
      0
    ).toString();
  };

  function findWord(str){
    for (var i = 0; i < _words.length; i++){
      if (_words[i].getStr() === str) return _words[i];
    }
    return null;
  }
};

module.exports = new RAM();