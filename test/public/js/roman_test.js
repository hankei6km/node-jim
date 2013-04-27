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
  strictEqual(roman.conv('aiueo').text, 'あいうえお', 'aiueo');
  strictEqual(roman.conv('kakikukeko').text, 'かきくけこ', 'kakikukeko');
  strictEqual(roman.conv('gyouza').text, 'ぎょうざ', 'gyouza');
  strictEqual(roman.conv('kare-').text, 'かれー', 'kare-');
  strictEqual(roman.conv('kare-soba').text, 'かれーそば', 'kare-soba');
  strictEqual(roman.conv('rakkyou').text, 'らっきょう', 'rakkyou');
  strictEqual(roman.conv('raltukyou').text, 'らっきょう', 'raltukyou');
  strictEqual(roman.conv('raltukilyou').text, 'らっきょう', 'raltukilyou');
  strictEqual(roman.conv('anpan').text, 'あんぱｎ', 'anpan');
  strictEqual(roman.conv('annpan').text, 'あんぱｎ', 'anmpan');
  strictEqual(roman.conv('annpann').text, 'あんぱん', 'anmpan');
  strictEqual(roman.conv('nn').text, 'ん', 'nn');
});

QUnit.test('hiragana', function() {
  strictEqual(roman.conv('あいうえお').text, 'あいうえお', 'あいうえお');
  strictEqual(roman.conv('あいうeo').text, 'あいうえお', 'あいうえお');
});

QUnit.test('not roman', function() {
  strictEqual(roman.conv('[]').text, '「」', '[]');
  strictEqual(roman.conv('()').text, '（）', '()');
  strictEqual(roman.conv(',.').text, '、。', ',.');
  strictEqual(roman.conv('/').text, '・', '/');
  strictEqual(roman.conv('!"#$%&').text, '！”＃＄％＆', '!"#$%&');
  strictEqual(roman.conv('qwe').text, 'ｑうぇ', 'qwe');
  strictEqual(roman.conv('').text, '', 'blank');
});

QUnit.test('complete flag', function() {
  strictEqual(roman.conv('aiueo').complete, true, 'aiueo');
  strictEqual(roman.conv('kak').complete, false, 'kak');
  strictEqual(roman.conv('[]').complete, true, '[]');
  strictEqual(roman.conv('!').complete, false, '!');
});
