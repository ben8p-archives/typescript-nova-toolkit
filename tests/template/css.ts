/// <reference path="../../node_modules/intern/typings/intern/intern.d.ts" />
/// <amd-dependency path="nova/dom/ready!" />
import registerSuite = require('intern!object');
import assert = require('intern/chai!assert');
import css = require('nova/template/css');
import has = require('nova/core/has');

registerSuite(function () {
	var suite = {
		name: 'nova/template/css',

		beforeEach: function () {},
		'css': {
			'inject': function() {
				var div = document.createElement('div');
				div.id = 'injectCssTest';
				document.body.appendChild(div);

				var style = window.getComputedStyle(div);
				var originalColor = style.color;

				css.inject('#injectCssTest { color: red !important}');
				style = window.getComputedStyle(div);
				assert.notEqual(style.color, originalColor);

				css.inject('#injectCssTest { background-image: url(foo.png)}', 'http://bar.com');
				style = window.getComputedStyle(div);
				assert.isTrue(style.backgroundImage.indexOf('http://bar.com/foo.png') > 0);

				css.inject('#injectCssTest { background-image: url(/baz.png) !important}', 'http://bar.com');
				style = window.getComputedStyle(div);
				assert.isTrue(style.backgroundImage.indexOf(location.protocol + '//' + location.host + '/baz.png') > 0);

				document.body.removeChild(div);
			}
		}
	};
	if (has('node-host')) {
		delete suite.css;
		console.warn('css test skipped because of NodeJs');
	}
	return suite;
});
