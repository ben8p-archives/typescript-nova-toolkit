/// <reference path='../../node_modules/intern/typings/intern/intern.d.ts' />
import registerSuite = require('intern!object');
import assert = require('intern/chai!assert');
import c3mro = require('nova/class/c3mro');

class Bar {}
class Foo {}
class Baz {}

registerSuite(function () {
	return {
		name: 'nova/class/c3mro',

		beforeEach: function () {
		},

		'.linearize': function () {
			var result = c3mro.linearize([Bar, Foo, Baz]);
			assert.deepEqual([1, Baz, Foo, Bar], result);

		}
	};
});
