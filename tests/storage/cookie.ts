/// <reference path="../../node_modules/intern/typings/intern/intern.d.ts" />
import registerSuite = require('intern!object');
import assert = require('intern/chai!assert');
import storage = require('nova/storage/cookie');
import has = require('nova/core/has');

registerSuite(function () {
	var suite = {
		name: 'nova/storage/cookie',

		before: function () {
			storage.clear();
			this.item1 = 'bar';
			this.item2 = 'foo';
		},
		'storage': {
			'set and get an item': function() {
				storage.setItem('test1', this.parent.parent.item1);
				storage.setItem('test2', this.parent.parent.item2);
				storage.setItem('test3', this.parent.parent.item3);

				assert.equal(storage.length, 3, 'length is wrong');

				assert.deepEqual(storage.getItem('test1'), this.parent.parent.item1, 'Item set or get did not work');
				assert.equal(storage.getItem('test2'), this.parent.parent.item2, 'Item set or get did not work');
				assert.equal(storage.getItem('test3'), this.parent.parent.item3, 'Item set or get did not work');

				// We cannot test for keys since ordering is implemented different between browsers
				// we can however test that keys are available or null
				assert(storage.key(0) !== null, 'key(0) did not work');
				assert(storage.key(1) !== null, 'key(1) did not work');
				assert(storage.key(2) !== null, 'key(2) did not work');
				assert.equal(storage.key(3), null, 'key(3) did not work');
			},
			'remove an item': function() {
				//must run after 'set and get an item'

				storage.removeItem('test2');

				assert.equal(storage.length, 2, 'length is wrong');

				assert.deepEqual(storage.getItem('test1'), this.parent.parent.item1, 'Item set or get did not work');
				assert.equal(storage.getItem('test2'), null, 'Item set or get did not work');
				assert.equal(storage.getItem('test3'), this.parent.parent.item3, 'Item set or get did not work');

				// We cannot test for keys since ordering is implemented different between browsers
				// we can however test that keys are available or null
				assert(storage.key(0) !== null, 'key(0) did not work');
				assert(storage.key(1) !== null, 'key(1) did not work');
				assert.equal(storage.key(2), null, 'key(2) did not work');

			},
			'clear': function() {
				//must run after 'set and get an item'

				assert.equal(storage.length > 0, true, 'clear cannot be tested if the storage is empty');
				storage.clear();
				assert.equal(storage.length, 0, 'clear() did not work');
				assert.equal(storage.getItem('test1'), null, 'clear() did not work');
				assert.equal(storage.key(0), null, 'clear() did not work');
			}
		}
	};
	if (has('node-host')) {
		delete suite.storage;
		console.warn('cookie test skipped because of NodeJs');
	}
	return suite;
});
