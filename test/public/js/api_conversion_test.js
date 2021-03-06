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
      equal(typeof(resp.segments[0].candidates[0]),
            'string', 'candidates[0] type');
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

QUnit.asyncTest( 'normal', function() {

  var resp;

  $.ajax({
    type: 'GET',
    url: 'JIMService/V1/conversion',
    data: {
      mode: 'normal',
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
      equal(resp.segments.length ,3 ,  'segments.length');
      
      equal(resp.segments[0].text, 'へんかん', 'segments[0].text');
      equal(resp.segments[1].text, 'の', 'segments[0].text');
      equal(resp.segments[2].text, 'てすと', 'segments[0].text');

      equal(resp.segments[0].candidates.length, 2, 'segments[0].candidates.length');
      equal(resp.segments[1].candidates.length, 3, 'segments[0].candidates.length');
      equal(resp.segments[2].candidates.length, 1, 'segments[0].candidates.length');

      equal(resp.segments[0].candidates[0], '変換', 'segments[0].candidates[0]');
      equal(resp.segments[1].candidates[0], 'の', 'segments[0].candidates[1]');
      equal(resp.segments[2].candidates[0], 'テスト', 'segments[0].candidates[2]');
      
      QUnit.start();
    }
  })

});

QUnit.asyncTest( 'sentence length over', function() {

  var resp = null;
  var err = null;
  var sentence = 'あいうえおあいうえあいうえおあいうえあいうえおあいうえあいうえおあいうえあいうえおあいうえあいうえおあいうえあいうえおあいうえおおおおおおおあいうえおあいうえお。';

  $.ajax({
    type: 'GET',
    url: 'JIMService/V1/conversion',
    data: {
      mode: 'normal',
      sentence: sentence
    },
    dataType: 'json',
    success: function(inData, textStatus, jqXHR){
      resp = inData;
    },
    error: function(jqXHR, textStatus, errorThrown){
      err = textStatus;
    },
    complete: function(jqXHR, textStatus){
      equal(resp, null ,  'resp');
      // TODO: エラーの判定をもうちょっとまともにする.
      ok(err, 'err');
      
      QUnit.start();
    }
  })

});
