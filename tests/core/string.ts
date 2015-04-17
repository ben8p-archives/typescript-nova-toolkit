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
		}
	};
});
