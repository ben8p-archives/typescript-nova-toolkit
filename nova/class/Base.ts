/// <amd-dependency path="./extends" />

/**
 * iterate over the passed argument and determine if a property is a function.
 * if yes, it add the name of the property to the 'functionName' property of the function
 * so we can later on know what is the name of some anonymous function
 * @param	target	anything inheriting from ObjectConstructor
 */
let computeMethodNames = function (target: any): void {
	let name: string;

	for (name in target) {
		let property: any = target[name];
		if (property instanceof Function) {
			property.functionName = name;
		}
	}

};

/**
 * Base class for every class using linearized inheritance
 * It roles is to be the ground for multiple inheritance (specially for accessing superscallas)
 */
class Base {
	/** Set to true when all constructor have run */
	protected constructed = false;
	/**
	 * execute all constructor form all mixins
	 * Note: constructors might be executed twice because of _super call added by TypeScript during transpilation
	 */
	constructor() {
		if ((<any> this.constructor)._running) { return; }
		(<any> this.constructor)._running = true;
		var bases = (<any> this.constructor).__meta__.linearized.reverse();
		if (bases) {
			let i: number;
			let baseLength: number = bases.length;
			//execute the constructors from bottom to top
			for (i = baseLength - 1; i >= 0; --i) {
				let objectConstructor: any = bases[i];
				if (objectConstructor instanceof Function) {
					objectConstructor.apply(this, arguments);
					computeMethodNames(objectConstructor.prototype);
				}
			}
			computeMethodNames(this.constructor.prototype);
			this.constructor.apply(this, arguments); //rerun itself otherwise postConstructor runs too early
		}
		delete (<any> this.constructor)._running;
		this.postConstructor();
	}

	/** hook executed when all constructors have ran */
	protected postConstructor() {
		this.constructed = true;
	}

	/**
	 * determine if a given object inhetis from this class or not
	 * @param	object	anything inheriting from ObjectConstructor
	 * @return			true if the given arguments inherits from this class
	 */
	isInstanceOf(object: any): boolean {
		if (object === this.constructor) {
			return true;
		}
		var superclasses: any[] = (<any> this.constructor).__meta__.linearized;
		return superclasses.some((superclass: any) => {
			return superclass === object;
		});
	}

	/**
	 * try to guess the superclass method and execute it (if found)
	 * Note: this use arguments.callee thus it does not work in strict mode
	 * @param	args	the arguments object received by the current method
	 * @return			anything returned by the superclass method
	 */
	protected super(args: IArguments): any {
		let inheritedFunction: Function;
		//FIXME: find a way to not use callee
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
