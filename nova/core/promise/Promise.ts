/** A Promise as defined in Ecma standards **/
class PromisePolyfill {
	private fail:any[] = [];
	private success:any[] = [];
	private resolved:boolean = false;
	private rejected:boolean = false;
	private rejectedReason:any;
	private resolvedValue:any;
	private isFulfilling:boolean = false; //prevent a then() to restart a pending resolve

	/**
	 * create the promise and bind the resolver and rejecter
	 * @param	resolver	a function which will be called with the resolver and the rejecter as argumnets
	 * @constructor
	 */
	constructor(resolver:Function) {
		resolver(this.resolve.bind(this), this.reject.bind(this));
	}
	/**
	 * return a Promise which will be resolved when All values are resolved
	 *
	 * @param	values	anything
	 * @return			a promise (resolved or not)
	 **/
	static all(values:any[]): PromisePolyfill {
		var totalValues = values.length;
		var resolvedValueCount = 0;
		var resolvedValues:any[] = [];
		var reject:Function;
		var resolve:Function;
		var allPromise = new PromisePolyfill(function(allResolve:Function, allReject:Function) {
			reject = allReject;
			resolve = allResolve;
		});

		values.forEach((value, index) => {
			var promise:PromisePolyfill = PromisePolyfill.resolve(value);
			var then = (value:any) => {
				resolvedValueCount++;
				resolvedValues[index] = value;
				if(resolvedValueCount === totalValues) {
					resolve(resolvedValues);
				}
			}
			promise.then(then, (value:any) => {
				reject(value);
			});
		});
		return allPromise;
	}
	/**
	 * Return a Promise which will be resolved when one of the values is resolved
	 *
	 * @param	values	anything
	 * @return			a promise (resolved or not)
	 **/
	static race(values:any[]): PromisePolyfill {
		var reject:Function;
		var resolve:Function;
		var racePromise = new PromisePolyfill(function(allResolve:Function, allReject:Function) {
			reject = allReject;
			resolve = allResolve;
		});

		values.forEach((value, index) => {
			var promise:PromisePolyfill = PromisePolyfill.resolve(value);
			promise.then((value:any) => {
				resolve(value);
			}, (value:any) => {
				reject(value);
			});
		});
		return racePromise;
	}
	/**
	 * Instant resolved promise if @value is not a Promise itself
	 * Otherwise resolved when @value is resolved
	 *
	 * @param	value	anything
	 * @return			a promise (resolved or not)
	 **/
	static resolve(value?:any): PromisePolyfill {
		if(value && typeof value.then === 'function') {
			return value;
		}
		let promiseResolve:Function;
		let promise:PromisePolyfill = new PromisePolyfill((resolve:Function) => {
			promiseResolve = resolve;
		});

		promiseResolve(value);
		return promise;
	}
	/**
	 * Instant rejected promise if @value is not a Promise itself
	 * Otherwise rejected when @value is rejected
	 *
	 * @param	value	anything
	 * @return			a promise (rejected or not)
	 **/
	static reject (value?:any): PromisePolyfill {
		if(value && typeof value.then === 'function') {
			return value;
		}
		let promiseReject:Function;
		let promise:PromisePolyfill = new PromisePolyfill((dummy:Function, reject:Function) => {
			promiseReject = reject;
		});

		promiseReject(value);
		return promise;
	}
	/**
	 * reject the promise with @reason
	 * @param	reason	anything
	 */
	private reject(reason?:any) {
		//native reject a always async, setTimeout emulate that
		if(this.rejected || this.resolved) { return; }
		this.rejected = true;
		this.rejectedReason = reason;
		this.isFulfilling = true;
		setTimeout(() => {
			if(this.fail.length === 0) {
				throw "uncaught (in promise)"; //a rejected promise must implement a catch function
			}
			this.fail.forEach((next:any) => {
				next.callback(reason);
			});
			this.isFulfilling = false;
		}, 0);
	}
	/**
	 * resolve the promise with @value
	 * @param	value	anything
	 */
	private resolve(value?:any) {
		//native resolve a always async, setTimeout emulate that
		if(this.rejected || this.resolved) { return; }
		this.resolved = true;
		this.resolvedValue = value;
		this.isFulfilling = true;
		setTimeout(() => {
			this.success.forEach((next:any) => {
				let returnedValue = next.callback(value);
				if(next.promise) {
					next.promise.resolve(returnedValue);
				}
			});
			this.isFulfilling = false;
		}, 0);
	}
	/**
	 * Add a callback for when the promise will be resolve or rejected
	 * @param	successCallback	callback executed when the promise is resolved
	 * @param	failCallback	callback executed when the promise is rejected
	 * @return	a promise
	 */
	then(successCallback:Function, failCallback?:Function): PromisePolyfill {
		let promise = new PromisePolyfill(function() {});

		this.success.push({
			callback: successCallback,
			promise: promise
		});
		if(failCallback) {
			this.fail.push({
				callback: failCallback
				//no need to save the promise because we don't chain rejection
			});
		}

		if(!this.isFulfilling && this.resolved) {
			successCallback(this.resolvedValue);
		} else if (!this.isFulfilling && this.rejected) {
			failCallback(this.rejectedReason);
		}

		return promise;
	}
	/**
	 * Add a callback for when the promise will be rejected
	 * @param	failCallback	callback executed when the promise is rejected
	 * @return	a promise
	 */
	catch(failCallback:Function): PromisePolyfill {
		let promise = new PromisePolyfill(function() {});

		if(failCallback) {
			this.fail.push({
				callback: failCallback
				//no need to save the promise because we don't chain rejection
			});
		}
		if (!this.isFulfilling && this.rejected) {
			failCallback(this.rejectedReason);
		}

		return promise;
	}
}


let PromiseClass = PromisePolyfill;

// if((<any>window).Promise) {
// 	PromiseClass = (<any>window).Promise;
// }

export = PromiseClass;
