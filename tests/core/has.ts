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
		},
		'html tag update': function() {
			var htmlTag = document.querySelector('html');
			has.add('has-this-feature', true);
			has.add('not-this-feature', false);
			has.add('this-feature-version', '5');

			assert.isTrue((<HTMLElement> htmlTag).className.indexOf('has-this-feature') > -1);
			assert.isTrue((<HTMLElement> htmlTag).className.indexOf('not-this-feature') === -1);
			assert.isTrue((<HTMLElement> htmlTag).className.indexOf('this-feature-version') > -1);
		}

	};
	if (has('node-host')) {
		delete suite.plugin;
		delete suite['html tag update'];
		console.warn('plugin and "html tag update" test skipped because of NodeJs');
	}
	return suite;
});
