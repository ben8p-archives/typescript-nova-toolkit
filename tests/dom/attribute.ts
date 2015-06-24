/// <reference path="../../node_modules/intern/typings/intern/intern.d.ts" />
import registerSuite = require('intern!object');
import assert = require('intern/chai!assert');
import attribute = require('nova/dom/attribute');
import has = require('nova/core/has');

registerSuite(function () {
	var suite = {
		name: 'nova/dom/atribute',

		beforeEach: function () {},
		'atribute': {
			'.set': function() {
				var div = document.createElement('div');
				attribute.set(div, {
					value: 1,
					tabIndex: 2,
					'data-foo': 3,
					innerHTML: 4,
					className: 'foo'
				});

				assert.equal((<any> div).value, 1);
				assert.equal(div.getAttribute('tabindex'), 2);
				assert.equal(div.getAttribute('data-foo'), 3);
				assert.equal(div.innerHTML, 4);
				assert.equal(div.className, 'foo');
				assert.equal(div.getAttribute('class'), 'foo');

			},
			'.get': function() {
				var div = document.createElement('div');
				attribute.set(div, {
					value: 1,
					tabIndex: 2,
					'data-foo': 3,
					innerHTML: 4,
					className: 'foo'
				});

				assert.equal(attribute.get(div, 'value'), 1);
				assert.equal(attribute.get(div, 'tabIndex'), 2);
				assert.equal(attribute.get(div, 'tabindex'), 2);
				assert.equal(attribute.get(div, 'data-foo'), 3);
				assert.equal(attribute.get(div, 'innerHTML'), 4);
				assert.equal(attribute.get(div, 'className'), 'foo');
				assert.equal(attribute.get(div, 'class'), 'foo');
			},
			'.remove': function() {
				var div = document.createElement('div');
				attribute.set(div, {
					value: 1,
					tabIndex: 2,
					'data-foo': 3,
					innerHTML: 4,
					className: 'foo'
				});

				attribute.remove(div, ['value', 'tabIndex', 'className', 'data-foo']);
				attribute.remove(div, 'innerHTML');

				assert.equal(attribute.get(div, 'value'), '');
				assert.equal(attribute.get(div, 'tabIndex'), null);
				assert.equal(attribute.get(div, 'tabindex'), null);
				assert.equal(attribute.get(div, 'data-foo'), null);
				assert.equal(attribute.get(div, 'innerHTML'), '');
				assert.equal(attribute.get(div, 'className'), null);
				assert.equal(attribute.get(div, 'class'), null);
			},
			'.has': function() {
				var div = document.createElement('div');

				assert.isFalse(attribute.has(div, 'value'));
				assert.isFalse(attribute.has(div, 'tabIndex'));
				assert.isFalse(attribute.has(div, 'tabindex'));
				assert.isFalse(attribute.has(div, 'data-foo'));
				assert.isFalse(attribute.has(div, 'innerHTML'));
				assert.isFalse(attribute.has(div, 'className'));
				assert.isFalse(attribute.has(div, 'class'));

				attribute.set(div, {
					value: 1,
					tabIndex: 2,
					'data-foo': 3,
					innerHTML: 4,
					className: 'foo'
				});

				assert.isTrue(attribute.has(div, 'value'));
				assert.isTrue(attribute.has(div, 'tabIndex'));
				assert.isTrue(attribute.has(div, 'tabindex'));
				assert.isTrue(attribute.has(div, 'data-foo'));
				assert.isTrue(attribute.has(div, 'innerHTML'));
				assert.isTrue(attribute.has(div, 'className'));
				assert.isTrue(attribute.has(div, 'class'));

				assert.isFalse(attribute.has(div, 'foobar'));
			}
		}
	};
	if (has('node-host')) {
		delete suite.atribute;
		console.warn('attribute test skipped because of NodeJs');
	}
	return suite;
});
