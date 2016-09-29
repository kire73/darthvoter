// user schema

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var CounterSchema = Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
});

var counter = mongoose.model('counter', CounterSchema);

   var voterSchema = mongoose.Schema({
       userName: String,
       userPass: String,
       userSince: Date
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

module.exports = voter;