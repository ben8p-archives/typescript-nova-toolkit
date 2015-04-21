/// <reference path='../../node_modules/intern/typings/intern/intern.d.ts' />
import registerSuite = require('intern!object');
import assert = require('intern/chai!assert');
import object = require('nova/core/object');

registerSuite(function () {
	return {
		name: 'nova/core/object',

		beforeEach: function () {
		},

		'.assign': {
			'one source': function() {
				var ok = false,
					object1 = {
						a: 1,
						b: 'test',
						c: false,
						d: function() {
							ok = false;
						},
						e: [1, 2, 3],
						f: {
							isF1: true,
							isF2: false
						}
					},
					object2 = {
						b: 'test2',
						c: true,
						d: function() {
							ok = true;
						},
						e: [4, 5, 6],
						f: {
							isF1: false,
							isF2: true
						},
						g: 2
					};

				object.assign(object1, object2);
				assert.equal(object1.a, 1);
				assert.equal((<any> object1).g, 2);
				assert.equal(object1.b, object2.b);
				assert.equal(object1.c, object2.c);
				assert.equal(object1.d, object2.d);
				assert.equal(object1.e, object2.e);
				assert.equal(object1.f, object2.f);
				object1.d();
				assert.isTrue(ok);
			},
			'multiple source': function() {
				var object1 = {
						a: 1
					},
					object2 = {
						b: 1
					},
					object3 = {
						c: 1
					};

				object.assign(object1, object2, object3);
				assert.equal(object1.a, 1);
				assert.equal((<any> object1).b, object2.b);
				assert.equal((<any> object1).c, object3.c);
			}
		},
		'.forEach': function() {
			var objectToIterate: {[index: string]: any} = {
					thing1: true,
					thing2: true,
					thing3: true
				},
				allTrue = true,
				callback = function(element: any, key: string) {
					//Set the allTrue variable to the combined result of previous iterations. If one fails, all fail automatically.
					allTrue = allTrue && objectToIterate[key];
				};

			object.forEach(objectToIterate, callback);

			assert.equal(allTrue, true, 'Object.forEach should have iterated over all properties and generated a truthy result.');
		},
		'.every': function() {
			var foo: {[index: string]: any} = {
				one: 128,
				two: 'bbb',
				three: 512
			};

			assert.equal(
				object.every(foo, function(element, key, fooObject) {
					assert.equal(Object, fooObject.constructor, '3rd argument is expected to be an object');
					if (key === 'two') {
						assert.equal(element, foo['two'], 'unexpected value');
					}
					return true;
				}),
				true,
				'Object.every has failed (1)'
			);

			assert.equal(
				object.every(foo, function(element, key) {
					switch (key) {
						case 'one':
							assert.equal(element, foo['one'], 'unexpected value');
							return true;
						case 'two':
							assert.equal(element, foo['two'], 'unexpected value');
							return true;
						case 'three':
							assert.equal(element, foo['three'], 'unexpected value');
							return true;
						default:
							return false;
					}
				}),
				true,
				'Object.every has failed (2)'
			);

			assert.equal(
				object.every(foo, function(element, key) {
					switch (key) {
						case 'one':
							assert.equal(element, foo['one'], 'unexpected value');
							return true;
						case 'two':
							assert.equal(element, foo['two'], 'unexpected value');
							return true;
						case 'three':
							assert.equal(element, foo['three'], 'unexpected value');
							return false;
						default:
							return false;
					}
				}),
				false,
				'Object.every has failed (3)'
			);
		},
		'.some': function() {
			var foo: {[index: string]: any} = {
				one: 128,
				two: 'bbb',
				three: 512
			};
			assert.equal(
				object.some(foo, function() {
					return true;
				}),
				true,
				'object.some has failed (1)'
			);

			assert.equal(
				object.some(foo, function() {
					return false;
				}),
				false,
				'object.some has failed (2)'
			);

			assert.equal(
				object.some(foo, function(element, key, fooObject) {
					assert.equal(Object, fooObject.constructor, '3rd argument is expected to be an object');
					if (key === 'two') {
						assert.equal(element, foo['two'], 'unexpected value');
					}
					return true;
				}),
				true,
				'object.some has failed (3)'
			);
		},
		'.filter': function() {
			var foo: {[index: string]: any} = {
				one: 'foo',
				two: 'bar',
				three: 10
			};
			assert.deepEqual(
				{one: 'foo'},
				object.filter(foo, function(dummyElement, key) {
					return key === 'one';
				}),
				'object.filter has failed (1)'
			);

			assert.deepEqual(
				{one: 'foo'},
				object.filter(foo, function(element) {
					return element === 'foo';
				}),
				'object.filter has failed (2)'
			);

			assert.deepEqual(
				{},
				object.filter(foo, function() {
					return false;
				}),
				'object.filter has failed (3)'
			);

			assert.deepEqual(
				{three: 10},
				object.filter(foo, function(element) {
					return typeof element === 'number';
				}),
				'object.filter has failed (4)'
			);

		},
		'.map': function() {
			assert.deepEqual(
				{},
				object.map({}, function() {
					return true;
				}),
				'object.map has failed (1)'
			);
			assert.deepEqual(
				{cat: 'catvalue', dog: 'dogvalue', mouse: 'mousevalue'},
				object.map({cat: 0, dog: 1, mouse: 2}, function(dummyElement, key) {
					return key + 'value';
				}),
				'object.map has failed (2)'
			);
		}
	};
});
