/// <reference path='../../node_modules/intern/typings/intern/intern.d.ts' />

import registerSuite = require('intern!object');
import assert = require('intern/chai!assert');
import Disposable = require('nova/class/Disposable');
import has = require('nova/core/has');

registerSuite(function () {
	return {
		name: 'nova/class/Disposable',

		beforeEach: function () {
		},

		'.dispose': function() {
			var dfd = this.async(250);
			var disposable = new Disposable();
			var results: any[] = [];
			var expected: any[] = ['test1', 'test2']; //test3 and test4 should not be there because we stop the timeout/interval
			var test1: any = {
				remove: function() {
					results.push('test1');
				}
			};
			var test2: any = {
				dispose: function() {
					results.push('test2');
				}
			};
			var test3 = setTimeout(function() {
				results.push('test3');
			}, 100);
			var test4 = setInterval(function() {
				results.push('test4');
			}, 100);

			disposable.add(test1, test2, test3, test4);

			if (has('browser-host')) {
				var div = document.createElement('div');
				div.id = 'disposeTest';
				document.body.appendChild(div);
				assert.isNotNull(document.getElementById('disposeTest'));
				disposable.add(div);
			}

			disposable.dispose();

			setTimeout(dfd.callback(function () {
				assert.deepEqual(expected, results);

				if (has('browser-host')) {
					assert.isNull(document.getElementById('disposeTest'));
				}
			}, 200));

		}
	};
});
