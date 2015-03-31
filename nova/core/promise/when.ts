import Promise = require('./Promise');
import Deferred = require('./Deferred');
import promiseInterface = require('../interface/Promise');

/**
 * Convenient helper to always have a promise
 * if the parameter is not a promise, then an already resolved Promise will be created
 *
 * @param	value	anything
 * @return			a promise (resolved or not)
 **/
export = function (value?:any): promiseInterface.Promise {
	if(value instanceof Deferred || value instanceof Promise) {
		return value;
	}
	let promiseResolve:Function;
	let promise:promiseInterface.Promise = new Promise((resolve:Function) => {
		promiseResolve = resolve;
	});

	promiseResolve(value);
	return promise;

}
