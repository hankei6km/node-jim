/**
 * @file Node.js から libkkc を利用するライブラリのテスト.
 * @author hankei6km
 * @copyright (c) 2012-2013 hankei6km
 * @license MIT License (http://opensource.org/licenses/mit-license.php)
 */
"use strict";

var helper=require('../test_helper.js');
var QUnit=helper.QUnit;
var assert=helper.assert;
var path = require('path');
var util = require('util');

var libkkc = require('../../lib/node-libkkc');

QUnit.module('node-libkkc');

QUnit.asyncTest('decode', function() {
  libkkc.decode('へんかんのてすと', 1, [], function(err, segments){
    assert.equal(err, null, 'decode err');
    assert.ok(util.isArray(segments), 'segments type');
    assert.equal(segments.length, 1, 'segments length');
    assert.ok(util.isArray(segments[0]), 'segment type');
    assert.equal(segments[0][0].input, 'へんかん', 'segmen.input');
    assert.equal(segments[0][0].output, '変換', 'segmen.output');
    QUnit.start();
  });
})

QUnit.asyncTest('nbest', function() {
  libkkc.decode('へんかんのてすと', 10, [], function(err, segments){
    assert.equal(err, null, 'decode err');
    assert.ok(util.isArray(segments), 'segments type');
    assert.equal(segments.length, 10, 'segments length');
    QUnit.start();
  });
})

QUnit.asyncTest('constraints', function() {
  libkkc.decode('へんかんのてすと', 1, [6, 7], function(err, segments){
    assert.equal(err, null, 'decode err');
    assert.ok(util.isArray(segments), 'segments type');
    assert.equal(segments.length, 1, 'segments length');
    assert.equal(segments[0][0].input, 'へんかんのて', 'segmen[0].input');
    assert.equal(segments[0][1].input, 'す', 'segmen[1].input');
    assert.equal(segments[0][2].input, 'と', 'segmen[2].input');
    QUnit.start();
  });
})

QUnit.asyncTest('injection', function() {
  libkkc.decode('へんかん;てすと', 1, [], function(err, segments){
    assert.equal(err, null, 'decode err');
    assert.equal(segments[0][0].input, 'へんかん', 'segmen[0].input');
    assert.equal(segments[0][1].input, ';', 'segmen[1].input');
    assert.equal(segments[0][2].input, 'てすと', 'segmen[2].input');
    QUnit.start();
  });
})
