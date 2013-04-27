/**
 * api
 * @author hankei6km
 * @copyright (c) 2013 hankei6km
 * @license MIT License (http://opensource.org/licenses/mit-license.php)
 */
"use strict";

var roman = require('../lib/roman')
var predictive = require('../models/predictive')();

var modeFuncTbl = {
  roman: function(query, cb){
    var hiragana = roman.conv(query.sentence);
    predictive.getCandidate(hiragana, function(err, docs){
      if(!err){
        var len = docs.length;
        var candidates = new Array(len);
        for(var idx=0; idx<len; idx++){
          candidates[idx] = {word: docs[idx].word};
        }
        var resp = {
          segments:[
            {
            text: roman.conv(query.sentence),
            candidates: candidates
          }
          ]
        }
      }
      cb(err, resp);
    }); 
  }
};

exports.conversion = function(req, res){
  var modeFunc = modeFuncTbl[req.query.mode];
  if(modeFunc){
    modeFunc(req.query, function(err, resp){
      res.json(resp);
    });
  }else{
    throw('mode argument is invalid.');
  }
};
