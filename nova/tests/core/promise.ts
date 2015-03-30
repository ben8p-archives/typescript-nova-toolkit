/// <reference path="../../../node_modules/intern/typings/intern/intern.d.ts" />
import registerSuite = require('intern!object');
import assert = require('intern/chai!assert');
import promise = require('nova/core/promise');

registerSuite(function () {
	return {
		name: 'nova/core/promise',

		beforeEach: function () {
		},
		'when':  {
			'basic types' : function() {
				var dfd = this.async(200);
				var results:any[] = [];

				promise.when(true).then((value:boolean) => {
					results.push(value);
				});
				promise.when(false).then((value:boolean) => {
					results.push(value);
				});
				promise.when('foobar').then((value:boolean) => {
					results.push(value);
				});
				promise.when(5).then((value:boolean) => {
					results.push(value);
				});
				promise.when(null).then((value:boolean) => {
					results.push(value);
				});
				promise.when().then((value:boolean) => {
					results.push(value);
				});

				setTimeout(dfd.callback(() => {
					assert.deepEqual(results, [true, false, 'foobar', 5, null, undefined]);
				}), 150);
			},
			'with promise' : function() {
				var dfd = this.async(200);
				var results:any[] = [];

				var p0:promise.Deferred = new promise.Deferred();
				promise.when(p0).then((value:string) => {
					results.push(value);
				});
				p0.resolve('foo');

				var p1:promise.Deferred = new promise.Deferred();
				promise.when(p1).then(() => {}, (value:string) => {
					results.push(value);
				});
				p1.reject('rejected');

				var p2:promise.Deferred = new promise.Deferred();
				var p3 = p2.then((value:string) => {
					return value + 'baz';
				})
				promise.when(p3).then((value:string) => {
					results.push(value);
				});
				p2.resolve('bar');

				setTimeout(dfd.callback(() => {
					assert.deepEqual(results, ['foo', 'rejected', 'barbaz']);
				}), 150);
			},

		},
		'new Promise': {
			'resolve': function() {
				var dfd = this.async(200);

				var p:promise.Deferred = new promise.Deferred();
				p.then(dfd.callback((value:string) => {
					assert.equal(value, 'foo');
				}));
				p.resolve('foo');

			},
			'double resolve': function() {
				var dfd = this.async(200);

				var p:promise.Deferred = new promise.Deferred();
				var results:any[] = [];
				p.then((value:string) => {
					results.push('then');
				});
				p.resolve();
				p.resolve();

				setTimeout(dfd.callback(() => {
					assert.deepEqual(results, ['then']);
				}), 150);

			},
			'double reject': function() {
				var dfd = this.async(200);

				var p:promise.Deferred = new promise.Deferred();
				var results:any[] = [];
				p.catch((value:string) => {
					results.push('catch');
				});
				p.reject();
				p.reject();

				setTimeout(dfd.callback(() => {
					assert.deepEqual(results, ['catch']);
				}), 150);

			},
			'then after resolve': function() {
				var dfd = this.async(200);

				var p:promise.Deferred = new promise.Deferred();
				var results:any[] = [];
				p.then((value:string) => {
					var newValue:string = value + 'then1';
					results.push(newValue);
					return newValue;
				});
				p.resolve('foo');

				var p2:promise.Deferred = new promise.Deferred();
				var results2:any[] = [];
				var p3 = p2.then((value:string) => {
					var newValue:string = value + 'then1';
					results2.push(newValue);
					return newValue;
				});
				p2.resolve('bar');

				setTimeout(() => {
					p.then((value:string) => {
						var newValue:string = value + 'then2';
						results.push(newValue);
						return newValue;
					});
					p3.then((value:string) => {
						var newValue:string = value + 'then2';
						results2.push(newValue);
						return newValue;
					});
				}, 50);

				setTimeout(dfd.callback(() => {
					assert.deepEqual(results, ['foothen1', 'foothen2']);
					assert.deepEqual(results2, ['barthen1', 'barthen1then2']);
				}), 150);

			},
			'catch after reject': function() {
				var dfd = this.async(200);

				var p:promise.Deferred = new promise.Deferred();
				var results:any[] = [];
				p.catch((value:string) => {
					var newValue:string = value + 'catch1';
					results.push(newValue);
					return newValue;
				});
				p.reject('foo');

				var p2:promise.Deferred = new promise.Deferred();
				var results2:any[] = [];
				var p3 = p2.catch((value:string) => {
					var newValue:string = value + 'catch1';
					results2.push(newValue);
					return newValue;
				});
				p2.reject('bar');

				setTimeout(() => {
					p.catch((value:string) => {
						var newValue:string = value + 'catch2';
						results.push(newValue);
						return newValue;
					});
					p3.catch((value:string) => {
						var newValue:string = value + 'catch2';
						results2.push(newValue);
						return newValue;
					});
				}, 50);

				setTimeout(dfd.callback(() => {
					assert.deepEqual(results, ['foocatch1', 'foocatch2']);
					assert.deepEqual(results2, ['barcatch1']); //catch are not resolving
				}), 150);

			},
			'resolve chain': function() {
				var dfd = this.async(200);

				var p:promise.Deferred = new promise.Deferred();
				p.then(function(value:string) {
					return value + 'bar';
				}).then(dfd.callback((value:string) => {
					assert.equal(value, 'foobar');
				}));
				p.resolve('foo');

			},
			'multiple resolve without chain': function() {
				var dfd = this.async(200);

				var p:promise.Deferred = new promise.Deferred();
				var count:number = 0;
				p.then(function(value:string) {
					count++;
					return value + 'bar';
				});
				p.then(dfd.callback((value:string) => {
					count++;
					assert.equal(count, 2); //both 'then' have been executed
					assert.equal(value, 'foo'); //no chaining so the value is not modified by the previous return
				}));
				p.resolve('foo');

			},
			'reject using catch': function() {
				var dfd = this.async(200);

				var p:promise.Deferred = new promise.Deferred();
				p.catch(dfd.callback((value:string) => {
					assert.equal(value, 'foo');
				}));
				p.reject('foo');
			},
			'reject using then': function() {
				var dfd = this.async(200);

				var p:promise.Deferred = new promise.Deferred();
				p.then(function() {}, dfd.callback((value:string) => {
					assert.equal(value, 'foo');
				}));
				p.reject('foo');
			},
			'reject cannot be chained': function() {
				var dfd = this.async(200);

				var p:promise.Deferred = new promise.Deferred();
				var count:number = 0;
				p.catch(() => {
					count++;
				}).catch(() => {
					count++;
				});
				p.reject();

				setTimeout(dfd.callback(() => {
					assert.equal(count, 1); //reject must not be chained
				}), 150);

			},
			'multiple reject without chain': function() {
				var dfd = this.async(200);

				var p:promise.Deferred = new promise.Deferred();
				var count:number = 0;
				p.catch(function(value:string) {
					count++;
					return value + 'bar';
				});
				p.catch(dfd.callback((value:string) => {
					count++;
					assert.equal(count, 2); //both 'then' have been executed
					assert.equal(value, 'foo'); //no chaining so the value is not modified by the previous return
				}));
				p.reject('foo');

			},
			'deferred interface': function() {
				var dfd = this.async(200);

				var p1:promise.Deferred = new promise.Deferred();
				p1.resolve();

				var p2:promise.Deferred = new promise.Deferred();
				p2.catch(function() {}); //dummy to prevent error
				p2.reject();

				var p3:promise.Deferred = new promise.Deferred();

				setTimeout(dfd.callback(() => {
					assert.equal(p1.isFulfilled(), true);
					assert.equal(p1.isResolved(), true);
					assert.equal(p1.isRejected(), false);

					assert.equal(p2.isFulfilled(), true);
					assert.equal(p2.isResolved(), false);
					assert.equal(p2.isRejected(), true);

					assert.equal(p3.isFulfilled(), false);
					assert.equal(p3.isResolved(), false);
					assert.equal(p3.isRejected(), false);
				}), 150);

			}
		}
	}
})
