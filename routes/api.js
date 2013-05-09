/**
 * api
 * @author hankei6km
 * @copyright (c) 2013 hankei6km
 * @license MIT License (http://opensource.org/licenses/mit-license.php)
 */
"use strict";

var roman = require('../lib/roman');
var libkkc = require('../lib/node-libkkc');
var predictive = require('../models/predictive')();

var max_nbest = 30;

var modeFuncTbl = {
  roman: function(query, cb){
    var r = roman.conv(query.sentence);
    var resp = {
      segments:[{
        text: r.text,
        candidates: [],
        complete: r.complete
      }]
    }
    cb(null, resp);
  },
  predictive: function(query, cb){
    predictive.getCandidate(query.sentence, function(err, docs){
      if(!err){
        var len = docs.length;
        var candidates = new Array(len);
        for(var idx=0; idx<len; idx++){
          candidates[idx] = {word: docs[idx].word};
        }
        var resp = {
          segments:[{
            text: query.sentence,
            candidates: candidates
          }]
        }
      }
      cb(err, resp);
    }); 
  },
  normal: function(query, cb){
    libkkc.decode(query.sentence, max_nbest, [], function(err, in_segments){
      // 最初のsegmentから文節の区切りの基準を決定し、
      // その区切りにそったものだけを対象としてレスポンスを組み立てる.
      if(!err){
        var segment = in_segments[0];
        var p_len = segment.length;
        var s = new Array(p_len);
        for(var pos=0; pos<p_len; pos++){
          s[pos] = segment[pos].output.length;
        }
        var s_len = s.length;

        var segments = new Array(0);
        var i_len = in_segments.length;
        for(var idx=0; idx<i_len; idx++){
          var segment = in_segments[idx];
          var p_len = segment.length;
          if(s_len == p_len){
            var um = false;
            for(var pos=0; pos<p_len; pos++){
              if(segment[pos].output.length != s[pos]){
                um = true;
                break;
              }
            }
            if(!um){
              segments.push(segment);
            }
          }
        }
      }

      var segment_list = new Array(s_len);
      var i_len = segments.length;
      var p_len = s_len;
      for(var pos=0; pos<p_len; pos++){
        segment_list[pos] = {
          text: segments[0][pos].input,
          candidates: new Array(0)
        }
        for(var idx=0; idx<i_len; idx++){
          var i = segment_list[pos].candidates.indexOf(segments[idx][pos].output);
          if(i < 0){
            segment_list[pos].candidates.push(segments[idx][pos].output);
          }
        }
      }

      cb(err, {segments: segment_list});
    });
  },
  decode: function(query, cb){
    libkkc.decode(query.sentence, max_nbest, [], function(err, segments){
      cb(err, {segments: segments});
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
