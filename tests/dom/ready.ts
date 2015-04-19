/// <reference path="../../node_modules/intern/typings/intern/intern.d.ts" />
/// <amd-dependency path="nova/dom/ready!" />
import registerSuite = require('intern!object');
import assert = require('intern/chai!assert');
import has = require('nova/core/has');

registerSuite(function () {
	var suite = {
		name: 'nova/dom/ready',

		beforeEach: function () {},
		'ready': {
			'fire event when dom is ready': function () {
				assert.isTrue(true); //if here then plugin as fired the event
			}
		}
	};
	if (has('node-host')) {
		delete suite.ready;
		console.warn('ready test skipped because of NodeJs');
	}
	return suite;
});
