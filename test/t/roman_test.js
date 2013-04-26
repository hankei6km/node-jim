/**
 * @file ローマ字変換のテスト.
 * @author hankei6km
 * @copyright (c) 2013 hankei6km
 * @license MIT License (http://opensource.org/licenses/mit-license.php)
 */
"use strict";

var helper=require('../test_helper.js');
var QUnit=helper.QUnit;
var assert=helper.assert;
var path = require('path');
var util = require('util');

QUnit.module('roman');

var roman = require('../../lib/roman');


QUnit.test('conv', function() {
  assert.strictEqual(roman.conv('aiueo'), 'あいうえお', 'aiueo');
  assert.strictEqual(roman.conv('kakikukeko'), 'かきくけこ', 'kakikukeko');
  assert.strictEqual(roman.conv('gyouza'), 'ぎょうざ', 'gyouza');
  assert.strictEqual(roman.conv('kare-'), 'かれー', 'kare-');
  assert.strictEqual(roman.conv('kare-soba'), 'かれーそば', 'kare-soba');
  assert.strictEqual(roman.conv('rakkyou'), 'らっきょう', 'rakkyou');
  assert.strictEqual(roman.conv('raltukyou'), 'らっきょう', 'raltukyou');
  assert.strictEqual(roman.conv('raltukilyou'), 'らっきょう', 'raltukilyou');
  assert.strictEqual(roman.conv('anpan'), 'あんぱｎ', 'anpan');
  assert.strictEqual(roman.conv('annpan'), 'あんぱｎ', 'anmpan');
  assert.strictEqual(roman.conv('annpann'), 'あんぱん', 'anmpan');
  assert.strictEqual(roman.conv('nn'), 'ん', 'nn');
});

QUnit.test('hiragana', function() {
  assert.strictEqual(roman.conv('あいうえお'), 'あいうえお', 'あいうえお');
  assert.strictEqual(roman.conv('あいうeo'), 'あいうえお', 'あいうえお');
});

QUnit.test('not roman', function() {
  assert.strictEqual(roman.conv('[]'), '「」', '[]');
  assert.strictEqual(roman.conv('()'), '（）', '()');
  assert.strictEqual(roman.conv(',.'), '、。', ',.');
  assert.strictEqual(roman.conv('/'), '・', '/');
  assert.strictEqual(roman.conv('!"#$%&'), '！”＃＄％＆', '!"#$%&');
  assert.strictEqual(roman.conv('qwe'), 'ｑうぇ', 'qwe');
});
