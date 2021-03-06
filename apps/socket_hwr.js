/** 
 * socket.idで手書認識.
 * @module socket_hwr
 * @author hankei6km
 * @copyright (c) 2013 hankei6km
 * @license MIT License (http://opensource.org/licenses/mit-license.php)
 */

"use strict";

var socket_io = require('socket.io');
var zinnia = require('../lib/node-zinnia');

var r = zinnia.Recognizer();
if(!r.open('/usr/lib/zinnia/model/tomoe/handwriting-ja.model')){
  console.error('can\'t load model file.');
}

module.exports = function(server){

  var io = socket_io.listen(server);
  io.sockets.on('connection', function (socket) {

    var s = zinnia.Character();
    var sidx = -1;

    socket.on('clear', function (data) {
      try{
        s.set_width(data.width);
        s.set_height(data.height);
        s.clear();
        sidx = -1;
      }catch(e){
        sendErr(e)
      }
    });
    socket.on('add', function (data) {
      if(sidx+1 == data.idx){
        try{
          var len = data.pt.length;
          for(var idx=0; idx<len; idx++){
            var pt = data.pt[idx];
            s.add(data.idx, pt.x, pt.y);
          }
          r.classify(s, data.nbest,function(result){
            var size = result.size();
            var v = new Array(size);
            for(var i=0; i<size; i++){
              v[i] = {value:result.value(i),score:result.score(i)};
            }
            socket.emit('result', {idx: data.idx, results:v});
          });
          sidx++;
        }catch(e){
          sendErr(e)
        }
      }else{
        sendErr('invalid idx = ' + data.idx);
      }
    });
    var sendErr = function(in_message){
      var message = in_message;
      if(typeof(in_message) != 'stringr'){
        message = in_message.toString();
      }
      socket.emit('error', {message: message});
    };

  });

};

