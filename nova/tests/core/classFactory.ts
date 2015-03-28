/// <reference path="../../../node_modules/intern/typings/intern/intern.d.ts" />

import registerSuite = require('intern!object');
import assert = require('intern/chai!assert');
import classFactory = require('nova/core/classFactory');
var results:any[] = [];

interface IFoo {
	log(): void;
}
class Foo extends classFactory.Base implements IFoo {
	foo: boolean = true;
	log(): void {
		results.push('foo');
		this.inherited(arguments);
		this.foo2();
	}
	foo2(): void {
		results.push('foo2');
	}
}
interface IBar {
	log(): void;
}
class Bar extends classFactory.Base implements IBar {
	bar: boolean = true;
	log(): void {
		results.push('bar');
		this.inherited(arguments);

	}
}

class Baz extends classFactory.Base implements IFoo, IBar {
	baz: boolean = true;
	log(): void {
		results.push('baz');
		this.inherited(arguments);
	}
}
var BazClass = classFactory.declare(Baz, [ Foo, Bar ]);
var BazClass2 = classFactory.declare(Baz, [ Bar, Foo ]);


registerSuite(function () {
	return {
		name: 'nova/core/classFactory',

		beforeEach: function () {
		},

		'.inheritance': {
			'valid linearization': function() {
				var smartObj = new BazClass();
				smartObj.log();
				var expected = ["baz", "bar", "foo", "foo2"];
				assert.deepEqual(expected, results);
				assert.isTrue((<any>smartObj).foo);
			},
			'invalid linearization': function() {
				try {
					var BazClass3 = classFactory.declare(Foo, [ BazClass2, BazClass ]);
					assert.isTrue(false); //force the test to fail
				} catch(e) {
					//linearization is wrong so we must end up here
					assert.isTrue(true);
				}


			},

		}

	}
})
