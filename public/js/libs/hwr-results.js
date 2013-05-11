"use strict"
var HwrResults = function($results, $clear, socket){
  this.$results = $results;
  this.$clear = $clear;
  this.socket = socket;
  this.size = $results.size();

  this.clear();

  var that = this;
  this.socket.on('result', function(data){
    // 現状よりも少ない画数の結果は表示しない
    if(that.idx < data.idx){
      var len = data.results.length;
      for(var idx=0; idx<len; idx++){
        var $result = that.$results.eq(idx);
        if($result){
          $result.text(data.results[idx].value);
        }
      }
      that.$results.show();
      that.$clear.show();
    }
    that.idx = data.idx;
  });
};

HwrResults.prototype.clear = function(){
  this.idx = -1;
  for(var idx=0; idx<this.size; idx++){
    this.$results.eq(idx).text('');
  }
  this.$results.hide();
  this.$clear.hide();
};
