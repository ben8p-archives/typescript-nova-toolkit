/// <reference path='../../node_modules/intern/typings/intern/intern.d.ts' />

import registerSuite = require('intern!object');
import assert = require('intern/chai!assert');
import Stateful = require('nova/class/Stateful');

class Foo extends Stateful.Class {
	foo: string; //used for defining the interface
	private _foo: string = 'foo'; //used for saving values
	getFoo(): string {
		return this._foo + ' from getter';
	}
	setFoo(value: string): void {
		this._foo = 'set ' + value;
	}
};

class Bar extends Stateful.Class {
	bar: string = 'foo'; //used for defining the interface
	private _bar: string; //used for saving values
	getBar(): string {
		return this._bar + ' from getter';
	}
	setBar(value: string): void {
		this._bar = 'set ' + value;
	}
};

registerSuite(function () {
	return {
		name: 'nova/class/Stateful',

		beforeEach: function () {
		},

		'getter and setter without initial value': function() {
			var test = new Foo();

			assert.equal(test.foo, 'foo from getter');
			test.foo = 'bar';

			assert.equal(test.foo, 'set bar from getter');
		},
		'getter and setter with initial value': function() {
			var test = new Bar();

			assert.equal(test.bar, 'set foo from getter');
			test.bar = 'bar';

			assert.equal(test.bar, 'set bar from getter');
		}
	};
});
