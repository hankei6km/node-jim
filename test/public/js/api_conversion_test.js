/**
 * @file Conversion APIのテスト.
 * @author hankei6km
 * @copyright (c) 2013 hankei6km
 * @license MIT License (http://opensource.org/licenses/mit-license.php)
 */
"use strict"
QUnit.module('api_conversion');

QUnit.asyncTest( 'roman to hiragana', function() {

  var resp;

  $.ajax({
    type: 'GET',
    url: 'JIMService/V1/conversion',
    data: {
      mode: 'roman',
      sentence: 'aiueo'
    },
    dataType: 'json',
    success: function(inData, textStatus, jqXHR){
      resp = inData;
    },
    error: function(jqXHR, textStatus, errorThrown){
      throw(textStatus);
    },
    complete: function(jqXHR, textStatus){
      strictEqual(resp.segments[0].text, 'あいうえお', 'あいうえお');
      equal(typeof(resp.segments[0].candidates.length), 'number', 'candidates type');
      QUnit.start();
    }
  })

});
