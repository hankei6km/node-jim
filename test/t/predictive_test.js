"use strict";

var helper=require('../test_helper.js');
var QUnit=helper.QUnit;
var assert=helper.assert;
var path = require('path');
var util = require('util');

var predictive = require('../../models/predictive')('mongodb://localhost/node-jim-test');

QUnit.module('predictive',{
  teardown:function(){
    predictive.removeAll(function(){
      predictive.disconnect();
    });
  }
});

QUnit.asyncTest('create', function() {
  var arr = [{
    cost: 1,
    reading: 'てすと',
    word: 'テスト'
  },{
    cost: 100,
    reading: 'てん',
    word: '10'
  },{
    cost: 2,
    reading: 'て',
    word: '手'
  },{
    cost: 11,
    reading: 'かくにん',
    word: '確認'
  }];
  predictive.create(arr, function(err){
    assert.equal(err, null, 'create err');
    predictive.getCandidate('て', function(err, docs){
      assert.equal(err, null, 'get err');
      assert.equal(docs.length, 3, 'docs.length');
      assert.equal(docs[0].word, 'テスト', 'docs[0].word');
      assert.equal(docs[1].word, '手', 'docs[1].word');
      assert.equal(docs[2].word, '10', 'docs[12.word');
      QUnit.start();
    });
  });
})
