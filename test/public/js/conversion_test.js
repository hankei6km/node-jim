/**
 * @file Conversion のテスト.
 * @author hankei6km
 * @copyright (c) 2013 hankei6km
 * @license MIT License (http://opensource.org/licenses/mit-license.php)
 */
"use strict"
QUnit.module('conversion');

QUnit.asyncTest( 'roman to hiragana', function() {

  var cnv = new Conversion();
  cnv.get('predictive', 'あいうえお', function(err, resp){
    ok(!err, 'err');
    strictEqual(resp.segments[0].text, 'あいうえお', 'あいうえお');
    equal(typeof(resp.segments[0].candidates.length), 'number', 'candidates type');
    QUnit.start();
  });
});
