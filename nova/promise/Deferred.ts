import Promise = require('./Promise');

/** internal interface used for defining objects returned by a Deferred */
interface PromiseInterface {
	then(successCallback: Function, failCallback?: Function): PromiseInterface;
	catch(failCallback: Function): PromiseInterface;
}

/**
 * reprensent a Promise container
 * it implements the Promise interface and add convenient method to read the state of the Promise
 */
class Deferred {
	private promiseResolve: Function;
	private promiseReject: Function;

	private promise: any;
	private resolved: Boolean = false;
	private rejected: Boolean = false;
	/**
	 * create a promise and connect the resolver/rejecter
	 */
	constructor() {
		this.promise = new Promise((promiseResolve: Function, promiseReject: Function) => {
			this.promiseResolve = promiseResolve;
			this.promiseReject = promiseReject;
		});
	}
	/**
	 * check if a promise is resolved or rejected
	 * @return	true if the promise is already resolved or rejected
	 */
	isFulfilled(): Boolean {
		return this.resolved || this.rejected;
	}
	/**
	 * check if a promise is resolved
	 * @return	true if the promise is already resolved
	 */
	isResolved(): Boolean {
		return this.resolved;
	}
	/**
	 * check if a promise is rejected
	 * @return	true if the promise is already rejected
	 */
	isRejected(): Boolean {
		return this.rejected;
	}
	/**
	 * resolve the promise
	 * @param	value	anything to pass to the promise when resolving it
	 */
	resolve(value?: any): void {
		this.promiseResolve(value);
		this.resolved = true;
	}
	/**
	 * reject the promise
	 * @param	reason	anything to pass to the promise when rejecting it
	 */
	reject(reason?: any): void {
		this.promiseReject(reason);
		this.rejected = true;
	}

	/** map to the promise.then method */
	then(successCallback: Function, failCallback?: Function): PromiseInterface {
		return this.promise.then(successCallback, failCallback);
	}
	/** map to the promise.catch method */
	catch(failCallback: Function): PromiseInterface {
		return this.promise.catch(failCallback);
	}

}
export = Deferred;
