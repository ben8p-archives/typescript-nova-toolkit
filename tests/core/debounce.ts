/// <reference path="../../node_modules/intern/typings/intern/intern.d.ts" />
import registerSuite = require('intern!object');
import assert = require('intern/chai!assert');
import debounce = require('nova/core/debounce');

registerSuite(function () {
	return {
		name: 'nova/core/debounce',

		beforeEach: function () {
		},
		'debounce': function() {
			var counter = 0,
				intervalCounter = 0,
				count = function() {
					counter++;
				},
				delay = 1000,
				delayDelta = 500,
				dfd = this.async(delay + delayDelta * 2),
				throttledCount = debounce(count, 250),
				handle = setInterval(function() {
					intervalCounter++;
					if (intervalCounter === 8) {
						clearInterval(handle);
					}
					throttledCount(intervalCounter);
				}, 100);

			setTimeout(dfd.callback(function() {
				clearInterval(handle);
				assert.equal(counter, 1, 'counter has wrong value: ' + counter);

			}), delay + delayDelta);
		}
	};
});
