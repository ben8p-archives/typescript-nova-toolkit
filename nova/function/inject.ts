import DisplosableInterface = require('../class/Disposable.d');
interface Runner extends Function {
	(): any;
	before: Function[],
	after: Function[],
	original: Function
};

/** inject a method before or after another one */
function inject(method: Function, injectBefore: boolean, inContext: any, inPlaceOf: string): Runner {
	/**
	 * this method will run all before and after as well as the original
	 * before and after methods can mutate the arguments received by next methods in the queue
	 * if a before (or after) method return a value, this value will be considered as arguments for the next ones.
	 * the returned value is the results of the original method execution
	 */
	var runner = <Runner> function(): any {
		let before: Function[] = (<any> runner).before || [];
		let after: Function[] = (<any> runner).after || [];
		var args = arguments;

		// before method can mutate arguments,
		// if they return a value, this value will be used as new arguments for the next methods (including the original and the after)
		before.forEach((beforeMethod) => {
			if (typeof beforeMethod !== 'function') { return; }
			args = beforeMethod.apply(this, args) || args;
		});
		var results = (<any> runner).original.apply(this, args);
		after.forEach((afterMethod) => {
			if (typeof afterMethod !== 'function') { return; }
			args = afterMethod.apply(this, args) || args;
		});

		return results;
	};
	if (inContext[inPlaceOf].toString() !== runner.toString()) {
		runner.original = inContext[inPlaceOf];
		runner.before = [];
		runner.after = [];
		inContext[inPlaceOf] = runner;
	}

	if (injectBefore) {
		inContext[inPlaceOf].before.unshift(method);
	} else {
		inContext[inPlaceOf].after.push(method);
	}
	return inContext[inPlaceOf];
}

/** inject a method before another one */
export function before(method: Function, inContext: any, before: string): DisplosableInterface.RemoveableObject {
	var runner = inject(method, true, inContext, before);
	return <DisplosableInterface.RemoveableObject> {
		remove: function() {
			runner.before.some((beforeMethod, index) => {
				if (beforeMethod === method) {
					delete runner.before[index];
					return true;
				}
				return false;
			});
		}
	};
};

/** inject a method after another one */
export function after(method: Function, inContext: any, after: string): DisplosableInterface.RemoveableObject {
	var runner = inject(method, false, inContext, after);
	return <DisplosableInterface.RemoveableObject> {
		remove: function() {
			runner.after.some((afterMethod, index) => {
				if (afterMethod === method) {
					delete runner.after[index];
					return true;
				}
				return false;
			});
		}
	};
};
