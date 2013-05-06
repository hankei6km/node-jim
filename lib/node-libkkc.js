/**
 * Node.js から libkkc を利用.
 * 実際には Python(PyGObject) のスクリプトを経由して、結果を受け取る.
 * @module node-libkkc
 * @author hankei6km
 * @copyright (c) 2013 hankei6km
 * @license MIT License (http://opensource.org/licenses/mit-license.php)
 */
"use strict"

var path = require('path');
var spawn = require('child_process').spawn;

var decode = function(sentence, nbest, constraints, cb){
  var script = path.join(__dirname, 'node-libkkc.py'); 

  var kkc = spawn('python', [script, sentence, nbest].concat(constraints));

  var stdout = new Buffer(0);
  var stdout_len = 0;
  var stderr = new Buffer(0);
  var stderr_len = 0;

  kkc.stdout.on('data', function(data){
    stdout_len = stdout_len + data.length;
    stdout = Buffer.concat([stdout, data], stdout_len);
  });
  kkc.stderr.on('data', function(data){
    stderr_len = stderr_len + data.length;
    stderr = Buffer.concat([stderr, data], stderr_len);
  });

  kkc.on('exit', function(code){
    var segments =[]
    if(code == 0){
      try{
        segments = JSON.parse(stdout.toString());
      }catch(e){
        code = 1;
        stderr = e.toString();
      }
    }else{
      console.error(stderr.toString());
    }
    cb(code == 0? null: code, segments);
  });
};

exports.decode = decode;
