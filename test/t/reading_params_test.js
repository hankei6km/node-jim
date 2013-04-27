"use strict";

var helper=require('../test_helper.js');
var QUnit=helper.QUnit;
var assert=helper.assert;
var path = require('path');
var util = require('util');

var reading_params = require('../../lib/reading-params');

QUnit.module('reading_params');

QUnit.test('reading', function() {
  var p = reading_params('てｓ');
  assert.equal(p.readingFilter, "て", "てs readingFilter");
  assert.ok( "てすと".match(p.readingRegExp), "てs readingRegExp");

  var p = reading_params("あｒ");
  assert.equal(p.readingFilter, "あ", "あｒ readingFilter");
  assert.ok("あっ".match(p.readingRegExp), "あっ readingRegExp");
  assert.ok("あら".match(p.readingRegExp), "あら readingRegExp");
})
