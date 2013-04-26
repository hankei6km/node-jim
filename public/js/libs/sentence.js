"use strict"

var Sentence = function($textArea){
  this.$textArea = $textArea;
  this.conv = new Conversion();
  
  this.initProp();

  var that = this;
  $textArea.keydown(function(event){
    var chr = String.fromCharCode(event.which);
    var $target = $(event.target);
    if (('A' <= chr && chr <= 'Z')) {
      if(that.inputText === ''){
        that.insPos = $target.prop("selectionStart");
      }
      that.inputText = that.inputText + chr.toLocaleLowerCase();
      that.get($target);
      event.preventDefault();
    }else if(event.keyCode == 8){
      if(that.inputText){
        that.inputText = that.inputText.substr(0, that.inputText.length-1);
        that.get($target);
        event.preventDefault();
      }
    }else if(event.keyCode == 13){
      if(that.inputText){
        that.initProp();
        event.preventDefault();
      }
    }
  });
};

Sentence.prototype.initProp = function(){
  this.inputText = '';
  this.preLen = 0;
}

Sentence.prototype.get = function($target){
  var that = this;
  this.conv.get('roman', this.inputText, function(err, resp){
    var hiragana = resp.segments[0].text
    that.insFld($target, hiragana, that.insPos, that.insPos + that.preLen);
    that.preLen = hiragana.length;
  });
};

Sentence.prototype.insFld = function($target, insTxt, insStartPos, insEndPos){
  var startPos = insStartPos;
  var endPos = insEndPos;
  if(typeof(insStartPos) == 'undefined'){
    startPos = $target.prop("selectionStart");
  }
  if(typeof(insEndPos) == 'undefined'){
    endPos = $target.prop("selectionEnd");
  }
  var t = $target.val();
  var p = t.substr(0, startPos);
  var s = t.substring(endPos);
  $target.val(p + insTxt+ s);
  var pos = startPos + insTxt.length;
  $target.prop("selectionStart", pos);
  $target.prop("selectionEnd", pos);
}
