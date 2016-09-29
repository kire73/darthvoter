// Voting app
require('dotenv').config({silent: true});

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient,
  f = require('util').format,
  assert = require('assert');
var app = express();
var path = require('path');
var port = process.env.PORT;
var db = mongoose.connection;
var voter = require('./models/users');
db.on('error', console.error.bind(console, 'connection error:'));

//db.once('open', function() {
  // we're connected!
//});


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



/*
var user = encodeURIComponent(process.env.DB_USER);
var password = encodeURIComponent(process.env.DB_PASS);
var authMechanism = 'DEFAULT';
var authSource = 'myproject';


// Connection URL
var url = f(process.env.DB_URL,
  user, password, authMechanism, authSource);
// Use connect method to connect to the Server
MongoClient.connect(process.env.DB_URL, function(err, db) {
  assert.equal(null, err);
  console.log("Connected to mlab server");

  db.close();
});

*/



app.post('/api/signin', function (req, res){
   var userName = req.body.user;
   var userPass = req.body.password;
   

   console.log("User Login: " + userName + "\nPassword: " + userPass);
    
    // Check db for existing user
    voter.findOne({userName: userName}, function(err,doc){
        if (err){
            console.log(err);
        }
        if (doc){
            console.log(doc);
            if (doc.userPass !== userPass){
                console.log('Incorrect Password');
            } else console.log('User Verified');
        } else {
            console.log('nothing found');
            var newVoter = voter({
                userName: userName,
                userPass: userPass
            });
            newVoter.save(function(err){
                if(err){
                    console.log(err);
                }
                console.log('User added: ' + userName);
            });
        }
    });
});

app.listen(port, function(){
    console.log('App running on port: ' + port);
});