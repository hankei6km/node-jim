var mongoose = require('mongoose');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
});


module.exports = function(in_connection_string){
  var connection_string = 
    in_connection_string ? in_connection_string : 'mongodb://localhost/node-jim';
  mongoose.connect(connection_string);

  var predictiveSchema = mongoose.Schema({
    cost: Number,
    reading: String,
    word: String
  })
  var predictive = mongoose.model('predictive', predictiveSchema)


  return {
    create: function(arr, cb){
      predictive.create(arr, cb);
    },
    getCandidate: function(reading, cb){
      var r = new RegExp('^'+ reading, 'i');
      predictive.find({
        reading:r
      },'word' ,{
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

