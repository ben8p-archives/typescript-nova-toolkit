/// <reference path="../../../node_modules/intern/typings/intern/intern.d.ts" />
import registerSuite = require('intern!object');
import assert = require('intern/chai!assert');
import Promise = require('nova/core/promise/Promise');
import Deferred = require('nova/core/promise/Deferred');

registerSuite(function () {
	return {
		name: 'nova/core/promise/Promise',

		beforeEach: function () {
		},

		'Promise': {
			'standard resolve': function() {
				var dfd = this.async(200);
				var resolver: Function;
				var p = new Promise(function(resolverCallback: Function) {
					resolver = resolverCallback;
				});
				p.then(dfd.callback((value: string) => {
					assert.equal(value, 'foo');
				}));
				resolver('foo');

			},
			'Promise.all': function() {
				var dfd = this.async(200);
				var promise = Promise.resolve(3);

				var p = Promise.all(['foo', promise]);
				p.then(dfd.callback((values: any[]) => {
					assert.deepEqual(values, ['foo', 3]);
				}));

			},
			'Promise.race': {
				'with basic type': function() {
					var dfd = this.async(200);
					Promise.resolve(3);

					var p = Promise.race(['foo']);
					p.then(dfd.callback((value: any[]) => {
						assert.equal(value, 'foo');
					}));
				},
				'with Promise': function() {
					var dfd = this.async(200);
					var promise = Promise.resolve(3);

					var p = Promise.race([promise]);
					p.then(dfd.callback((value: any[]) => {
						assert.equal(value, 3);
					}));
				},
				'with Promise (order)': function() {
					var dfd = this.async(2000);

					var p0: Deferred = new Deferred();
					var p1: Deferred = new Deferred();

					var p = Promise.race([p0, p1]);
					p.then(dfd.callback((value: any[]) => {
						assert.equal(value, 'bar');
					}));

					p1.resolve('bar');
				}
			},
			'Promise.resolve':  {
				'basic types' : function() {
					var dfd = this.async(200);
					var results: any[] = [];

					Promise.resolve(true).then((value: boolean) => {
						results.push(value);
					});
					Promise.resolve(false).then((value: boolean) => {
						results.push(value);
					});
					Promise.resolve('foobar').then((value: boolean) => {
						results.push(value);
					});
					Promise.resolve(5).then((value: boolean) => {
						results.push(value);
					});
					Promise.resolve(null).then((value: boolean) => {
						results.push(value);
					});
					Promise.resolve().then((value: boolean) => {
						results.push(value);
					});

					setTimeout(dfd.callback(() => {
						assert.deepEqual(results, [true, false, 'foobar', 5, null, undefined]);
					}), 150);
				},
				'with promise' : function() {
					var dfd = this.async(200);
					var results: any[] = [];

					var p0: Deferred = new Deferred();
					Promise.resolve(p0).then((value: string) => {
						results.push(value);
					});
					p0.resolve('foo');

					var p1: Deferred = new Deferred();
					Promise.resolve(p1).then(() => {}, (value: string) => {
						results.push(value);
					});
					p1.reject('rejected');

					var p2: Deferred = new Deferred();
					var p3 = p2.then((value: string) => {
						return value + 'baz';
					});
					Promise.resolve(p3).then((value: string) => {
						results.push(value);
					});
					p2.resolve('bar');

					setTimeout(dfd.callback(() => {
						assert.deepEqual(results, ['foo', 'rejected', 'barbaz']);
					}), 150);
				}

			},
			'Promise.reject': function() {
				var dfd = this.async(200);

				var p = Promise.reject('foo');
				p.catch(dfd.callback((value: string) => {
					assert.equal(value, 'foo');
				}));

			},

			'double resolve': function() {
				var dfd = this.async(200);

				var resolver: Function;
				var p = new Promise(function(resolverCallback: Function) {
					resolver = resolverCallback;
				});
				var results: any[] = [];
				p.then((value: string) => {
					results.push('then');
				});
				resolver();
				resolver();

				setTimeout(dfd.callback(() => {
					assert.deepEqual(results, ['then']);
				}), 150);

			},
			'double reject': function() {
				var dfd = this.async(200);

				var rejecter: Function;
				var p = new Promise(function(resolverCallback: Function, rejecterCallback: Function) {
					rejecter = rejecterCallback;
				});
				var results: any[] = [];
				p.catch((value: string) => {
					results.push('catch');
				});
				rejecter();
				rejecter();

				setTimeout(dfd.callback(() => {
					assert.deepEqual(results, ['catch']);
				}), 150);

			},
			'then after resolve': function() {
				var dfd = this.async(200);

				var resolver: Function;
				var p = new Promise(function(resolverCallback: Function) {
					resolver = resolverCallback;
				});
				var results: any[] = [];
				p.then((value: string) => {
					var newValue: string = value + 'then1';
					results.push(newValue);
					return newValue;
				});
				resolver('foo');

				var p2 = new Promise(function(resolverCallback: Function) {
					resolver = resolverCallback;
				});
				var results2: any[] = [];
				var p3 = p2.then((value: string) => {
					var newValue: string = value + 'then1';
					results2.push(newValue);
					return newValue;
				});
				resolver('bar');

				setTimeout(() => {
					p.then((value: string) => {
						var newValue: string = value + 'then2';
						results.push(newValue);
						return newValue;
					});
					p3.then((value: string) => {
						var newValue: string = value + 'then2';
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

				var rejecter: Function;
				var p = new Promise(function(resolverCallback: Function, rejecterCallback: Function) {
					rejecter = rejecterCallback;
				});
				var results: any[] = [];
				p.catch((value: string) => {
					var newValue: string = value + 'catch1';
					results.push(newValue);
					return newValue;
				});
				rejecter('foo');

				var p2 = new Promise(function(resolverCallback: Function, rejecterCallback: Function) {
					rejecter = rejecterCallback;
				});
				var results2: any[] = [];
				var p3 = p2.catch((value: string) => {
					var newValue: string = value + 'catch1';
					results2.push(newValue);
					return newValue;
				});
				rejecter('bar');

				setTimeout(() => {
					p.catch((value: string) => {
						var newValue: string = value + 'catch2';
						results.push(newValue);
						return newValue;
					});
					p3.catch((value: string) => {
						var newValue: string = value + 'catch2';
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

				var resolver: Function;
				var p = new Promise(function(resolverCallback: Function) {
					resolver = resolverCallback;
				});
				p.then(function(value: string) {
					return value + 'bar';
				}).then(dfd.callback((value: string) => {
					assert.equal(value, 'foobar');
				}));
				resolver('foo');

			},
			'multiple resolve without chain': function() {
				var dfd = this.async(200);

				var resolver: Function;
				var p = new Promise(function(resolverCallback: Function) {
					resolver = resolverCallback;
				});
				var count: number = 0;
				p.then(function(value: string) {
					count++;
					return value + 'bar';
				});
				p.then(dfd.callback((value: string) => {
					count++;
					assert.equal(count, 2); //both 'then' have been executed
					assert.equal(value, 'foo'); //no chaining so the value is not modified by the previous return
				}));
				resolver('foo');

			},
			'reject using catch': function() {
				var dfd = this.async(200);

				var rejecter: Function;
				var p = new Promise(function(resolverCallback: Function, rejecterCallback: Function) {
					rejecter = rejecterCallback;
				});
				p.catch(dfd.callback((value: string) => {
					assert.equal(value, 'foo');
				}));
				rejecter('foo');
			},
			'reject using then': function() {
				var dfd = this.async(200);

				var rejecter: Function;
				var p = new Promise(function(resolverCallback: Function, rejecterCallback: Function) {
					rejecter = rejecterCallback;
				});
				p.then(function() {}, dfd.callback((value: string) => {
					assert.equal(value, 'foo');
				}));
				rejecter('foo');
			},
			'reject cannot be chained': function() {
				var dfd = this.async(200);

				var rejecter: Function;
				var p = new Promise(function(resolverCallback: Function, rejecterCallback: Function) {
					rejecter = rejecterCallback;
				});
				var count: number = 0;
				p.catch(() => {
					count++;
				}).catch(() => {
					count++;
				});
				rejecter();

				setTimeout(dfd.callback(() => {
					assert.equal(count, 1); //reject must not be chained
				}), 150);

			},
			'multiple reject without chain': function() {
				var dfd = this.async(200);

				var rejecter: Function;
				var p = new Promise(function(resolverCallback: Function, rejecterCallback: Function) {
					rejecter = rejecterCallback;
				});
				var count: number = 0;
				p.catch(function(value: string) {
					count++;
					return value + 'bar';
				});
				p.catch(dfd.callback((value: string) => {
					count++;
					assert.equal(count, 2); //both 'then' have been executed
					assert.equal(value, 'foo'); //no chaining so the value is not modified by the previous return
				}));
				rejecter('foo');

			}
		}
	};
});
