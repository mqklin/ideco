var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var http = require('http');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ideco');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


var indexRoute = require('./routes/index');
app.use('/', indexRoute);



http.createServer(app).listen('8888');
console.log('Listen server on localhost:8888');