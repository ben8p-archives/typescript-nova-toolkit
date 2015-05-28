/// <reference path="../../node_modules/intern/typings/intern/intern.d.ts" />
import registerSuite = require('intern!object');
import assert = require('intern/chai!assert');
import inject = require('nova/function/inject');

registerSuite(function () {
	var suite = {
		name: 'nova/function/inject',

		beforeEach: function () {},
		'inject': {
			'before and after': function() {
				var result: String[] = [];
				var expected: String[] = ['bar2', 'bar1', 'foo', 'baz1', 'baz2'];
				var object: any = {
					foo: function() {
						result.push('foo');
					}
				};
				function bar1() {
					result.push('bar1');
				}
				function bar2() {
					result.push('bar2');
				}
				function baz1() {
					result.push('baz1');
				}
				function baz2() {
					result.push('baz2');
				}
				inject.before(bar1, object, 'foo');
				inject.before(bar2, object, 'foo');
				inject.after(baz1, object, 'foo');
				inject.after(baz2, object, 'foo');

				object.foo();
				assert.deepEqual(result, expected);
			},
			'return value': function() {
				var object: any = {
					foo: function(x: number): number {
						return 1 + x;
					}
				};
				var final = 0;
				function bar1(x: number) {
					return [x * 3]; //need an array because this will be used as arguments for next methods
				}
				function baz1(x: number) {
					return [x - 5]; //need an array because this will be used as arguments for next methods
				}
				function baz2(x: number) {
					final = x * 2;
					return [final]; //need an array because this will be used as arguments for next methods
				}

				inject.before(bar1, object, 'foo');
				inject.after(baz1, object, 'foo');
				inject.after(baz2, object, 'foo');

				var result: number = object.foo(8);
				assert.equal(result, 25); // (8 * 3) + 1 --- baz1 and baz2 results are ignored
				//but even if ignored they still runs:
				assert.equal(final, 38); // (24 - 5) * 2 --- 24 because original "foo" does not mutate the argument
			},
			'mutate arguments': function() {
				var result: any = {x: 8};
				var object: any = {
					foo: function(o: any): void {
						o.x = o.x + 1;
					}
				};
				function bar1(o: any): void {
					o.x = o.x * 3;
				}
				function baz1(o: any): void {
					o.x = o.x - 5;
				}
				function baz2(o: any): void {
					o.x = o.x * 2;
				}

				inject.before(bar1, object, 'foo');
				inject.after(baz1, object, 'foo');
				inject.after(baz2, object, 'foo');

				object.foo(result);
				assert.equal(result.x, 40); // ((8 * 3) + 1) - 5) * 2
			}
		}
	};
	return suite;
});
