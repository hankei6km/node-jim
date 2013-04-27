/**
 * api
 * @author hankei6km
 * @copyright (c) 2013 hankei6km
 * @license MIT License (http://opensource.org/licenses/mit-license.php)
 */
"use strict";

var roman = require('../lib/roman')

var modeFuncTbl = {
  roman: function(query, cb){
    var resp = {
      segments:[
        {
          text: roman.conv(query.sentence),
          candidates: []
        }
      ]
    }
    cb(null, resp);
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
