/// <reference path="../../node_modules/intern/typings/intern/intern.d.ts" />
import registerSuite = require('intern!object');
import assert = require('intern/chai!assert');
import style = require('nova/dom/style');
import has = require('nova/core/has');

registerSuite(function () {
	var suite = {
		name: 'nova/dom/insert',

		beforeEach: function () {},
		'style': {
			'set style a div with CSS like attributes': function() {
				var div = document.createElement('div');
				style.set(div, {
					color: 'blue',
					'border-width': '35px'
				});
				assert.strictEqual(div.style.color, 'blue');
				assert.strictEqual(div.style.borderWidth, '35px');
			},
			'set style a div with JS like attributes': function() {
				var div = document.createElement('div');
				style.set(div, {
					color: 'blue',
					borderWidth: '35px'
				});
				assert.strictEqual(div.style.color, 'blue');
				assert.strictEqual(div.style.borderWidth, '35px');
			},
			'get style a div with CSS like attributes': function() {
				var div = document.createElement('div');
				style.set(div, {
					color: 'blue',
					'border-width': '35px'
				});
				var currentStyle = <any> style.get(div, 'color');
				assert.strictEqual(currentStyle.color, 'blue');
				assert.strictEqual(currentStyle.borderWidth, undefined);

				currentStyle = <any> style.get(div, ['color', 'border-width']);
				assert.strictEqual(currentStyle.color, 'blue');
				assert.strictEqual(currentStyle.borderWidth, '35px');
			},
			'get style a div with JS like attributes': function() {
				var div = document.createElement('div');
				style.set(div, {
					color: 'blue',
					borderWidth: '35px'
				});
				var currentStyle = <any> style.get(div, ['color', 'borderWidth']);
				assert.strictEqual(currentStyle.color, 'blue');
				assert.strictEqual(currentStyle.borderWidth, '35px');
			}
		}
	};
	if (has('node-host')) {
		delete suite.style;
		console.warn('style test skipped because of NodeJs');
	}
	return suite;
});
