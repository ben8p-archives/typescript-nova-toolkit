/// <reference path='../../node_modules/intern/typings/intern/intern.d.ts' />

import registerSuite = require('intern!object');
import assert = require('intern/chai!assert');
import extendsClass = require('../../nova/class/extends');
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

class Baz1 extends Base.Class implements IFoo, IBar {
	baz: boolean = true;
	log(): void {
		results.push('baz');
		this.super(arguments);
	}
}
class Baz2 extends Base.Class implements IFoo, IBar {
	baz: boolean = true;
	log(): void {
		results.push('baz');
		this.super(arguments);
	}
}
class Baz3 extends Foo implements IFoo, IBar {
	baz3: boolean = true;
	log(): void {
		results.push('baz3');
		this.super(arguments);
	}
}
class Baz4 extends Baz3 implements IFoo, IBar {
	baz4: boolean = true;
	log(): void {
		results.push('baz4');
		this.super(arguments);
	}
}
class Baz5 extends Foo implements IFoo, IBar {
	baz5: boolean = true;
	log(): void {
		results.push('baz5');
		this.super(arguments);
	}
}
extendsClass(Baz1, [ Foo, Bar ]);
extendsClass(Baz2, [ Bar, Foo ]);
extendsClass(Baz3, [ Bar ]); //Baz3 -> Foo -> Bar
extendsClass(Baz4, [ Bar ]); //Baz4 -> Foo -> Bar -> Baz3
extendsClass(Baz5, [ Baz1 ]);

registerSuite(function () {
	return {
		name: 'nova/class/extends',

		beforeEach: function () {
		},

		'.inheritance': {
			'valid linearization + BaseClass super call': function() {
				var baz1 = new Baz1();
				results = [];
				baz1.log();
				var expected = ['baz', 'bar', 'foo', 'foo2'];
				assert.deepEqual(expected, results);
				assert.isTrue((<any> baz1).foo);
				assert.isTrue((<any> baz1).baz);
				var baz2 = new Baz2();
				results = [];
				baz2.log();
				expected = ['baz', 'foo', 'bar', 'foo2'];
				assert.deepEqual(expected, results);
				assert.isTrue((<any> baz2).foo);
				assert.isTrue((<any> baz2).baz);
				var baz3 = new Baz3();
				results = [];
				baz3.log();
				expected = ['baz3', 'foo', 'bar', 'foo2'];
				assert.deepEqual(expected, results);
				assert.isTrue((<any> baz3).foo);
				assert.isTrue((<any> baz3).baz3);
				var baz4 = new Baz4();
				results = [];
				baz4.log();
				expected = ['baz4', 'foo', 'bar', 'baz3', 'foo2'];
				assert.deepEqual(expected, results);
				assert.isTrue((<any> baz4).foo);
				assert.isTrue((<any> baz4).baz4);
				var baz5 = new Baz5();
				results = [];
				baz5.log();
				expected = ['baz5', 'bar', 'foo', 'baz', 'foo2'];
				assert.deepEqual(expected, results);
				assert.isTrue((<any> baz5).foo);
				assert.isTrue((<any> baz5).baz5);
			},
			'invalid linearization': function() {
				try {
					extendsClass(Foo, [ Baz2, Baz1 ]);
					assert.isTrue(false); //force the test to fail
				} catch (e) {
					//linearization is wrong so we must end up here
					assert.isTrue(true);
				}
			}
		}
	};
});
