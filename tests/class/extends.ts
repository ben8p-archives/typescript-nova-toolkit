/// <reference path='../../node_modules/intern/typings/intern/intern.d.ts' />

import registerSuite = require('intern!object');
import assert = require('intern/chai!assert');
import extendsClass = require('../../nova/class/extends');
import Base = require('nova/class/Base');
var results: any[] = [];

interface IFoo {
	log(): void;
}
class Foo extends Base implements IFoo {
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
class Bar extends Base implements IBar {
	bar: boolean = true;
	log(): void {
		results.push('bar');
		this.super(arguments);

	}
}

class Baz1 extends Base implements IFoo, IBar {
	baz: boolean = true;
	log(): void {
		results.push('baz');
		this.super(arguments);
	}
}
class Baz2 extends Base implements IFoo, IBar {
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
extendsClass(Baz3, [ Bar ]); //Baz3 -> Bar -> Foo
extendsClass(Baz4, [ Bar ]); //Baz4 -> Foo -> Bar -> Baz3
extendsClass(Baz5, [ Baz1 ]);

class BarBaz1 extends Base implements IBar {
	log(): void {
		results.push('BarBaz1');
	}
}
class BarBaz2 extends BarBaz1 implements IBar {
	log(): void {
		this.super(arguments);
		results.push('BarBaz2');
	}
}
class BarBaz3 extends BarBaz2 implements IBar {
	log(): void {
		this.super(arguments);
		results.push('BarBaz3');
	}
}

class PostConstructorBase extends Base {
	protected postConstructor(): void {
		results.push('PostConstructorBase');
		this.super(arguments);
	}
}
class PostConstructorMixin extends Base {
	protected postConstructor(): void {
		results.push('PostConstructorMixin');
		this.super(arguments);
	}
}
class PostConstructorTest1 extends PostConstructorBase {
	protected postConstructor(): void {
		this.super(arguments);
	}
}
class PostConstructorTest2 extends PostConstructorBase {}
extendsClass(PostConstructorTest1, [ PostConstructorMixin ]);
extendsClass(PostConstructorTest2, [ PostConstructorMixin ]);

registerSuite(function () {
	return {
		name: 'nova/class/extends',

		beforeEach: function () {
		},

		'.inheritance': {
			'standard extends': function() {
				results = [];
				var barbaz = new BarBaz3();
				barbaz.log();
				var expected = ['BarBaz1', 'BarBaz2', 'BarBaz3'];
				assert.deepEqual(expected, results);
			},
			'postConstructor': function() {
				var expected = ['PostConstructorMixin', 'PostConstructorBase'];

				results = [];
				new PostConstructorTest1();
				assert.deepEqual(expected, results);

				results = [];
				new PostConstructorTest2();
				assert.deepEqual(expected, results);
			},
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
				expected = ['baz3', 'bar', 'foo', 'foo2'];
				assert.deepEqual(expected, results);
				assert.isTrue((<any> baz3).foo);
				assert.isTrue((<any> baz3).baz3);
				var baz4 = new Baz4();
				results = [];
				baz4.log();
				expected = ['baz4', 'baz3', 'bar', 'foo', 'foo2'];
				assert.deepEqual(expected, results);
				assert.isTrue((<any> baz4).foo);
				assert.isTrue((<any> baz4).baz4);
				var baz5 = new Baz5();
				results = [];
				baz5.log();
				expected = ['baz5', 'baz', 'bar', 'foo', 'foo2'];
				assert.deepEqual(expected, results);
				assert.isTrue((<any> baz5).foo);
				assert.isTrue((<any> baz5).baz5);
			},
			'instanceof': function() {
				var baz1 = new Baz1();
				assert.isTrue(baz1.isInstanceOf(Baz1));
				assert.isTrue(baz1.isInstanceOf(Foo));
				assert.isTrue(baz1.isInstanceOf(Bar));
				assert.isFalse(baz1.isInstanceOf(Baz2));
				var baz5 = new Baz5();
				assert.isTrue(baz5.isInstanceOf(Baz5));
				assert.isTrue(baz5.isInstanceOf(Baz1));
				assert.isTrue(baz5.isInstanceOf(Bar));
				assert.isTrue(baz5.isInstanceOf(Foo));
				assert.isFalse(baz5.isInstanceOf(Baz2));
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
