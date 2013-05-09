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
                          var s = that.getSeledTxt(that.focusedContextMenuItem);
                          that.insFld(that.$target, s.txt, that.insPos,
                                      that.insPos + that.preLen, s.dlt);
                          that.preLen = s.txt.length;
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
        that.predictive($target);
        event.preventDefault();
      }
    }else if(event.keyCode == 27){
      if(that.isPreEdit()){
        if(that.focusedContextMenuItem){
          that.predictive($target);
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
    }else if(event.keyCode == 32){
      if(that.isPreEdit()){
        if(that.popuped){
          that.$menu.trigger('nextcommand');
        }else{
          that.normal($target);
        }
        event.preventDefault();
      }
    }else if(event.keyCode == 37){
      if(that.isPreEdit() && that.segmentsInfo){
        that.switchSegment(that.$target, -1);
        event.preventDefault();
      }
    }else if(event.keyCode == 39){
      if(that.isPreEdit() && that.segmentsInfo){
        that.switchSegment(that.$target, 1);
        event.preventDefault();
      }
    }
  });
  $textArea.keypress(function(event){
    if(that.status){
      var chr = String.fromCharCode(event.which);
      var $target = $(event.target);
      //var code = event.keyCode != 0 ? event.keyCode: event.which;
      var code = event.which
      if ((32 < code && code < 127)) {
        if(that.focusedContextMenuItem || that.katakana){
          // 選択中の候補があったので、確定する.
          var pos = that.insPos + that.preLen;
          $target.prop("selectionStart", pos);
          $target.prop("selectionEnd", pos);
          that.initProp();
        }
        if(!that.isPreEdit()){
          that.insPos = $target.prop("selectionStart");
        }
        that.inputText = that.inputText + chr.toLocaleLowerCase();
        that.predictive($target);
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
  this.segmentsInfo = null;
  $.contextMenu( 'destroy', this.contextMenuSelector);
  this.popuped = false;
  this.$target = null;
  this.katakana = false;
  this.preLen = 0;
}

Sentence.prototype.setSegmentsInfo = function(segments){
  var len = segments.length;
  var sels = new Array(len);
  for(var idx=0; idx<len; idx++){
    sels[idx] = segments[idx].candidates[0];
  }

  this.segmentsInfo = {
    curpos: 0,
    segments: segments,
    sels: sels
  };
}

Sentence.prototype.getSeledTxt = function(in_txt, in_pos){
  var ret = {
    txt: in_txt,
    dlt: null
  }
  if(this.segmentsInfo){
    ret.txt = '';
    var pos = typeof(in_pos)!='undefined'? in_pos: this.segmentsInfo.curpos;
    if(typeof(in_txt)!='undefined'){
      this.segmentsInfo.sels[pos] = in_txt;
    }
    var len = this.segmentsInfo.segments.length;
    for(var idx=0; idx<len; idx++){
      ret.txt = ret.txt + this.segmentsInfo.sels[idx];
    }
    ret.dlt = 0;
    for(var idx=0; idx<=pos; idx++){
      ret.dlt = ret.dlt + this.segmentsInfo.sels[idx].length;
    }

  }
  return ret;
}

Sentence.prototype.isPreEdit = function(){
  return !(this.inputText === '' && this.hiragana === '');
};

Sentence.prototype.predictive = function($target){
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

  this.get('predictive', sentence, $target);
  this.popuped = false;
};

Sentence.prototype.normal = function($target){
  var sentence = this.hiragana;
  this.get('normal', sentence, $target);
  this.popuped = true;
};

Sentence.prototype.get = function(mode, sentence, $target){
  var that = this;
  this.segmentsInfo = null;
  this.conv.get(mode, sentence, function(err, resp){
    if(!err){
      // エラーになるがとりあえず動くのでそのまま.
      $.contextMenu( 'destroy',  that.contextMenuSelector);

      if(sentence){
        if(mode == 'normal'){
          that.setSegmentsInfo(resp.segments);
        }
        var candidates = resp.segments[0].candidates;
        var len = candidates.length; 
        if(len > 0){
          that.setPopupItem(mode, $target, candidates, function(opt){
            if(mode == 'normal'){
              // 通常の変換ならば、最初の項目を選択しておく.
              opt.$menu.trigger('nextcommand');
            }
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

Sentence.prototype.setPopupItem = function(mode, $target, candidates, cb){
  var len = candidates.length; 

  // 推測変換候補をitemsにする.
  var items = {};
  for(var idx=0; idx<len; idx++){
    var word = candidates[idx];
    items[word] = {name: _.escape(word)};
  }

  var that = this;
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
      if(cb){
        cb(opt);
      }
      that.$menu = opt.$menu;
    },
    callback: function(key, options) {
      that.insFld($target, that.getSeledTxt(key).txt,
                  that.insPos,  that.insPos + that.preLen);
    },
    items: items
  });
};

Sentence.prototype.switchSegment = function($target, allow){
  var refresh = false;
  if(allow < 0){
    if(this.segmentsInfo.curpos > 0){
      this.segmentsInfo.curpos--;
      refresh = true;
    }
  }else{
    if(this.segmentsInfo.curpos < this.segmentsInfo.segments.length - 1){
      this.segmentsInfo.curpos++;
      refresh = true;
    }
  }
  if(refresh){
    var curpos = this.segmentsInfo.curpos;
    $.contextMenu( 'destroy',  this.contextMenuSelector);
    var candidates = this.segmentsInfo.segments[curpos].candidates;
    var that = this;
    this.setPopupItem('normal', $target, 
                     candidates,
                     function(opt){
                       var i = candidates.indexOf(that.segmentsInfo.sels[curpos]);
                       for(var idx=0; idx<=i; idx++){
                         opt.$menu.trigger('nextcommand');
                       }
                     });

    var cp = Measurement.caretPos($target);
    $(this.contextMenuSelector).contextMenu({
      x: cp.left,
      y: cp.top + 18  // ここの値は本来ならフォントサイズから求めるべきだが
    });
  }
};

Sentence.prototype.insFld = function($target, insTxt, insStartPos, insEndPos, dltPos){
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
  if(typeof(dltPos) == 'number'){
    pos = startPos + dltPos;
  }
  $target.prop("selectionStart", pos);
  $target.prop("selectionEnd", pos);
}
