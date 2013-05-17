/**
 * @file 手書き認識のテスト.
 * @author hankei6km
 * @copyright (c) 2013 hankei6km
 * @license MIT License (http://opensource.org/licenses/mit-license.php)
 */
"use strict"
QUnit.module('hwr');

var tbl = [
  {value:'春', score: -0.46128183603286743},
  {value:'香', score: -0.9831210374832153},
  {value:'佶', score: -1.0071184635162354},
  {value:'背', score: -1.1851245164871216},
  {value:'酋', score: -1.2426910400390625},
  {value:'俺', score: -1.2706456184387207},
  {value:'孝', score: -1.294053077697754},
  {value:'牛', score: -1.3154493570327759},
  {value:'荅', score: -1.3300784826278687},
  {value:'柏', score: -1.3346201181411743},
];

QUnit.asyncTest( 'normal result', function() {
  var socket = io.connect();
  socket.emit('clear', {width:300, height:300});

  var cnt = 0;
  socket.on('result', function(data){
    cnt++
    if(data.idx == 8){
      var len = data.results.length;
      equal(len, 10, 'results.length');
      for(var idx=0; idx<len; idx++){
          equal(data.results[idx].value, tbl[idx].value,
                'results[' + idx + ']');
          equal(Math.round(data.results[0].score*10)/10, 
                Math.round(tbl[0].score*10)/10,
                'result.score(' + idx + ')');
      }
    }
    if(cnt == 8){
      QUnit.start();
    }
  });
  socket.on('error', function(data){
    equal(data.message, 'invalid idx = 1', 'invalid idx check');
  });

  socket.emit('add', {nbest:10, idx: 0, pt:[{x:51, y:29},{x:117, y:41}]});
  socket.emit('add', {nbest:10, idx: 1, pt:[{x:99, y:65},{x:219, y:77}]});
  socket.emit('add', {nbest:10, idx: 2, pt:[{x:27, y:131},{x:261, y:131}]});
  socket.emit('add', {nbest:10, idx: 3, pt:[{x:129, y:17},{x:57, y:203}]});
  socket.emit('add', {nbest:10, idx: 1, pt:[{x:99, y:65},{x:219, y:77}]}); //invalid idx
  socket.emit('add', {nbest:10, idx: 4, pt:[{x:111, y:71},{x:219, y:173}]});
  socket.emit('add', {nbest:10, idx: 5, pt:[{x:81, y:161},{x:93, y:281}]});
  socket.emit('add', {nbest:10, idx: 6, pt:[{x:99, y:167},{x:207, y:167},{x:189, y:245}]});
  socket.emit('add', {nbest:10, idx: 7, pt:[{x:99, y:227},{x:189, y:227}]});
  socket.emit('add', {nbest:10, idx: 8, pt:[{x:111, y:257},{x:189, y:245}]});

});
