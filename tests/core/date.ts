/// <reference path="../../node_modules/intern/typings/intern/intern.d.ts" />
import registerSuite = require('intern!object');
import assert = require('intern/chai!assert');
import date = require('nova/core/date');

registerSuite(function () {
	return {
		name: 'nova/core/date',

		beforeEach: function () {
		},
		'.format': function() {
			var newDate = new Date(1984, 8, 15, 8, 5, 2);
			var shortMonth = newDate.toString().split(' ')[1];
			var expected = [
				'15-09-1984',
				'15 ' + shortMonth + ' 1984',
				'08:05:02',
				'08:05',
				'08:02',
				'05:02',
				'08-05-02',
				'8-05-02',
				'15 ' + shortMonth + ' 1984 08:05:02',
				'15-09-1984 08:05:02'
			];

			assert.equal(date.format(newDate, date.FORMAT.DATE_NUMERIC), expected[0]);
			assert.equal(date.format(newDate, date.FORMAT.DATE_LITERAL), expected[1]);

			assert.equal(date.format(newDate, date.FORMAT.TIME_LONG), expected[2]);
			assert.equal(date.format(newDate, 'H:i'), expected[3]);
			assert.equal(date.format(newDate, 'H:s'), expected[4]);
			assert.equal(date.format(newDate, 'i:s'), expected[5]);
			assert.equal(date.format(newDate, 'H-i-s'), expected[6]);
			assert.equal(date.format(newDate, 'G-i-s'), expected[7]);

			assert.equal(date.format(newDate, date.FORMAT.DATE_LITERAL_TIME_LONG), expected[8]);
			assert.equal(date.format(newDate, 'd-m-Y H:i:s'), expected[9]);
		}
	};
});
