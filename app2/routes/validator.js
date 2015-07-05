function isFloat(str){
  if (/^[-+]?[0-9]*[\.\,]?[0-9]+$/.test(str)) return true; 
  else return false;
}

function isWord(str){
  if (/^[a-zA-Z]+$/.test(str)) return true;
  return false;
}

module.exports = {
  addOrChangeForm: function(word){
    if (typeof(word.str) === 'undefined' || word.str === '')
      return 'Please, pass a word';
    if (typeof(word.weight) === 'undefined' || word.weight === '')
      return 'Please, pass a weight';
    if (!isWord(word.str)) 
      return 'This is not a word';
    if (!isFloat(word.weight)) 
      return 'Your`s weight is not a number';
    return null;
  },

  toFloat: function(str){
    return parseFloat(str.replace(',', '.'));
  },

  textForm: function(text){
    if (typeof(text) === 'undefined' || text === '')
      return 'Please, pass the text';
    return null;
  }
};
