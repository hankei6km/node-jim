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

var nbest = 10;

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
      s.set_width(data.width);
      s.set_height(data.height);
      s.clear();
      sidx = -1;
    });
    socket.on('add', function (data) {
      if(sidx+1 == data.idx){
        var len = data.pt.length;
        for(var idx=0; idx<len; idx++){
          var pt = data.pt[idx];
          s.add(data.idx, pt.x, pt.y);
        }
        var result = r.classify(s, nbest);

        var size = result.size();
        var v = new Array(size);
        for(var i=0; i<size; i++){
          v[i] = {value:result.value(i),socre:result.score(i)};
        }
        socket.emit('result', {idx: data.idx, results:v});
        sidx++;
      }else{
        socket.emit('error', {message: 'invalid idx = ' + data.idx});
      }
    });
  });

};

