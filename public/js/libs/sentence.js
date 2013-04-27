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
        setTimeout(function(){
          that.initProp();
        },100);
        event.preventDefault();
      }
    }
  });
};

Sentence.prototype.initProp = function(){
  this.inputText = '';
  $.contextMenu( 'destroy',  '#main');
  this.preLen = 0;
}

Sentence.prototype.get = function($target){
  var that = this;
  this.conv.get('roman', this.inputText, function(err, resp){
    var hiragana = resp.segments[0].text
    that.insFld($target, hiragana, that.insPos, that.insPos + that.preLen);
    that.preLen = hiragana.length;

    $.contextMenu( 'destroy',  '#main'); // エラーになるがとりあえず動くのでそのまま.

    if(hiragana){
    var items = {};
    // ダミー
    items[hiragana] = { name:_.escape(hiragana)};
    items["漢<br>字"] = { name:_.escape("漢<br>字")};
    items["変換"] = { name:_.escape("変換")};
    $.contextMenu({
      selector: '#main',  // キャレット位置取得との関係で、#main を使う.
      trigger: 'none',
      callback: function(key, options) {
        that.insFld($target, key, that.insPos,  that.insPos + that.preLen);
      },
      items: items
    });

    var cp = Measurement.caretPos($target);
    $('#main').contextMenu({
      x: cp.left,
      y: cp.top + 18
    });
    }

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
