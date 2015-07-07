$(document).ready(function(){
  refreshWordsTable();
  setInterval(refreshWordsTable, 10000);
});

function refreshWordsTable(){
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function(){
    var res = xhr.responseText;
    var words = JSON.parse(res).words;

    $('#wordsTable tr:not(:first)').remove(); // удаляем старую таблицу, оставляя заголовки
    var s;
    words.forEach(function(word){
      s += '<tr>';
      s += '<td>';
      s += word.str;
      s += '</td>';
      s += '<td>';
      s += word.weight;
      s += '</td>';
      s += '<td>';
      s += '<button str="'+word.str+'" onclick="editWeight(this)">EDIT</button>'
      s += '</td>';
      s += '<td>';
      s += '<button str="'+word.str+'" onclick="deleteWord(this)">DELETE</button>'
      s += '</td>';
      s += '</tr>';
    });
    s = $.parseHTML(s);
    $('#wordsTable').append(s);
  };

  xhr.open('GET', 'http://localhost:8888/word', true);
  xhr.send(null);

}

function deleteWord(that){
  if (confirm("Are you sure?") !== true) return;
  var wordToDelete = $(that).attr('str');
  var xhr = new XMLHttpRequest();
  xhr.open('DELETE', 'http://localhost:8888/word/' + wordToDelete, true);
  xhr.send(null);
  xhr.onreadystatechange = refreshWordsTable;
}

function editWeight(that){
  var wordToEdit = $(that).attr('str');
  var newWeight = prompt("Please, enter new weight for word `" + wordToEdit+"`");
  if (newWeight != null) {
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', 'http://localhost:8888/word/' + wordToEdit, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send("weight="+newWeight);
    xhr.onreadystatechange = refreshWordsTable;
  }
}

function div_show() {
  $('#addNewWordForm').show();
}

function div_hide(){
  $('#addNewWordForm').hide();
}

function addWord(){
  var str = $('#str').val();
  var weight = $('#weight').val();
  div_hide();
  $('#str').val("");
  $('#weight').val("");
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:8888/word/', true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send("str="+str+"&weight="+weight);
  xhr.onreadystatechange = refreshWordsTable;
}

function getWeight(){
  var text = $("#textarea").val();
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:8889/text/', true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send("text="+text);
  xhr.onreadystatechange = function(){
    var res = xhr.responseText;
    var weight = JSON.parse(res).weight;
    $("#weightSpan").text(weight);
    if (!weight) $("#weightSpan").text(0);
  }
}