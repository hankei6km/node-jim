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

var roman = require('../../lib/roman');

QUnit.module('roman');

QUnit.test('conv', function() {
  assert.strictEqual(roman.conv('aiueo').text, 'あいうえお', 'aiueo');
  assert.strictEqual(roman.conv('kakikukeko').text, 'かきくけこ', 'kakikukeko');
  assert.strictEqual(roman.conv('gyouza').text, 'ぎょうざ', 'gyouza');
  assert.strictEqual(roman.conv('kare-').text, 'かれー', 'kare-');
  assert.strictEqual(roman.conv('kare-soba').text, 'かれーそば', 'kare-soba');
  assert.strictEqual(roman.conv('rakkyou').text, 'らっきょう', 'rakkyou');
  assert.strictEqual(roman.conv('raltukyou').text, 'らっきょう', 'raltukyou');
  assert.strictEqual(roman.conv('raltukilyou').text, 'らっきょう', 'raltukilyou');
  assert.strictEqual(roman.conv('anpan').text, 'あんぱｎ', 'anpan');
  assert.strictEqual(roman.conv('annpan').text, 'あんぱｎ', 'anmpan');
  assert.strictEqual(roman.conv('annpann').text, 'あんぱん', 'anmpan');
  assert.strictEqual(roman.conv('nn').text, 'ん', 'nn');
});

QUnit.test('hiragana', function() {
  assert.strictEqual(roman.conv('あいうえお').text, 'あいうえお', 'あいうえお');
  assert.strictEqual(roman.conv('あいうeo').text, 'あいうえお', 'あいうえお');
});

QUnit.test('not roman', function() {
  assert.strictEqual(roman.conv('[]').text, '「」', '[]');
  assert.strictEqual(roman.conv('()').text, '（）', '()');
  assert.strictEqual(roman.conv(',.').text, '、。', ',.');
  assert.strictEqual(roman.conv('/').text, '・', '/');
  assert.strictEqual(roman.conv('!"#$%&').text, '！”＃＄％＆', '!"#$%&');
  assert.strictEqual(roman.conv('qwe').text, 'ｑうぇ', 'qwe');
  assert.strictEqual(roman.conv('').text, '', 'blank');
});

QUnit.test('complete flag', function() {
  assert.strictEqual(roman.conv('aiueo').complete, true, 'aiueo');
  assert.strictEqual(roman.conv('kak').complete, false, 'kak');
  assert.strictEqual(roman.conv('[]').complete, true, '[]');
  assert.strictEqual(roman.conv('!').complete, false, '!');
});

