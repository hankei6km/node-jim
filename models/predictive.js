var mongoose = require('mongoose');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
});

var reading_params = require('../lib/reading-params');

module.exports = function(in_connection_string){
  var connection_string = 
    in_connection_string ? in_connection_string : 'mongodb://localhost/node-jim';
  mongoose.connect(connection_string);

  var predictiveSchema = mongoose.Schema({
    cost: Number,
    reading: String,
    word: String
  });
  predictiveSchema.index({
    reading: 1
  });
  predictiveSchema.set('autoIndex', false);
  var predictive = mongoose.model('predictive', predictiveSchema)


  return {
    create: function(arr, cb){
      predictive.create(arr, cb);
    },
    getCandidate: function(reading, cb){
      if(reading){
        var p = reading_params(reading);
        var r = p.readingRegExp;
      }else{
        var r = '';
      }
      predictive.find({
        reading:r
      },'word' ,{
        limit:30,
        sort: {
          cost: 1
        }
      }, cb);
    },
    removeAll: function(cb){
      predictive.remove({}, cb);
    },
    disconnect: function(cb){
      mongoose.disconnect(cb);
    }
  };
};

