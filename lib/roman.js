"use strict";

var util = require('util');
var chr_convtbl = require('./chr-convtbl');

var roma2hiragana_tbl = chr_convtbl.roma2hiragana;
var roma2hiragana_tbl_len = chr_convtbl.roma2hiragana.length;
var hankaku2zenkaku = chr_convtbl.hankaku2zenkaku;

var get_hiragana = function(txt){
  var ret = {};
  for(var idx=0; idx<roma2hiragana_tbl_len; idx++){
    var item = roma2hiragana_tbl[idx];
    var match = txt.match(item.replace);
    if(match){
      ret.match = true;
      ret.txt = txt.replace(item.replace, item.with);
      ret.hiragana = item.hiragana;
      break;
    }
  }
  return ret;
};

var conv = function(in_txt){
  var ret = '';
  var txt = in_txt;
  while(txt){
    var hiragana_item = get_hiragana(txt);
    if(hiragana_item.match){
      ret = ret + hiragana_item.hiragana;
      txt = hiragana_item.txt;
    }else{
      var chr = txt.substr(0, 1);
      var dbl = hankaku2zenkaku[chr];
      if(dbl){
        ret = ret + dbl;
      }else{
        ret = ret + chr;
      }
      txt = txt.substring(1)
    }
  }
  return ret;
};

exports.conv = conv;
