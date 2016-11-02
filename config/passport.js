var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var users = require('../models/users');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(User, done) {
        done(null, User.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        users.User.findById(id, function(err, User) {
            done(err, User);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        users.User.findOne({ 'local.email' :  email }, function(err, User) {
            // if there are any errors, return the error
            console.log('searching for existing user...');
            if (err){
                console.log(err);
                return done(err);
            }
            // check to see if theres already a user with that email
            if (User) {
                console.log('user found: ' + User);
                return done(null, false, req.flash('signupMessage', 'That email is already registered.'));
            } else {

                // if there is no user with that email
                // create the user
                var newUser = new users.User();

                // set the user's local credentials
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password);

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

        });

    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form
        console.log('looking for local user...');
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        users.User.findOne({ 'local.email' :  email }, function(err, User) {
            // if there are any errors, return the error before anything else
            if (err){
                console.log(err);
                return done(err);
            }
            // if no user is found, return the message
            if (!User){
                console.log('Cannot find the user: ' + User);
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            }
            // if the user is found but the password is wrong
            if (!User.validPassword(password)){
                console.log('Incorrect password for ' + User);
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
            }
            // all is well, return successful user
            console.log('all finished');
            return done(null, User);
        });

    }));

};
