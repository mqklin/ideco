module.exports = {
  textForm: function(text){
    if (typeof(text) === 'undefined' || text === '')
      return 'Please, pass the text';
    return null;
  }
};
