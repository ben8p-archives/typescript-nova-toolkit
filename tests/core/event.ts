/// <reference path="../../node_modules/intern/typings/intern/intern.d.ts" />
import registerSuite = require('intern!object');
import assert = require('intern/chai!assert');
import bus = require('nova/core/event');
import CustomEvent = require('nova/core/event/CustomEvent');
import has = require('nova/core/has');

registerSuite(function () {
	var suite = {
		name: 'nova/core/event',

		beforeEach: function () {
		},
		'publish/subscribe': {
			'publish when no subscribers': function() {
				try {
					bus.dispatchEvent(new CustomEvent('barbaz', {detail: '1'}));
					assert.isTrue(true); //if here, there was no javascript error
				} catch (e) {
					console.log(e);
					assert.isTrue(false); //if here, there was no javascript error
				}
			},
			'publish event and remove handler': function() {
				var dfd = this.async(200);
				var result: string[] = [];

				var event = bus.when('foo');
				var handle = event.then((evt: CustomEvent) => {
					result.push('h1: ' + evt.detail);
				});
				event.then((evt: CustomEvent) => {
					result.push('h2: ' + evt.detail);
				});

				bus.dispatchEvent(new CustomEvent('foo', {detail: '1'}));
				bus.dispatchEvent(new CustomEvent('foo', {detail: '2'}));

				handle.then((evt: CustomEvent) => {
					result.push('h3: ' + evt.detail);
				});
				bus.dispatchEvent(new CustomEvent('foo', {detail: '3'}));

				handle.remove();
				bus.dispatchEvent(new CustomEvent('foo', {detail: '4'}));
				bus.dispatchEvent(new CustomEvent('baz', {detail: '5'}));

				setTimeout(dfd.callback(() => {
					assert.deepEqual(result, ['h1: 1', 'h2: 1', 'h1: 2', 'h2: 2', 'h1: 3', 'h2: 3', 'h3: 3', 'h2: 4', 'h3: 4']);
				}), 150);
			},
			'multiple arguments': function() {
				var dfd = this.async(200);

				var event = bus.when('bar');
				event.then(dfd.callback((evt: CustomEvent) => {
					assert.equal(evt.detail[0], '1');
					assert.deepEqual(evt.detail[1], [1, 2, 3]);
					assert.deepEqual(evt.detail[2], {isBar: true});
				}));
				bus.dispatchEvent(new CustomEvent('bar', {detail: ['1', [1, 2, 3], {isBar: true}]}));
			},
			'once()': function() {
				var dfd = this.async(200);
				var result: string[] = [];

				var event = bus.once('onceEvent');
				var handle = event.then((evt: CustomEvent) => {
					result.push('h1: ' + evt.detail);
				});
				event.then((evt: CustomEvent) => {
					result.push('h2: ' + evt.detail);
				});
				bus.dispatchEvent(new CustomEvent('onceEvent', {detail: '1'}));
				bus.dispatchEvent(new CustomEvent('onceEvent', {detail: '2'}));  // all events are already disconnected, this will be ignored
				handle.then((evt: CustomEvent) => {
					result.push('h3: ' + evt.detail);
				});
				bus.dispatchEvent(new CustomEvent('onceEvent', {detail: '3'}));
				bus.dispatchEvent(new CustomEvent('onceEvent', {detail: '4'})); // all events are already disconnected, this will be ignored

				setTimeout(dfd.callback(() => {
					assert.deepEqual(result, ['h1: 1', 'h2: 1', 'h3: 3']);
				}), 150);
			}
		},
		'addEventListener': {
			'add custom event': function() {
				var dfd = this.async(200);
				bus.when(document, 'custom1').then(dfd.callback(() => {
					assert.isTrue(true); //if here, the event was well fired
				}));
				bus.dispatchEvent(document, new CustomEvent('custom1'));
			},
			'add dom event': function() {
				var dfd = this.async(200);
				bus.when(document, 'click').then(dfd.callback(() => {
					assert.isTrue(true); //if here, the event was well fired
				}));
				bus.dispatchEvent(document, new CustomEvent('click'));
			},
			'add/remove custom event': function() {
				var dfd = this.async(200);
				var result: number = 0;
				bus.when(document, 'custom2').then(function() {
					result++;
				});
				var handle = bus.when(document, 'custom2').then(function() {
					result++;
				});
				bus.dispatchEvent(document, new CustomEvent('custom2'));
				handle.remove();
				bus.dispatchEvent(document, new CustomEvent('custom2'));

				setTimeout(dfd.callback(() => {
					assert.equal(result, 3);
				}), 150);
			},
			'once': function() {
				var dfd = this.async(200);
				var result: number = 0;
				bus.once(document, 'custom3').then(function() {
					result++;
				});
				bus.dispatchEvent(document, new CustomEvent('custom3'));
				bus.dispatchEvent(document, new CustomEvent('custom3'));

				setTimeout(dfd.callback(() => {
					assert.equal(result, 1);
				}), 150);
			},
			'bubbling': function() {
				var dfd = this.async(200);
				bus.when(window, 'custom4').then(dfd.callback(() => {
					assert.isTrue(true); //if here, event has bubbled up
				}));
				bus.dispatchEvent(document, new CustomEvent('custom4', {bubbles: true}));
			},
			'cancel bubbling': function() {
				var dfd = this.async(200);
				var ok = true;
				bus.when(window, 'custom5').then(() => {
					ok = false; //if here, event has bubbled up while it should not
				});
				bus.when(document, 'custom5').then(function(evt: CustomEvent) {
					evt.stopPropagation();
				});
				bus.dispatchEvent(document, new CustomEvent('custom5', {bubbles: true, cancelable: true}));
				setTimeout(dfd.callback(() => {
					assert.isTrue(ok);
				}), 150);
			},
			'detail': function() {
				var dfd = this.async(200);
				bus.when(document, 'custom6').then(dfd.callback((evt: CustomEvent) => {
					assert.equal(evt.detail, 'foo');
				}));
				bus.dispatchEvent(document, new CustomEvent('custom6', {detail: 'foo'}));
			}
		}
	};
	if (has('node-host')) {
		delete suite.addEventListener;
		console.warn('addEventListener test skipped because of NodeJs');
	}
	return suite;
});
