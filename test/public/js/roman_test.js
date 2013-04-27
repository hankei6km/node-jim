/**
 * @file ローマ字変換のテスト.
 * @author hankei6km
 * @copyright (c) 2013 hankei6km
 * @license MIT License (http://opensource.org/licenses/mit-license.php)
 */
"use strict";

QUnit.module('roman');

var roman = Roman2Hiragana;


QUnit.test('conv', function() {
  strictEqual(roman.conv('aiueo'), 'あいうえお', 'aiueo');
  strictEqual(roman.conv('kakikukeko'), 'かきくけこ', 'kakikukeko');
  strictEqual(roman.conv('gyouza'), 'ぎょうざ', 'gyouza');
  strictEqual(roman.conv('kare-'), 'かれー', 'kare-');
  strictEqual(roman.conv('kare-soba'), 'かれーそば', 'kare-soba');
  strictEqual(roman.conv('rakkyou'), 'らっきょう', 'rakkyou');
  strictEqual(roman.conv('raltukyou'), 'らっきょう', 'raltukyou');
  strictEqual(roman.conv('raltukilyou'), 'らっきょう', 'raltukilyou');
  strictEqual(roman.conv('anpan'), 'あんぱｎ', 'anpan');
  strictEqual(roman.conv('annpan'), 'あんぱｎ', 'anmpan');
  strictEqual(roman.conv('annpann'), 'あんぱん', 'anmpan');
  strictEqual(roman.conv('nn'), 'ん', 'nn');
});

QUnit.test('hiragana', function() {
  strictEqual(roman.conv('あいうえお'), 'あいうえお', 'あいうえお');
  strictEqual(roman.conv('あいうeo'), 'あいうえお', 'あいうえお');
});

QUnit.test('not roman', function() {
  strictEqual(roman.conv('[]'), '「」', '[]');
  strictEqual(roman.conv('()'), '（）', '()');
  strictEqual(roman.conv(',.'), '、。', ',.');
  strictEqual(roman.conv('/'), '・', '/');
  strictEqual(roman.conv('!"#$%&'), '！”＃＄％＆', '!"#$%&');
  strictEqual(roman.conv('qwe'), 'ｑうぇ', 'qwe');
  strictEqual(roman.conv(''), '', 'blank');
});

