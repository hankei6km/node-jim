"use strict"
var Sentence = function($textArea, contextMenuSelector){
  this.$textArea = $textArea;
  this.contextMenuSelector = contextMenuSelector;
  this.conv = new Conversion();
  this.status = true;
  
  this.initProp();

  var that = this;

  // 変換候補が選択されているかの判定.
  // このクラス内で登録したメニューかの識別はおこなっていない.
  // クラスが破棄されたあとの動作は考えていない.
  $(document.body).on("contextmenu:focus", ".context-menu-item", 
                      function(e){ 
                        that.focusedContextMenuItem = e.target.textContent;
                        if(that.isPreEdit()){
                          that.insFld(that.$target, that.focusedContextMenuItem, that.insPos,
                                      that.insPos + that.preLen);
                          that.preLen = that.focusedContextMenuItem.length;
                        }
                      });
  $(document.body).on("contextmenu:blur", ".context-menu-item",
                      function(e){ 
                        that.focusedContextMenuItem = '';
                      });

  $textArea.keydown(function(event){
    var $target = $(event.target);
    if(event.keyCode == 8){
      if(that.isPreEdit()){
        if(that.inputText){
          that.inputText = that.inputText.substr(0, that.inputText.length-1);
        }else{
          that.hiragana = that.hiragana.substr(0, that.hiragana.length-1);
        }
        that.get($target);
        event.preventDefault();
      }
    }else if(event.keyCode == 27){
      if(that.isPreEdit()){
        if(that.focusedContextMenuItem){
          that.get($target);
        }else{
          that.insFld($target, '', that.insPos, that.insPos + that.preLen);
          that.initProp();
        }
        event.preventDefault();
      }
    }else if(event.keyCode == 13){
      if(that.isPreEdit()){
        setTimeout(function(){
          that.initProp();
        },100);
        event.preventDefault();
      }
    }else if(event.ctrlKey && event.keyCode == 74){
      if(that.isPreEdit()){
        var katakana = Roman2Hiragana.katakana(that.hiragana + that.inputText).text;
        that.insFld(that.$target, katakana, that.insPos,
                    that.insPos + that.preLen);
        that.preLen = katakana.length;
        that.katakana = true;
      }else{
        that.status = !that.status;
      }
      event.preventDefault();
    }
  });
  $textArea.keypress(function(event){
    if(that.status){
      var chr = String.fromCharCode(event.which);
      var $target = $(event.target);
      var code = event.keyCode != 0 ? event.keyCode: event.charCode;
      if ((32 <= code && code < 127)) {
        if(that.focusedContextMenuItem || that.katakana){
          // 選択中の候補があったので、確定する.
          that.initProp();
        }
        if(!that.isPreEdit()){
          that.insPos = $target.prop("selectionStart");
        }
        that.inputText = that.inputText + chr.toLocaleLowerCase();
        that.get($target);
        event.preventDefault();
      }
    }
  });
  $textArea.keyup(function(event){
  })
};

Sentence.prototype.initProp = function(){
  this.inputText = '';
  this.hiragana = '';
  $.contextMenu( 'destroy', this.contextMenuSelector);
  this.$target = null;
  this.katakana = false;
  this.preLen = 0;
}

Sentence.prototype.isPreEdit = function(){
  return !(this.inputText === '' && this.hiragana === '');
};

Sentence.prototype.get = function($target){
  var that = this;
  this.$target = $target;

  // ローマ字へ変換.
  var conv = Roman2Hiragana.conv(this.inputText);
  if(conv.complete){
    // ローマ字へ変換が完了(ひらがな確定とほぼ同義)
    this.hiragana = this.hiragana + conv.text;
    conv.text = '';
    // 入力中のテキストはクリア.
    this.inputText = '';
  }
  var sentence = this.hiragana + conv.text;
  this.insFld($target, sentence, this.insPos, this.insPos + this.preLen);
  this.preLen = sentence.length;

  this.conv.get('predictive', sentence, function(err, resp){
    if(!err){
      // エラーになるがとりあえず動くのでそのまま.
      $.contextMenu( 'destroy',  that.contextMenuSelector);

      if(sentence){
        var candidates = resp.segments[0].candidates;
        var len = candidates.length; 
        if(len > 0){
          // 推測変換候補をitemsにする.
          var items = {};
          for(var idx=0; idx<len; idx++){
            var word = candidates[idx];
            items[word] = {name: _.escape(word)};
          }

          $.contextMenu({
            selector: that.contextMenuSelector,
            trigger: 'none',
            position: function(opt, x, y){
              var $win = $(window);
              var bottom = $win.scrollTop() + $win.height();
              var height = opt.$menu.height()
              if(y + height > bottom){
                y = bottom - height 
                if(y < 0){
                  y = 0;
                }
                x = x + 8; // ここの値は本来ならフォントサイズから求めるべきだが
              }
              opt.$menu.css({top: y, left: x});
            },
            callback: function(key, options) {
              that.insFld($target, key, that.insPos,  that.insPos + that.preLen);
            },
            items: items
          });

          var cp = Measurement.caretPos($target);
          $(that.contextMenuSelector).contextMenu({
            x: cp.left,
            y: cp.top + 18  // ここの値は本来ならフォントサイズから求めるべきだが
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
