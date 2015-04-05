/// <reference path="../../../../node_modules/intern/typings/intern/intern.d.ts" />
import registerSuite = require('intern!object');
import assert = require('intern/chai!assert');
import bus = require('nova/core/event/bus');

registerSuite(function () {
	return {
		name: 'nova/core/event/bus',

		beforeEach: function () {
		},
		'publish when no subscribers': function() {
			try{
				bus.publish('barbaz', '1');
				assert.isTrue(true); //if here, there was no javascript error
			} catch (e) {
				assert.isTrue(false); //if here, there was no javascript error
			}


		},
		'publish event and cancel handler': function() {
			var dfd = this.async(200);
			var result:string[] = [];

			var event = bus.when('foo');
			var handle = event.then((value:string) => {
				result.push('h1:' + value);
			});
			event.then((value:string) => {
				result.push('h2:' + value);
			});

			bus.publish('foo', '1');
			bus.publish('foo', '2');
			handle.then((value:string) => {
				result.push('h3:' + value);
			})
			bus.publish('foo', '3');
			handle.cancel();
			bus.publish('foo', '4');
			bus.publish('baz', '5'); //non existing event, no handler, no hcnage to result[]

			setTimeout(dfd.callback(() => {
				assert.deepEqual(result, ['h1:1', 'h2:1', 'h1:2', 'h2:2', 'h1:3', 'h2:3', 'h3:3', 'h2:4', 'h3:4']);
			}), 150);
		},
		'multiple arguments': function() {
			var dfd = this.async(200);

			var event = bus.when('bar');
			var handle = event.then(dfd.callback((value1:string, value2:number[], value3:any) => {
				assert.equal(value1, '1');
				assert.deepEqual(value2, [1, 2, 3]);
				assert.deepEqual(value3, {isBar: true});
			}));

			bus.publish('bar', '1', [1, 2, 3], {isBar: true});
		},
		'once()': function() {
			var dfd = this.async(200);
			var result:string[] = [];

			var event = bus.once('onceEvent');
			var handle = event.then((value:string) => {
				result.push('h1:' + value);
			});
			event.then((value:string) => {
				result.push('h2:' + value);
			});

			bus.publish('onceEvent', '1');
			bus.publish('onceEvent', '2');  // all events are already disconnected, this will be ignored
			handle.then((value:string) => {
				result.push('h3:' + value);
			})
			bus.publish('onceEvent', '3');
			bus.publish('onceEvent', '4'); // all events are already disconnected, this will be ignored

			setTimeout(dfd.callback(() => {
				assert.deepEqual(result, ['h1:1', 'h2:1', 'h3:3']);
			}), 150);
		},
	}
})
