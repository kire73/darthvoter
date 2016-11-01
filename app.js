// Voting app
require('dotenv').config({silent: true});
 var jsdom = require('jsdom').jsdom;
 var document = jsdom('<html></html>', {});
 var window = document.defaultView;
 var $ = require('jquery')(window);
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient,
  f = require('util').format,
  assert = require('assert');
var path = require('path');
var port = process.env.PORT;
var db = mongoose.connection;
var users = require('./models/users');
db.on('error', console.error.bind(console, 'connection error:'));
var express = require('express'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    MongoStore = require('connect-mongo')(session),
    app = express();
var router = express.Router();
var mess, userVal, pollReview = "";
var moreBars = 0;
var ejs = require('ejs');
var logIn = require('./public/javascripts/userClient.js');
app.use(cookieParser());
app.use(session({
    mongooseConnection: mongoose.connection,
     secret: 'd4r7hp0115',
     resave: false,
     saveUninitialized: true,
     db: 'darthpolls'
}));
app.use('/', router);
app.set('view engine', 'ejs');  //tell Express we're using EJS
app.set('views', __dirname + '/views');  //set path to *.ejs files
//put your static files (js, css, images) into /public directory
app.use('/public', express.static(__dirname + '/public'));

// create a connection to mlab
mongoose.connect(process.env.DB_URL);
mongoose.Promise = global.Promise;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// tell Express to serve files from public folder
app.use(express.static(path.join(__dirname, 'public')));

/*
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'index.html'));
});
*/


app.post('/api/signin', function logMeIn(req, res){
   var userName = req.body.user;
   var userPass = req.body.password;
   var state = verifyUser(userName, userPass);
       // Check db for existing user
       
       
function deny (){
    mess = "Incorrect Password for ";
    userVal = userName;
    return mess, userVal;
}
function validate (){
    mess = "Welcome back, ";
    userVal = req.session.user;
    return mess, userVal;
}
function missing (){
    mess = "Must be Registered";
    userVal = undefined;
    return mess, userVal;
}
function verifyUser (userName, userPass, userVal){
    users.voter.findOne({userName: userName}, function(err, doc){
        if (err){
            console.log("Invalid User\n" + err + "<--error");
            return missing().userVal;
        }
        if (doc){ // User found
            console.log("User Found");
            if (doc.userPass !== userPass){ //Verify correct pass
                console.log('Incorrect Password entered');
                return deny(userVal);
            } else {
                // Correct info. Log in User
                req.session.user = userName;
                console.log("logged in as: " + req.session.user);
                return validate().mess, validate().userVal;
            }
        } else { // No matching users. Create new log in
            console.log('Must be Registered');
            return missing().userVal;
        }
    });
}
   console.log("User Login: " + userName);
    $("#userVal").html(mess + userVal);
});

var currentUser = function (err, userVal, mess){
    if (err) console.log(err + '<--error');
    if (userVal !== ""){
        console.log('new method for: ' + userVal);
    }
};

app.get('/ajax', function(req, res) {
    //render index.ejs file
    res.send(currentUser());
    res.render('index.ejs', {
        userVal: userVal,
        mess: mess
    });
});

app.get('/users', function(req, res) {
    users.voter.find(function(err, voters){
        if (err) console.log(err);
        res.send(voters);
    });
});

app.get('/polls', function(req, res){
    users.poll.find(function(err, poll){
        if (err) console.log('err: ' + err);
        res.send(poll);
    });
});

app.get('/choices', function(req, res){
    users.choices.find(function(err, choices){
        if (err) console.log('err: ' + err);
        res.send(choices);
    });
});




app.get('/?', function(req, res) {
    //render index.ejs file
    var viewPolls = "";
    var i = 0;
    users.poll.find().cursor()
    .on('data', function(doc){
      i++;
      var choose = "";
      var options = users.choices.find(doc.choices).cursor()
      .on('data', function(fil){
          choose = JSON.stringify(fil.choices);
          console.log(fil);
      });
    viewPolls += "<div class='poll'><h3>" + doc.title + "</h3><table><tr><th>Author:</th><td> " + doc.author + "</td></tr><tr><th>Created:</th><td> " + doc.pollSince + "</td></tr><tr><th>Options:</th><td> " + options + "</td></tr><tr><th>Voters:</th><td> " +  doc.voters + "</td></tr></table></div>";
  })
  .on('error', function(err){
    console.log(err);
  })
  .on('end', function(){
    res.render('index.ejs', {
        userVal: userVal,
        mess: mess,
        pollData: viewPolls
    });
  });
});


app.post('/api/signup', function (req, res){
   var userName = req.body.user;
   var userPass = req.body.password;
   var state = verifyUser(userName, userPass);
 // Check db for existing user
       
       
function deny (){
    mess = "User Name taken. Incorrect Password for ";
    userVal = userName;
    console.log('UN taken/Incorrect Password for: ' + userName);
    return userVal;
}
function validate (){
    mess = " already registered! Welcome back";
    userVal = req.session.user;
    return userVal;
}
function register (){
    mess = "Welcome to the Darkside, ";
    userVal = userName;
    var newVoter = users.voter({
        userName: userName,
        userPass: userPass
    });
    newVoter.save(function(err){
        if(err){
            console.log(err);
        }
        console.log('User added: ' + userName);
    });
    return userVal;
}
function verifyUser (userName, userPass, userVal){
    users.voter.findOne({userName: userName}, function(err, doc){
        if (err){
            console.log("Invalid User\n" + err + "<--error");
            return userVal;
        }
        if (doc){ // User name taken
            console.log("User Taken");
            if (doc.userPass !== userPass){ //Verify correct pass
                return deny().userVal;
            } else {
                // Correct info. Log in User
                req.session.user = userName;
                console.log("Already Registered! " + req.session.user);
                return validate().userVal;
            }
        } else { // No matching users. Create new log in
            req.session.user = userName;
            return register().userVal;
        }
    });
    
}
   console.log("New User Login: " + userName);
    $("#userVal").html(userVal);
});



app.get('/newPost', function(req, res){
    if (userVal == "" || userVal == undefined){
        console.log('Hold on to yer butts...')
    } else res.render('newPost.ejs', {
        userVal: userVal,
        moreBars: moreBars
    });
});

app.post('/newPost', function(req, res){
  console.log(req.body);
    var choicesGiven = req.body.choices;
    var title = req.body.title;
    
        var addChoice = users.choices({
            forPoll: title,
            choices: choicesGiven,
            votesCast: 0
        });
        addChoice.save(function(err){
          if(err){
            console.log(err);
          }
          console.log('Choices added: ' + choicesGiven);
        });
    var choice = function(err, doc){
        if (err) console.log(err);
        if (doc) return doc;
    };
    users.choices.findOne({choices: choicesGiven}, choice());
    var newPoll = users.poll({
      title: title,
      author: userVal,
      pollSince: new Date,
      choices: choice
    });
    newPoll.save(function(err){
        if(err){
            console.log(err);
        }
        console.log('Poll added: ' + title);
        pollReview = newPoll;
        res.redirect('/pollAdded');
    });
    users.poll.findOne({title: title}, function(err, doc){
        if (err) console.log(err);
        if (doc) console.log(doc.choices);
        });
    
    return userVal;
    
});

app.get('/pollAdded', function(req, res){
    var pollMade = "<div class='poll'><h3>" + pollReview.title + "</h3><table><tr><th>Author:</th><td> " + pollReview.author + "</td></tr><tr><th>Created:</th><td> " + pollReview.pollSince + "</td></tr><tr><th>Options:</th><td> " + pollReview.choices + "</td></tr><tr><th>Voters:</th><td> " +  pollReview.voters + "</td></tr></table></div>";
      console.log(pollReview);
        if (userVal == "" || userVal == undefined){
            console.log('Hold on to yer butts...');
            res.send('Error 1337: User not logged in');
        } else res.render('pollAdded.ejs', {
            userVal: userVal,
            pollReview: pollMade
        });
    
          $("#home").on("click", function(req, res){
              console.log('redirecting from server');
            res.redirect('/');
          });
    
});


app.listen(port, function(){
    console.log('App running on port: ' + port);
});