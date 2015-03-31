/**
 * interface for Promise
 **/
export interface Promise {
	then(successCallback:Function, failCallback?:Function): Promise;
	catch(failCallback:Function): Promise;
}
