import Promise = require('./Promise');
import promiseInterface = require('../interface/Promise');

/**
 * reprensent a Promise container
 * it implements the Promise interface and add convenient method to know the state of the Promise
 **/
class Deferred {
	private promiseResolve:Function;
	private promiseReject:Function;

	private promise:any;
	private resolved:Boolean = false;
	private rejected:Boolean = false;
	constructor() {
		this.promise = new Promise((promiseResolve:Function, promiseReject:Function) => {
			this.promiseResolve = promiseResolve;
			this.promiseReject = promiseReject;
		});
	}
	isFulfilled(): Boolean {
		return this.resolved || this.rejected;
	}
	isResolved(): Boolean {
		return this.resolved;
	}
	isRejected(): Boolean {
		return this.rejected;
	}

	resolve(value?:any): void {
		this.promiseResolve(value);
		this.resolved = true;
	}
	reject(reason?:any): void {
		this.promiseReject(reason);
		this.rejected = true;
	}

	//interface for to native Promise
	then(successCallback:Function, failCallback?:Function): promiseInterface.Promise {
		return this.promise.then(successCallback, failCallback);
	}
	catch(failCallback:Function): promiseInterface.Promise {
		return this.promise.catch(failCallback);
	}

}
export = Deferred;
