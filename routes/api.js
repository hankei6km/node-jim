/**
 * api
 * @author hankei6km
 * @copyright (c) 2013 hankei6km
 * @license MIT License (http://opensource.org/licenses/mit-license.php)
 */
"use strict";

var roman = require('../lib/roman')

var modeFuncTbl = {
  roman: function(query){
    var ret = {
      segments:[
        {
          text: query.sentence,
          candidates: [roman.conv(query.sentence)]
        }
      ]
    }
    return ret;
  }
};

exports.conversion = function(req, res){
  var ret = {};
  var modeFunc = modeFuncTbl[req.query.mode];
  if(modeFunc){
    var sentence = req.query.sentence;
    if(sentence){
      ret = modeFunc(req.query);
    }else{
      throw('sentence argument is required.');
    }
  }else{
    throw('mode argument is invalid.');
  }
  res.json(ret);

};
