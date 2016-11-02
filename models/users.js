// user schema

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var CounterSchema = Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
});

var counter = mongoose.model('counter', CounterSchema);

var ObjectId = mongoose.Schema.Types.ObjectId;

/*
voterSchema.methods.addPoll = function(err, pollFormData){
    var poll = pollFormData;
    if (err){ console.log(err)} else console.log(poll);
};
*/


var userSchema = mongoose.Schema({
    local: {
        email: String,
        password: String,
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    }
});





var choiceSchema = mongoose.Schema({
    forPoll: String,
    choices: Array,
    votesCast: Number
    });
    
var ballot = mongoose.Schema({
    voter: String,
    vote: String
});

var pollSchema = mongoose.Schema({
    title: String,
    author: String,
    pollSince: Date,
    choices: choiceSchema,
    voters: [ballot]
});

var voterSchema = mongoose.Schema({
    userName: String,
    userPass: String,
    userSince: Date,
    authorOf: [pollSchema],
    ballots: [ballot],
    id: ObjectId
});

var voter = mongoose.model('voter', voterSchema);
voterSchema.pre('save', function(next){
    var doc = this;
  

    counter.findByIdAndUpdate({_id: 'voter_count'}, {$inc: {seq: 1} }, function(error, counter) {
      if (error) {
          return next(error);
      }
      
      doc._id = counter.seq;
      doc.created_at = new Date();
      next();
  });
});

var poll = mongoose.model('poll', pollSchema);
pollSchema.pre('save', function(next){
    
    var doc = this;
    counter.findByIdAndUpdate({_id: 'poll_count'}, {$inc: {seq: 1} }, function(error, counter) {
      if (error) {
          return next(error);
      }
      
      doc._id = counter.seq;
      doc.created_at = new Date();
      next();
  });
  
});



userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
var User = mongoose.model('User', userSchema);


var choices = mongoose.model('choices', choiceSchema);


module.exports = {
    User: User,
    voter: voter,
    poll: poll,
    choices: choices
};