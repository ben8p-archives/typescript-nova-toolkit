/// <reference path="../../node_modules/intern/typings/intern/intern.d.ts" />
/// <amd-dependency path="nova/core/has!foobar?./testResources/ok:./testResources/nok" />
/// <amd-dependency path="nova/core/has!amd?./testResources/ok:./testResources/nok" />
import registerSuite = require('intern!object');
import assert = require('intern/chai!assert');
import has = require('nova/core/has');

registerSuite(function () {
	var suite = {
		name: 'nova/core/has',

		beforeEach: function () {
		},
		'.add': function() {
			has.add('foo', true);
			has.add('bar', false);
			assert.isTrue(has('foo'));
			assert.isFalse(has('bar'));
			assert.notOk(has('baz'));
		},
		'plugin': function() {
			var test: string;
			if (has('foobar')) {
				test = require('./testResources/ok');
			} else {
				test = require('./testResources/nok');
			}
			assert.equal(test, 'nok');
			if (has('amd')) {
				test = require('./testResources/ok');
			} else {
				test = require('./testResources/nok');
			}
			assert.equal(test, 'ok');
		}
	};
	if (has('node-host')) {
		delete suite.plugin;
		console.warn('plugin test skipped because of NodeJs');
	}
	return suite;
});
