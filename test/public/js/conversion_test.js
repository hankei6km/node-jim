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
  cnv.get('roman', 'aiueo', function(err, resp){
    ok(!err, 'err');
    strictEqual(resp.segments[0].text, 'aiueo', 'aiueo');
    strictEqual(resp.segments[0].candidates[0], 'あいうえお', 'あいうえお');
    QUnit.start();
  });
});
