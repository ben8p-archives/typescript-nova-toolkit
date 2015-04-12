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
		}
	};
});
