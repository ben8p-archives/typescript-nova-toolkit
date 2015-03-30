class PromisePolyfill {
	private fail:any[] = [];
	private success:any[] = [];
	private resolved:boolean = false;
	private rejected:boolean = false;
	private rejectedReason:any;
	private resolvedValue:any;
	private isFulfilling:boolean = false; //prevent a then() to restart a pending resolve

	constructor(resolver:Function) {
		resolver(this.resolve.bind(this), this.reject.bind(this));
	}
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
let Promise:any = (<any>window).Promise || PromisePolyfill;

/**
 * Convenient helper to always have a promise
 * if the parameter is not a promise, then an already resolved Promise will be created
 *
 * @param	value	anything
 * @return			a promise (resolved or not)
 */
export function when(value?:any): PromisePolyfill {
	if(value instanceof Deferred || value instanceof Promise) {
		return value;
	}
	let promiseResolve:Function;
	let promise:PromisePolyfill = new Promise((resolve:Function) => {
		promiseResolve = resolve;
	});

	promiseResolve(value);
	return promise;

}

/**
 * reprensent a Promise container
 * it implements the the method and add convenient method to know the state of the Promise
 */
export class Deferred {
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
	then(successCallback:Function, failCallback?:Function): PromisePolyfill {
		return this.promise.then(successCallback, failCallback);
	}
	catch(failCallback:Function): PromisePolyfill {
		return this.promise.catch(failCallback);
	}

}
