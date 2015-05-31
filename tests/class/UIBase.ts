/// <reference path='../../node_modules/intern/typings/intern/intern.d.ts' />

import registerSuite = require('intern!object');
import assert = require('intern/chai!assert');
import UIBase = require('nova/class/UIBase');

var results: string[] = [];
class Bar extends UIBase {
	protected templateString = '<div data-anchor="bar">foo</foo>';
	constructor() {
		super();
		if (this.constructed) { return; }
		results.push('constructor');
	}
	protected postConstructor() {
		this.super(arguments);
		results.push('postConstructor');
	}
	getDomNode(): Node {
		return this.domNode;
	}
	getNodeAnchor(): Node {
		return (<any> this.nodeAnchors).bar;
	}

}

registerSuite(function () {
	return {
		name: 'nova/class/UIBase',

		beforeEach: function () {
		},

		'UIBase class': function() {
			//note: instanceof() and super() are tested in extends

			results = [];
			var bar = new Bar();
			var expected = ['constructor', 'postConstructor'];
			assert.deepEqual(expected, results);
			assert.isNotNull(bar.getDomNode());
			assert.isNotNull(bar.getNodeAnchor());
		}
	};
});
