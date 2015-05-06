import Stateful = require('./Stateful');

/**
 * Base class for every class using linearized inheritance
 * Provides this.super() method to call superclass
 */
export interface Interface {
	super?(args: IArguments): Function;
}
export class Class extends Stateful.Class {
	/**
	 * call the superclass method
	 * @param	args	the arguments object received by the current method
	 */
	super(args: IArguments): Function {
		let inheritedFunction: Function;
		let callee: any = <any> args.callee;
		if (callee.superclass) {
			inheritedFunction = callee.superclass;
		} else {
			let bases: Function[] = (<any> this.constructor)._meta.bases;

			let stopHere: Boolean = false;
			let name: string = (<any> args.callee).functionName;

			bases.some(function(base: Function) {
				if (!base.prototype) { return false; }

				if (!inheritedFunction && base.prototype[name]) {
					inheritedFunction = base.prototype[name];
				}
				if (inheritedFunction && stopHere) {
					return true;
				}
				if (base.prototype[name] === callee) {
					//pick the next one
					stopHere = true;
					inheritedFunction = null;
				}
			});
		}
		if (inheritedFunction instanceof Function) {
			callee.superclass = inheritedFunction; //save for cache
			return inheritedFunction.apply(this, args);
		}
	}
}
