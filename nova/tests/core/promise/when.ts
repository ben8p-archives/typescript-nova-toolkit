/// <reference path="../../../../node_modules/intern/typings/intern/intern.d.ts" />
import registerSuite = require('intern!object');
import assert = require('intern/chai!assert');
import when = require('nova/core/promise/when');
import Deferred = require('nova/core/promise/Deferred');

registerSuite(function () {
	return {
		name: 'nova/core/promise/when',

		beforeEach: function () {
		},

		'basic types' : function() {
			var dfd = this.async(200);
			var results:any[] = [];

			when(true).then((value:boolean) => {
				results.push(value);
			});
			when(false).then((value:boolean) => {
				results.push(value);
			});
			when('foobar').then((value:boolean) => {
				results.push(value);
			});
			when(5).then((value:boolean) => {
				results.push(value);
			});
			when(null).then((value:boolean) => {
				results.push(value);
			});
			when().then((value:boolean) => {
				results.push(value);
			});

			setTimeout(dfd.callback(() => {
				assert.deepEqual(results, [true, false, 'foobar', 5, null, undefined]);
			}), 150);
		},
		'with promise' : function() {
			var dfd = this.async(200);
			var results:any[] = [];

			var p0:Deferred = new Deferred();
			when(p0).then((value:string) => {
				results.push(value);
			});
			p0.resolve('foo');

			var p1:Deferred = new Deferred();
			when(p1).then(() => {}, (value:string) => {
				results.push(value);
			});
			p1.reject('rejected');

			var p2:Deferred = new Deferred();
			var p3 = p2.then((value:string) => {
				return value + 'baz';
			})
			when(p3).then((value:string) => {
				results.push(value);
			});
			p2.resolve('bar');

			setTimeout(dfd.callback(() => {
				assert.deepEqual(results, ['foo', 'rejected', 'barbaz']);
			}), 150);
		}
	}
})
