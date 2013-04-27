"use strict"

var Sentence = function($textArea, contextMenuSelector){
  this.$textArea = $textArea;
  this.contextMenuSelector = contextMenuSelector;
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
  $.contextMenu( 'destroy', this.contextMenuSelector);
  this.preLen = 0;
}

Sentence.prototype.get = function($target){
  var that = this;
  this.conv.get('roman', this.inputText, function(err, resp){
    if(!err){
      var hiragana = resp.segments[0].text
      that.insFld($target, hiragana, that.insPos, that.insPos + that.preLen);
      that.preLen = hiragana.length;

      // エラーになるがとりあえず動くのでそのまま.
      $.contextMenu( 'destroy',  that.contextMenuSelector);

      if(hiragana){
        var candidates = resp.segments[0].candidates;
        var len = candidates.length; 
        if(len > 0){
          // 推測変換候補をitemsにする.
          var items = {};
          for(var idx=0; idx<len; idx++){
            var word = candidates[idx].word;
            items[word] = {name: _.escape(word)};
          }

          $.contextMenu({
            selector: that.contextMenuSelector,
            trigger: 'none',
            callback: function(key, options) {
              that.insFld($target, key, that.insPos,  that.insPos + that.preLen);
            },
            items: items
          });

          var cp = Measurement.caretPos($target);
          $(that.contextMenuSelector).contextMenu({
            x: cp.left,
            y: cp.top + 18
          });
        }
      }
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
