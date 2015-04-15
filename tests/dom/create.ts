/// <reference path="../../node_modules/intern/typings/intern/intern.d.ts" />
import registerSuite = require('intern!object');
import assert = require('intern/chai!assert');
import create = require('nova/dom/create');
import has = require('nova/core/has');

registerSuite(function () {
	var suite = {
		name: 'nova/dom/insert',

		beforeEach: function () {},
		'create': {
			'create a div without attributes': function() {
				var div = create('div');
				assert.strictEqual('div', div.tagName.toLowerCase());
			},
			'create a div with class': function() {
				var div = create('div', {
					className: 'foo'
				});
				assert.strictEqual(div.className, 'foo');

				div = create('div', {
					className: ['foo', 'bar']
				});
				assert.strictEqual(div.className, 'foo bar');
			},
			'create a div with styles': function() {
				var div = create('div', {
					style: {
						color: 'blue',
						'border-width': '35px'
					}
				});
				assert.strictEqual(div.style.color, 'blue');
				assert.strictEqual(div.style.borderWidth, '35px');
			},
			'create a div with content': function() {
				var div = create('div', {
					innerHTML: 'foo'
				});
				assert.strictEqual(div.innerHTML, 'foo');
			},
			'create a div with custom attributes': function() {
				var div = create('div', {
					'data-foo': 'bar'
				});
				assert.strictEqual(div.getAttribute('data-foo'), 'bar');
			},
			'create a div with an id': function() {
				var div = create('div', {
					id: 'foo'
				});
				assert.strictEqual(div.id, 'foo');
			}
		}
	};
	if (has('node-host')) {
		delete suite.create;
		console.warn('create test skipped because of NodeJs');
	}
	return suite;
});
