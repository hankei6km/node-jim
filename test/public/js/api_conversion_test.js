/**
 * @file Conversion APIのテスト.
 * @author hankei6km
 * @copyright (c) 2013 hankei6km
 * @license MIT License (http://opensource.org/licenses/mit-license.php)
 */
"use strict"
QUnit.module('api_conversion');

QUnit.asyncTest( 'roman to hiragana wtth complete', function() {

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
      strictEqual(resp.segments[0].text, 'あいうえお', 'aiueo');
      equal(typeof(resp.segments[0].candidates.length), 'number', 'candidates type');
      ok(resp.segments[0].candidates.length == 0,  'candidates.length');
      equal(resp.segments[0].complete, true, 'complete flag');
      QUnit.start();
    }
  })

});

QUnit.asyncTest( 'roman to hiragana wtth uncomplete', function() {

  var resp;

  $.ajax({
    type: 'GET',
    url: 'JIMService/V1/conversion',
    data: {
      mode: 'roman',
      sentence: 'kakk'
    },
    dataType: 'json',
    success: function(inData, textStatus, jqXHR){
      resp = inData;
    },
    error: function(jqXHR, textStatus, errorThrown){
      throw(textStatus);
    },
    complete: function(jqXHR, textStatus){
      strictEqual(resp.segments[0].text, 'かっｋ', 'kakk');
      equal(typeof(resp.segments[0].candidates.length), 'number', 'candidates type');
      ok(resp.segments[0].candidates.length == 0,  'candidates.length');
      equal(resp.segments[0].complete, false, 'complete flag');
      QUnit.start();
    }
  })

});

QUnit.asyncTest( 'roman to candidates', function() {

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

QUnit.asyncTest( 'libkkc', function() {

  var resp;

  $.ajax({
    type: 'GET',
    url: 'JIMService/V1/conversion',
    data: {
      mode: 'decode',
      sentence: 'へんかんのてすと'
    },
    dataType: 'json',
    success: function(inData, textStatus, jqXHR){
      resp = inData;
    },
    error: function(jqXHR, textStatus, errorThrown){
      throw(textStatus);
    },
    complete: function(jqXHR, textStatus){
      equal(typeof(resp.segments.length), 'number', 'segments.length');
      equal(resp.segments.length, 30, 'segments.length');
      // 以下は、変換結果が常に一定であるという前提になっているので注意.
      equal(resp.segments[0][0].input, 'へんかん', 'segment[0][0].input');
      equal(resp.segments[0][0].output, '変換', 'segment[0][0].input');
      QUnit.start();
    }
  })

});
