/// <reference path="../../node_modules/intern/typings/intern/intern.d.ts" />
import registerSuite = require('intern!object');
import assert = require('intern/chai!assert');
import insert = require('nova/dom/insert');
import has = require('nova/core/has');

registerSuite(function () {
	var elements: {body: HTMLElement, div: HTMLElement, childDiv: HTMLElement } = {
		body: null,
		div: null,
		childDiv: null
	};
	var suite = {
		name: 'nova/dom/insert',

		beforeEach: function () {
			var documentFragment = document.createDocumentFragment();
			var body = document.createElement('body');
			var div = document.createElement('div');
			var childDiv = document.createElement('div');
			documentFragment.appendChild(body);
			body.appendChild(div);
			div.appendChild(childDiv);
			elements.body = body;
			elements.div = div;
			elements.childDiv = childDiv;
		},
		'insert': {
			'helper': function() {
				var body: HTMLElement = elements.body;
				var div: HTMLElement = elements.div;
				var childDiv: HTMLElement = elements.childDiv;
				var divBefore: HTMLElement = document.createElement('div');
				divBefore.className = 'before';
				var divAfter: HTMLElement = document.createElement('div');
				divAfter.className = 'after';
				var divFirst: HTMLElement = document.createElement('div');
				divFirst.className = 'first';
				var divLast: HTMLElement = document.createElement('div');
				divLast.className = 'last';

				insert(divBefore, div, insert.position.BEFORE);
				assert.equal((<HTMLElement> body.firstChild).className, divBefore.className);
				assert.equal((<HTMLElement> div.previousSibling).className, divBefore.className);

				insert(divAfter, div, insert.position.AFTER);
				assert.equal((<HTMLElement> body.lastChild).className, divAfter.className);
				assert.equal((<HTMLElement> div.nextSibling).className, divAfter.className);

				insert(divFirst, div, insert.position.FIRST);
				assert.equal((<HTMLElement> div.firstChild).className, divFirst.className);
				assert.equal((<HTMLElement> childDiv.previousSibling).className, divFirst.className);

				insert(divLast, div, insert.position.LAST);
				assert.equal((<HTMLElement> div.lastChild).className, divLast.className);
				assert.equal((<HTMLElement> childDiv.nextSibling).className, divLast.className);
			},
			'.after': function() {
				var body: HTMLElement = elements.body;
				var div: HTMLElement = elements.div;
				var newDiv: HTMLElement = document.createElement('div');
				newDiv.className = 'newDiv';

				insert.after(newDiv, div);
				assert.equal((<HTMLElement> body.lastChild).className, newDiv.className);
				assert.equal((<HTMLElement> div.nextSibling).className, newDiv.className);
			},
			'.before': function() {
				var body: HTMLElement = elements.body;
				var div: HTMLElement = elements.div;
				var newDiv: HTMLElement = document.createElement('div');
				newDiv.className = 'newDiv';

				insert.before(newDiv, div);
				assert.equal((<HTMLElement> body.firstChild).className, newDiv.className);
				assert.equal((<HTMLElement> div.previousSibling).className, newDiv.className);
			},
			'.first': function() {
				var div: HTMLElement = elements.div;
				var childDiv: HTMLElement = elements.childDiv;
				var newDiv: HTMLElement = document.createElement('div');
				newDiv.className = 'newDiv';

				insert.first(newDiv, div);
				assert.equal((<HTMLElement> div.firstChild).className, newDiv.className);
				assert.equal((<HTMLElement> childDiv.previousSibling).className, newDiv.className);
			},
			'.last': function() {
				var div: HTMLElement = elements.div;
				var childDiv: HTMLElement = elements.childDiv;
				var newDiv: HTMLElement = document.createElement('div');
				newDiv.className = 'newDiv';

				insert.last(newDiv, div);
				assert.equal((<HTMLElement> div.lastChild).className, newDiv.className);
				assert.equal((<HTMLElement> childDiv.nextSibling).className, newDiv.className);
			}
		}
	};
	if (has('node-host')) {
		delete suite.insert;
		console.warn('insert test skipped because of NodeJs');
	}
	return suite;
});
