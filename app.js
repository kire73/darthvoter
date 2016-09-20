// Voting app
require('dotenv').config({silent: true});

var db = require('mongodb');
db.connect({
  url: process.env.DB_URL,
  appUrl: process.env.APP_URL,
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS
});
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var path = require('path');
var port = process.env.PORT;


// create a connection to our MongoDB
mongoose.connect(process.env.DB_URL);
mongoose.Promise = global.Promise;

// for c9 use : 'mongodb://' + config.db.host + '/' + config.db.name

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// tell Express to serve files from public folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, function(){
    console.log('App running on port: ' + port);
});