import promiseInterface = require('../interface/Promise');

/**
 * A Promise as defined in Ecma standards
 **/
class PromisePolyfill implements promiseInterface.Promise {
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
	then(successCallback:Function, failCallback?:Function): promiseInterface.Promise {
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
	catch(failCallback:Function): promiseInterface.Promise {
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
let PromiseClass:any = (<any>window).Promise || PromisePolyfill;
export = PromiseClass;
