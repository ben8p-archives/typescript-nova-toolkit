/// <reference path="../../node_modules/intern/typings/intern/intern.d.ts" />
import registerSuite = require('intern!object');
import assert = require('intern/chai!assert');
import remove = require('nova/dom/remove');
import has = require('nova/core/has');

registerSuite(function () {
	var suite = {
		name: 'nova/dom/remove',

		beforeEach: function () {},
		'remove': {
			'remove from the dom': function() {
				var div = document.createElement('div');
				div.id = 'removeFromDom';

				assert.strictEqual(div.parentNode, null);
				document.body.appendChild(div);
				assert.strictEqual(div.parentNode, document.body);

				remove(div);

				assert.strictEqual(div.parentNode, null);
			}
		}
	};
	if (has('node-host')) {
		delete suite.remove;
		console.warn('remove test skipped because of NodeJs');
	}
	return suite;
});
