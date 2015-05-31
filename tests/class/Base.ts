/// <reference path='../../node_modules/intern/typings/intern/intern.d.ts' />

import registerSuite = require('intern!object');
import assert = require('intern/chai!assert');
import Base = require('nova/class/Base');

var results: string[] = [];
class Bar extends Base {
	constructor() {
		super();
		if (this.constructed) { return; }
		results.push('constructor');
	}
	protected postConstructor() {
		this.super(arguments);
		results.push('postConstructor');
	}
}

registerSuite(function () {
	return {
		name: 'nova/class/Base',

		beforeEach: function () {
		},

		'Base class': function() {
			//note: instanceof() and super() are tested in extends

			results = [];
			new Bar();
			var expected = ['constructor', 'postConstructor'];
			assert.deepEqual(expected, results);

		}
	};
});
