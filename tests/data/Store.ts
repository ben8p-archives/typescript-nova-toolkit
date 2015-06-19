/// <reference path="../../node_modules/intern/typings/intern/intern.d.ts" />
import registerSuite = require('intern!object');
import assert = require('intern/chai!assert');
import Store = require('nova/data/Store');

registerSuite(function () {
	var data: {[key: string]: any; }[] = [],
		suite = {
			name: 'nova/data/Store',

			beforeEach: function () {
				data = [
					{
						a: 1,
						b: true,
						c: 'foo'
					},
					{
						a: 2,
						b: false,
						c: 'bar'
					},
					{
						a: 3,
						b: true,
						c: 'baz'
					},
					{
						a: 4,
						b: false,
						c: 'foobar'
					},
					{
						a: 5,
						b: true,
						c: 'barbaz'
					},
				];
			},
			'store': {
				'sort': function() {
					var store = new Store();
					store.data = data;

					store.query(null, function(itemA: {[key: string]: any; }, itemB: {[key: string]: any; }): number {
						if (itemA['c'] > itemB['c']) {
							return 1;
						}
						if (itemA['c'] < itemB['c']) {
							return -1;
						}
						return 0;
					}).then(function(result: {[key: string]: any}[]) {
						assert.equal(result[0]['c'], 'bar');
						assert.equal(result[1]['c'], 'barbaz');
						assert.equal(result[2]['c'], 'baz');
						assert.equal(result[3]['c'], 'foo');
						assert.equal(result[4]['c'], 'foobar');
					});

				},
				'.query': function() {
					var store = new Store();
					store.data = data;

					store.query({c: 'baz'}).then(function(result: {[key: string]: any}[]) {
						assert.equal(result[0]['c'], 'baz');
						assert.equal(result.length, 1);
					});

					store.query({a: 3}).then(function(result: {[key: string]: any}[]) {
						assert.equal(result[0]['c'], 'baz');
						assert.equal(result.length, 1);
					});

					store.query({b: true}).then(function(result: {[key: string]: any}[]) {
						assert.equal(result[0]['c'], 'foo');
						assert.equal(result[1]['c'], 'baz');
						assert.equal(result[2]['c'], 'barbaz');
						assert.equal(result.length, 3);
					});

					store.query({c: /^ba/}).then(function(result: {[key: string]: any}[]) {
						assert.equal(result[0]['c'], 'bar');
						assert.equal(result[1]['c'], 'baz');
						assert.equal(result[2]['c'], 'barbaz');
						assert.equal(result.length, 3);
					});

					store.query({b: true, c: /^ba/}).then(function(result: {[key: string]: any}[]) {
						assert.equal(result[0]['c'], 'baz');
						assert.equal(result[1]['c'], 'barbaz');
						assert.equal(result.length, 2);
					});

					store.query({b: true, g: true}).then(function(result: {[key: string]: any}[]) {
						assert.equal(result.length, 0);
					});

					store.query({g: true}).then(function(result: {[key: string]: any}[]) {
						assert.equal(result.length, 0);
					});

					store.query({a: function(value: any, key: string, item: {[key: string]: any; }): boolean {
						return value % 2 === 0;
					}}).then(function(result: {[key: string]: any}[]) {
						assert.equal(result[0]['c'], 'bar');
						assert.equal(result[1]['c'], 'foobar');
						assert.equal(result.length, 2);
					});

				},
				'chain': function() {
					var store = new Store();
					var count = 0;
					store.data = data;

					store.query({c: 'baz'}).then(function(result: {[key: string]: any}[]) {
						assert.equal(result[0]['c'], 'baz');
						count += 2;
						assert.equal(count, 2);
					}).then(function(result: {[key: string]: any}[]) {
						assert.equal(result.length, 1);
						count += 9;
						assert.equal(count, 11);
					});
				},
				'add/remove': function() {
					var store = new Store();
					store.data = data;
					assert.isNotNull(store.add({
						a: 10,
						b: true,
						c: 'barbaz'
					})); //new object so it is added
					assert.isNotNull(store.add({
						a: 11,
						b: true,
						c: 'barbaz'
					})); //new object so it is added
					assert.isNull(store.add(data[0])); //will not be added
					assert.isNotNull(store.remove(data[0])); //will be removed
					assert.isNull(store.remove({
						a: 11,
						b: true,
						c: 'barbaz'
					})); //will NOT be removed (because it is not a pointer)

					store.query().then(function(result: {[key: string]: any}[]) {
						assert.equal(result.length, 6);
					});
				},
				'observable query': function() {
					var store = new Store();
					var countAll = 0;
					var countRemoval = 0;
					var countSubset = 0;
					var expectedSubset = [1, 2, 2, 3];
					var resultSubset: number[] = [];
					var finalSorted: any;
					store.data = data;

					//all data
					store.query().then(function(result: {[key: string]: any}[]) {
						assert.equal(data.length, result.length);
						countAll++;
					});

					//only barbaz data
					store.query({c: 'barbaz'}).then(function(result: {[key: string]: any}[]) {
						countSubset++;
						resultSubset.push(result.length);
					});

					//only barbaz data, ordered on value of "a" (descending)
					store.query({c: 'barbaz'}, function(itemA: {[key: string]: any; }, itemB: {[key: string]: any; }): number {
						if (itemA['a'] > itemB['a']) {
							return -1;
						}
						if (itemA['a'] < itemB['a']) {
							return 1;
						}
						return 0;
					}).then(function(result: {[key: string]: any}[]) {
						finalSorted = result;
					});

					store.query().then(function(result: {[key: string]: any}[]) {
						countRemoval++;
					}).remove();

					//triger some updates
					store.add({
						a: 10,
						b: true,
						c: 'barbaz'
					});
					store.add({
						a: 8,
						b: true,
						c: 'babaz'
					});
					store.add({
						a: 9,
						b: true,
						c: 'barbaz'
					});

					//check that filtered query are returning the right subset
					assert.deepEqual(expectedSubset, resultSubset);

					//check that filtered query are returning the right subset in the right order
					assert.deepEqual(finalSorted[0].a, 10);

					//check that propagation is working in both "all" and "filtered" state
					assert.equal(countSubset, 4);
					assert.equal(countAll, 4);

					//check that removed query are not re-executed
					assert.equal(countRemoval, 1);
				}
			}
		};
	return suite;
});
