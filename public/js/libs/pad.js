"use strict"
var Pad = function($canvas, socket){
  this.nbest = 10;

  this.$canvas = $canvas;
  this.socket = socket;
  this.ctx = $canvas.get(0).getContext('2d')
  this.canvas_width = parseInt($canvas.attr('width'), 10);
  this.canvas_height = parseInt($canvas.attr('height'), 10);

  this.clear();

  var that = this;
  this.$canvas.mousedown(function(e){
    // http://stackoverflow.com/questions/4249648/jquery-get-mouse-position-within-an-element
    var parentOffset = $(this).parent().offset(); 
    that.startStroke(
      e.pageX - parentOffset.left,
      e.pageY - parentOffset.top
    );
  });
  this.$canvas.mousemove(function(e){
    var parentOffset = $(this).parent().offset(); 
    that.storeStroke(
      e.pageX - parentOffset.left,
      e.pageY - parentOffset.top
    );
  });
  $(document).mouseup(function(){
    if(that.pt){
      that.endStroke();
    }
  });
};

Pad.prototype.clear = function(){
  this.socket.emit('clear', {width: this.canvas_width, height: this.canvas_height});
  this.ctx.clearRect(0, 0, this.canvas_width, this.canvas_height);
  this.idx = -1;
};

Pad.prototype.startStroke = function(x, y){
  this.idx++;
  this.ctx.beginPath();
  this.pt = new Array(0);
  this.ctx.moveTo(x, y);
  this.storeStroke(x, y);
};

Pad.prototype.storeStroke = function(x, y){
  if(this.pt){
    this.pt.push({x:x, y:y})
    this.ctx.lineTo(x, y);
    this.ctx.moveTo(x, y);
  }
};

Pad.prototype.endStroke = function(){
  this.socket.emit('add', {idx: this.idx, nbest: this.nbest, pt: this.pt});
  this.ctx.stroke();
  this.pt = null;
};
