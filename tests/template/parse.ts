/// <reference path="../../node_modules/intern/typings/intern/intern.d.ts" />
import registerSuite = require('intern!object');
import assert = require('intern/chai!assert');
import parse = require('nova/template/parse');
import has = require('nova/core/has');

registerSuite(function () {
	var suite = {
		name: 'nova/template/parse',

		beforeEach: function () {},
		'parse': {
			'parse with no anchor': function() {
				var parsed = parse('<div>foo</div>');
				assert.strictEqual((<HTMLElement> parsed.documentFragment.firstChild).innerHTML, 'foo');

				parsed = parse('<div>foo</div><div>bar</div>');
				assert.strictEqual((<HTMLElement> parsed.documentFragment.firstChild).innerHTML, 'foo');
				assert.strictEqual((<HTMLElement> parsed.documentFragment.lastChild).innerHTML, 'bar');
			},
			'parse with anchor': function() {
				var parsed = parse('<div>foo</div><div data-anchor="foo">bar</div>');
				assert.strictEqual((<HTMLElement> parsed.documentFragment.lastChild).innerHTML, 'bar');
				assert.strictEqual((<HTMLElement> parsed.anchors['foo']).innerHTML, 'bar');

				parsed = parse('<div data-anchor="barbaz">foo</div><div data-anchor="bar,baz">bar</div>');
				assert.strictEqual((<HTMLElement> parsed.anchors['barbaz']).innerHTML, 'foo');
				assert.strictEqual((<HTMLElement> parsed.anchors['bar']).innerHTML, 'bar');
				assert.strictEqual((<HTMLElement> parsed.anchors['baz']).innerHTML, 'bar');
			},
			'parse with place holders': function() {
				var parsed = parse('<div>${value}</div>', {value: 'foo'});
				assert.strictEqual((<HTMLElement> parsed.documentFragment.firstChild).innerHTML, 'foo');

				parsed = parse('<div>${fooValue}</div><div data-anchor="bar">${barValue}</div>', {fooValue: 'foo', barValue: 'bar'});
				assert.strictEqual((<HTMLElement> parsed.documentFragment.firstChild).innerHTML, 'foo');
				assert.strictEqual((<HTMLElement> parsed.anchors['bar']).innerHTML, 'bar');
			}
		}
	};
	if (has('node-host')) {
		delete suite.parse;
		console.warn('parse test skipped because of NodeJs');
	}
	return suite;
});
