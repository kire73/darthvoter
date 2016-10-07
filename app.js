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
var voter = require('./models/users');
db.on('error', console.error.bind(console, 'connection error:'));
var express = require('express'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    MongoStore = require('connect-mongo')(session),
    app = express();
var router = express.Router();
var userVal = "";
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
    userVal = "Incorrect Password for " + userName;
    return userVal;
}
function validate (){
    userVal = "Welcome back, " + req.session.user;
    return userVal;
}
function missing (){
    userVal = "Must be Registered";
    return userVal;
}
    function verifyUser (userName, userPass, userVal){
    voter.findOne({userName: userName}, function(err, doc){
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
                return validate().userVal;
            }
        } else { // No matching users. Create new log in
            console.log('Must be Registered');
            return missing().userVal;
        }
    });
    
}

   console.log("User Login: " + userName + "\nPassword: " + userPass + "\nStatus: " + userVal + "\nCurrent: " + req.session.user);
    console.log(state);
    $("#userVal").html(userVal);
});

var currentUser = function (err, userVal){
    if (err) console.log(err + '<--error');
    if (userVal !== ""){
        console.log('new method for: ' + userVal);
    }
};

app.get('/ajax', function(req, res) {
    //render index.ejs file
    res.send(currentUser());
    res.render('index.ejs', {userVal: userVal});
});

app.get('/?', function(req, res) {
    //render index.ejs file
    res.render('index.ejs', {userVal: userVal});
});

app.post('/api/signup', function (req, res){
   var userName = req.body.user;
   var userPass = req.body.password;
   logIn.userClient(userName, userPass);
   console.log("Registering User: " + userName + "\nPassword: " + userPass);
    
    // Check db for existing user
    voter.findOne({userName: userName, userPass: userPass}, function(err, doc){
        if (err){
            console.log("User Taken");
            userVal += "<p>Invalid User</p>";
        }
        if (doc){ // User found
            console.log("User already exists");
            if (doc.userPass !== userPass){ //Verify correct pass
                console.log('User Taken/Incorrect Password');
                userVal = "User taken/Incorrect Password";
                doc.send("User taken/Incorrect password");
            } else {
                // Already registered. Log in User
                console.log('User Verified');
                req.session.user = userName;
                console.log("logged in as: " + req.session.user);
                userVal += "<p>Already registered! Logged in User</p>";
            }
        } else { // No matching users. Create new log in
            console.log('New User');
            userVal = "<p>Invalid User</p>";
            res.status(err, "showAlert");
            $("#loginMess").html(userVal);
            
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
    $("#loginMess").html("<h1>wtf</h1>");
});

app.listen(port, function(){
    console.log('App running on port: ' + port);
});