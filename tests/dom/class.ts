/// <reference path="../../node_modules/intern/typings/intern/intern.d.ts" />
import registerSuite = require('intern!object');
import assert = require('intern/chai!assert');
import domClass = require('nova/dom/class');
import has = require('nova/core/has');

registerSuite(function () {
	var suite = {
		name: 'nova/dom/class',

		beforeEach: function () {},
		'class': {
			'.has': function() {
				var div = document.createElement('div');
				div.className = 'foo bar';

				assert.isTrue(domClass.has(div, 'foo'));
				assert.isTrue(domClass.has(div, 'bar'));
				assert.isFalse(domClass.has(div, 'baz'));

			},
			'.add': function() {
				var div = document.createElement('div');
				domClass.add(div, 'foo');
				domClass.add(div, 'bar baz');
				domClass.add(div, ['foobar', 'foobaz']);

				assert.isTrue(domClass.has(div, 'foo'));
				assert.isTrue(domClass.has(div, 'bar'));
				assert.isTrue(domClass.has(div, 'baz'));
				assert.isTrue(domClass.has(div, 'foobar'));
				assert.isTrue(domClass.has(div, 'foobaz'));
			},
			'.remove': function() {
				var div = document.createElement('div');
				domClass.add(div, 'foo bar baz');
				domClass.remove(div, 'bar baz');

				assert.isTrue(domClass.has(div, 'foo'));
				assert.isFalse(domClass.has(div, 'bar'));
				assert.isFalse(domClass.has(div, 'baz'));

				domClass.add(div, 'foo bar baz');
				domClass.remove(div, 'foo');

				assert.isFalse(domClass.has(div, 'foo'));
				assert.isTrue(domClass.has(div, 'bar'));
				assert.isTrue(domClass.has(div, 'baz'));

				domClass.add(div, 'foo bar baz');
				domClass.remove(div, ['foo', 'bar']);

				assert.isFalse(domClass.has(div, 'foo'));
				assert.isFalse(domClass.has(div, 'bar'));
				assert.isTrue(domClass.has(div, 'baz'));
			},
			'.toggle': function() {
				var div = document.createElement('div');
				domClass.toggle(div, 'foo', true);
				assert.isTrue(domClass.has(div, 'foo'));
				domClass.toggle(div, 'foo', false);
				assert.isFalse(domClass.has(div, 'foo'));
			}
		}
	};
	if (has('node-host')) {
		delete suite.class;
		console.warn('clas test skipped because of NodeJs');
	}
	return suite;
});
