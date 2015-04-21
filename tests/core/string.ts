/// <reference path="../../node_modules/intern/typings/intern/intern.d.ts" />
import registerSuite = require('intern!object');
import assert = require('intern/chai!assert');
import stringUtil = require('nova/core/string');

registerSuite(function () {
	return {
		name: 'nova/core/string',

		beforeEach: function () {
		},
		'.template': function() {
			let test = 'hello ${world} ! Current date is ${now}';
			let today = (new Date()).toString();
			let newString = stringUtil.interpolate(test, {
				world: 'WORLD',
				now: today
			});
			assert.equal(newString, 'hello WORLD ! Current date is ' + today);

			newString = stringUtil.interpolate(test, {
				world: 'BAR'
			});
			assert.equal(newString, 'hello BAR ! Current date is ${now}');
		},
		'String escape': function() {
			var testString = '<',
				targetString = '&#60;';
			assert.equal(stringUtil.escape(testString), targetString, 'The string should have been escaped properly');
		},

		'String unescape': function() {
			var testString = '&#60;',
				targetString = '<';
			assert.equal(stringUtil.unescape(testString), targetString, 'The string should have been unescaped properly');
		},

		'String camelCase': function() {
			var testString = 'a-Test String',
				targetString = 'aTestString';

			assert.equal(stringUtil.toCamelCase(testString), targetString, 'The string has not been converted to camelcase properly');

		},
		'String regExp escape': function() {
			var testString = 'this $ is ^ a [string (to) escape]',
				targetString = 'this \\$ is \\^ a \\[string \\(to\\) escape\\]';

			assert.equal(stringUtil.escapeForRegExp(testString), targetString, 'The string has not been escaped properly');

		}
	};
});
