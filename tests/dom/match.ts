/// <reference path="../../node_modules/intern/typings/intern/intern.d.ts" />
import registerSuite = require('intern!object');
import assert = require('intern/chai!assert');
import match = require('nova/dom/match');
import has = require('nova/core/has');

registerSuite(function () {
	var suite = {
		name: 'nova/dom/match',

		beforeEach: function () {},
		'match': {
			'.matches': function() {
				var div = document.createElement('div');
				div.className = 'foo bar';
				document.body.appendChild(div);

				assert.isTrue(match.matches(div, '.foo'));
				assert.isTrue(match.matches(div, '.bar'));
				assert.isTrue(match.matches(div, '.foo.bar'));
				assert.isFalse(match.matches(div, '.foo.baz'));
				assert.isFalse(match.matches(div, '.baz'));

				document.body.removeChild(div);
			},
			'.closest': function() {
				var div = document.createElement('div');
				div.className = 'foo bar';
				var div2 = document.createElement('div');
				div2.className = 'baz barbaz';
				var div3 = document.createElement('div');
				div3.className = 'foobar';
				div2.appendChild(div3);
				div.appendChild(div2);
				document.body.appendChild(div);

				assert.strictEqual(match.closest('.foo', div2), div);
				assert.strictEqual(match.closest('.bar', div2), div);
				assert.strictEqual(match.closest('.foo.bar', div2), div);
				assert.strictEqual(match.closest('.baz', div2), div2);

				assert.strictEqual(match.closest('.barbaz', div3, div), div2);
				assert.isNull(match.closest('.foo', div3, div));
				assert.strictEqual(match.closest('.foo', div3), div);

				assert.isNull(match.closest('.foo.baz', div2));
				assert.isNull(match.closest('.foobaz', div2));

				document.body.removeChild(div);
			}
		}
	};
	if (has('node-host')) {
		delete suite.match;
		console.warn('match test skipped because of NodeJs');
	}
	return suite;
});
