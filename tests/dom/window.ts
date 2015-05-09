/// <reference path="../../node_modules/intern/typings/intern/intern.d.ts" />
import registerSuite = require('intern!object');
import assert = require('intern/chai!assert');
import novaWindow = require('nova/dom/window');
import event = require('nova/core/event');
import CustomEvent = require('nova/class/CustomEvent');
import has = require('nova/core/has');

registerSuite(function () {
	var suite = {
		name: 'nova/dom/window',

		beforeEach: function () {},
		'window': {
			'resize event': function() {
				var ok = false;
				event.when(novaWindow, 'resize').then(function() {
					// console.log('resize');
					ok = true;
				});

				novaWindow.dispatchEvent(new CustomEvent('resize'));

				assert.isTrue(ok);
			},
			'.getViewPortSize': function() {
				var size = novaWindow.getViewportSize();
				assert.isTrue(size.width > 0);
				assert.isTrue(size.height > 0);
			}
		}
	};
	if (has('node-host')) {
		delete suite.window;
		console.warn('window test skipped because of NodeJs');
	}
	return suite;
});
