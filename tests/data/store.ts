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
				'.sort': function() {
					var store = new Store();
					store.data = data;

					store.sort(function(itemA: {[key: string]: any; }, itemB: {[key: string]: any; }): number {
						if (itemA['c'] > itemB['c']) {
							return 1;
						}
						if (itemA['c'] < itemB['c']) {
							return -1;
						}
						return 0;
					});
					assert.equal(store.data[0]['c'], 'bar');
					assert.equal(store.data[1]['c'], 'barbaz');
					assert.equal(store.data[2]['c'], 'baz');
					assert.equal(store.data[3]['c'], 'foo');
					assert.equal(store.data[4]['c'], 'foobar');

				},
				'.query': function() {
					var store = new Store();
					store.data = data;

					var result: {[key: string]: any; }[];

					result = store.query({c: 'baz'});
					assert.equal(result[0]['c'], 'baz');
					assert.equal(result.length, 1);

					result = store.query({a: 3});
					assert.equal(result[0]['c'], 'baz');
					assert.equal(result.length, 1);

					result = store.query({b: true});
					assert.equal(result[0]['c'], 'foo');
					assert.equal(result[1]['c'], 'baz');
					assert.equal(result[2]['c'], 'barbaz');
					assert.equal(result.length, 3);

					result = store.query({c: /^ba/});
					assert.equal(result[0]['c'], 'bar');
					assert.equal(result[1]['c'], 'baz');
					assert.equal(result[2]['c'], 'barbaz');
					assert.equal(result.length, 3);

					result = store.query({b: true, c: /^ba/});
					assert.equal(result[0]['c'], 'baz');
					assert.equal(result[1]['c'], 'barbaz');
					assert.equal(result.length, 2);

					result = store.query({b: true, g: true});
					assert.equal(result.length, 0);

					result = store.query({g: true});
					assert.equal(result.length, 0);

					result = store.query({a: function(value: any, key: string, item: {[key: string]: any; }): boolean {
						return value % 2 === 0;
					}});
					assert.equal(result[0]['c'], 'bar');
					assert.equal(result[1]['c'], 'foobar');
					assert.equal(result.length, 2);

				}
			}
		};
	return suite;
});
