/// <reference path='../../node_modules/intern/typings/intern/intern.d.ts' />

import registerSuite = require('intern!object');
import assert = require('intern/chai!assert');
import declareClass = require('nova/class/declare');
import Base = require('nova/class/Base');
var results: any[] = [];

interface IFoo {
	log(): void;
}
class Foo extends Base.Class implements IFoo {
	foo: boolean = true;
	log(): void {
		results.push('foo');
		this.super(arguments);
		this.foo2();
	}
	foo2(): void {
		results.push('foo2');
	}
}
interface IBar {
	log(): void;
}
class Bar extends Base.Class implements IBar {
	bar: boolean = true;
	log(): void {
		results.push('bar');
		this.super(arguments);

	}
}

class Baz extends Base.Class implements IFoo, IBar {
	baz: boolean = true;
	log(): void {
		results.push('baz');
		this.super(arguments);
	}
}
var BazClass = declareClass(Baz, [ Foo, Bar ]);
var BazClass2 = declareClass(Baz, [ Bar, Foo ]);

registerSuite(function () {
	return {
		name: 'nova/class/declare',

		beforeEach: function () {
		},

		'.inheritance': {
			'valid linearization + BaseClass super call': function() {
				var smartObj = new BazClass();
				smartObj.log();
				var expected = ['baz', 'bar', 'foo', 'foo2'];
				assert.deepEqual(expected, results);
				assert.isTrue((<any> smartObj).foo);
			},
			'invalid linearization': function() {
				try {
					declareClass(Foo, [ BazClass2, BazClass ]);
					assert.isTrue(false); //force the test to fail
				} catch (e) {
					//linearization is wrong so we must end up here
					assert.isTrue(true);
				}
			}
		}
	};
});
