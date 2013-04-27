/**
 * @file Conversion APIのテスト.
 * @author hankei6km
 * @copyright (c) 2013 hankei6km
 * @license MIT License (http://opensource.org/licenses/mit-license.php)
 */
"use strict"
QUnit.module('api_conversion');

QUnit.asyncTest( 'roman to hiragana and candidates', function() {

  var resp;

  $.ajax({
    type: 'GET',
    url: 'JIMService/V1/conversion',
    data: {
      mode: 'predictive',
      sentence: 'あ'
    },
    dataType: 'json',
    success: function(inData, textStatus, jqXHR){
      resp = inData;
    },
    error: function(jqXHR, textStatus, errorThrown){
      throw(textStatus);
    },
    complete: function(jqXHR, textStatus){
      strictEqual(resp.segments[0].text, 'あ', 'あ');
      equal(typeof(resp.segments[0].candidates.length), 'number', 'candidates type');
      ok(resp.segments[0].candidates.length > 0,  'candidates.length');
      equal(typeof(resp.segments[0].candidates[0].word),
            'string', 'candidates[0].word type');
      QUnit.start();
    }
  })

});

QUnit.asyncTest( 'blank', function() {

  var resp;

  $.ajax({
    type: 'GET',
    url: 'JIMService/V1/conversion',
    data: {
      mode: 'predictive',
      sentence: ''
    },
    dataType: 'json',
    success: function(inData, textStatus, jqXHR){
      resp = inData;
    },
    error: function(jqXHR, textStatus, errorThrown){
      throw(textStatus);
    },
    complete: function(jqXHR, textStatus){
      strictEqual(resp.segments[0].text, '', 'blank');
      equal(typeof(resp.segments[0].candidates.length), 'number', 'candidates type');
      ok(resp.segments[0].candidates.length == 0,  'candidates.length');
      QUnit.start();
    }
  })

});
