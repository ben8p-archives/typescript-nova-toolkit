/**
 * Base class for every class using linearized inheritance
 * Provides this.super() method to call superclass
 */
class Base {
	/** execute all constructor form all mixins */
	constructor() {
		if ((<any> this.constructor)._running) { return; }
		(<any> this.constructor)._running = true;
		var bases = (<any> this.constructor).__meta__.linearized;
		if (bases) {
			let i: number;
			let baseLength: number = bases.length;
			//execute the constructors from bottom to top
			for (i = baseLength - 1; i >= 0; --i) {
				let objectConstructor: any = bases[i];
				if (objectConstructor instanceof Function) {
					objectConstructor.apply(this, arguments);
				}
			}
		}
		delete (<any> this.constructor)._running;
		this.postConstructor();
	}

	/** hook executed after all constructors */
	protected postConstructor() {}

	public isInstanceOf(object: any): boolean {
		var superclasses: any[] = (<any> this.constructor).__meta__.linearized;
		return superclasses.some((superclass: any) => {
			return superclass === object;
		});
	}

	/**
	 * call the superclass method
	 * @param	args	the arguments object received by the current method
	 */
	protected super(args: IArguments): any {
		let inheritedFunction: Function;
		let callee: any = <any> args.callee;

		let bases: Function[] = (<any> this.constructor).__meta__.linearized;

		let foundFromMixin: Boolean = false;
		let name: string = (<any> args.callee).functionName;

		bases.some(function(base: Function) {
			if (!base.prototype) { return false; }

			if (!inheritedFunction && base.prototype[name]) {
				inheritedFunction = base.prototype[name];
			}
			if (inheritedFunction && foundFromMixin) {
				return true;
			}
			if (base.prototype[name] === callee) {
				//pick the next one
				foundFromMixin = true;
				inheritedFunction = null;
			}
		});

		if (inheritedFunction instanceof Function) {
			return inheritedFunction.apply(this, args);
		}
	}
}
export = Base;
