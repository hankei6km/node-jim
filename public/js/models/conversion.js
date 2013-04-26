"use strict"

var Conversion = function(){
  this.request = null;
};

Conversion.prototype.get = function(mode, sentence, cb){
  if(this.request){
    this.abort();
  }
  var that = this;
  var data;
  var err = null;
  var request = $.ajax({
    type: 'GET',
    url: 'JIMService/V1/conversion',
    dataType: 'json',
    data: {
      mode: mode,
      sentence: sentence
    },
    success: function(inData, textStatus, jqXHR){
      data = inData;
      inData = null;
    },
    error: function(jqXHR, textStatus, errorThrown){
      err = errorThrown? errorThrown: textStatus;
    },
    complete: function(jqXHR, textStatus){
      cb(err, data);
      if(that.request == request){
        that.request = null;
      }
    }
  });
  this.request = request;
}

Conversion.prototype.abort = function(){
  if(this.request){
    this.request.abort();
    this.request = null;
  }
};
