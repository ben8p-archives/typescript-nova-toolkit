/// <reference path="../../node_modules/intern/typings/intern/intern.d.ts" />
import registerSuite = require('intern!object');
import assert = require('intern/chai!assert');
import math = require('nova/dom/math');
import has = require('nova/core/has');

registerSuite(function () {
	var suite = {
		name: 'nova/dom/math',

		beforeEach: function () {},
		'math': {
			'.getPosition': function() {
				var div = document.createElement('div');
				div.style.position = 'relative';
				div.style.height = '2000px';
				div.style.width = '3000px';
				document.body.appendChild(div);
				var div2 = document.createElement('div');
				div2.style.position = 'absolute';
				div2.style.left = '1500px';
				div2.style.top = '1000px';
				document.body.appendChild(div2);
				window.scrollTo(500, 200);
				var position = math.getPosition(div2);

				assert.equal(position.inDocument.left, 1500);
				assert.equal(position.inDocument.top, 1000);
				assert.equal(position.inViewport.left, 1500 - 500);
				assert.equal(position.inViewport.top, 1000 - 200);

				document.body.removeChild(div2);
				document.body.removeChild(div);
			},
			'.getBoxSize': function() {
				var div = document.createElement('div');
				div.style.margin = '4px 5px 6px 7px';
				div.style.padding = '8px 9px 10px 11px';
				div.style.border = '2px solid red';
				div.style.borderWidth = '12px 13px 14px 15px';
				div.style.width = '100px';
				div.style.height = '150px';
				div.style.boxSizing = 'content-box';
				document.body.appendChild(div);

				var size = math.getBoxSize(div);
				assert.equal(size.margin.top, 4);
				assert.equal(size.margin.right, 5);
				assert.equal(size.margin.bottom, 6);
				assert.equal(size.margin.left, 7);

				assert.equal(size.padding.top, 8);
				assert.equal(size.padding.right, 9);
				assert.equal(size.padding.bottom, 10);
				assert.equal(size.padding.left, 11);

				assert.equal(size.border.top, 12);
				assert.equal(size.border.right, 13);
				assert.equal(size.border.bottom, 14);
				assert.equal(size.border.left, 15);

				//'available' represent the available space (so excluding padding)
				// and others represnet the space used on the page
				assert.equal(size.content.availableWidth, 100);
				assert.equal(size.content.availableHeight, 150);
				assert.equal(size.content.width, 100 + 5 + 7 + 9 + 11 + 13 + 15); //80
				assert.equal(size.content.height, 150 + 4 + 6 + 8 + 10 + 12 + 14); //84

				div.style.boxSizing = 'border-box';

				size = math.getBoxSize(div);

				assert.equal(size.content.availableWidth, 100 - 9 - 11 - 13 - 15); //52
				assert.equal(size.content.availableHeight, 150 - 8 - 10 - 12 - 14); //106
				assert.equal(size.content.width, 100 + 5 + 7); //112
				assert.equal(size.content.height, 150 + 4 + 6); //160

				document.body.removeChild(div);
			}
		}
	};
	if (has('node-host')) {
		delete suite.math;
		console.warn('math test skipped because of NodeJs');
	}
	return suite;
});
