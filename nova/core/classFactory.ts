import c3mro = require('./_base/c3mro');
import object = require('./object');

let defaultConstructor:any = new Function();
let forceNew = function (currentConstructor:Function):Function {
	//from dojo toolkit
	// create object with correct prototype using a do-nothing
	// constructor
	defaultConstructor.prototype = currentConstructor.prototype;
	let object:Function = new defaultConstructor();
	defaultConstructor.prototype = null;	// clean up
	return object;
}
let chainedConstructor = function (bases:Function[]):Function {
	return function() {
		let i:number;
		let baseLength:number = bases.length;
		//execute the construcotrs from bottom to top
		for(i = baseLength - 1; i >= 0; --i){
			let objectConstructor:any = bases[i];
			let meta:any = objectConstructor._meta;
			objectConstructor = meta ? meta.baseConstructor : objectConstructor;
			if(objectConstructor instanceof Function) {
				objectConstructor.apply(this, arguments);
			}
		}
	}
}
let computeMethodNames = function (target:any):void {
	let name:string;

	for(name in target) {
		let property:any = target[name];
		if(property instanceof Function) {
			property.functionName = name;
		}
	}

}
/**
 * Base class for every class using linearized inheritance
 * Provides the this.super() method to call superclass method
 */
export class Base {

	super(args: IArguments): Function {
		let inheritedFunction:Function;
		let callee:any = <any>args.callee;
		if(callee.superclass) {
			inheritedFunction = callee.superclass;
		} else {
			let bases:Function[] = (<any>this.constructor)._meta.bases;

			let stopHere:Boolean = false;
			let name: string = (<any>args.callee).functionName;

			bases.some(function(base:Function) {
				if(!base.prototype) { return false; }

				if(!inheritedFunction && base.prototype[name]) {
					inheritedFunction = base.prototype[name];
				}
				if(inheritedFunction && stopHere) {
					return true;
				}
				if(base.prototype[name] === callee) {
					//pick the next one
					stopHere = true;
					inheritedFunction = null;
				}
			});
		}
		if(inheritedFunction instanceof Function) {
			callee.superclass = inheritedFunction; //save for cache
			return inheritedFunction.apply(this, args);
		}
	}
}
/**
 * linearize and combine all class and subclass in order to create one Class
 *
 * @param	base			The base class
* @param	superclasses	an array of class mixins
 * @return					a class
 */
export function declare <T extends Object>(base: T, superclasses:any[]): T {
	//inspired from dojo toolkit
	let bases:any[] = c3mro.linearize(superclasses);
	let i:number;
	let mixins:number = bases.length - bases[0];
	let superclass:any = bases[mixins];

	let finalConstructor:any;
	for(i = mixins - 1;; --i){
		var prototypeConstructor = forceNew(superclass);
		if(!i){
			// stop if nothing to add (the last base)
			break;
		}
		// mix in properties
		object.assign(prototypeConstructor, bases[i].prototype);
		computeMethodNames(prototypeConstructor);
		// chain in new constructor
		finalConstructor = new Function();
		finalConstructor.superclass = superclass;
		finalConstructor.prototype = prototypeConstructor;
		superclass = prototypeConstructor.constructor = finalConstructor;
	}

	// mix in base properties
	object.assign(prototypeConstructor, (<any> base).prototype);
	computeMethodNames(prototypeConstructor);
	prototypeConstructor.constructor = base.constructor;
	bases[0] = finalConstructor = chainedConstructor([<any> base].concat(bases));

	// add meta information to the constructor
	finalConstructor._meta  = {bases: bases, superclasses: superclasses, baseConstructor: base.constructor};
	finalConstructor.superclass = superclass && superclass.prototype;
	finalConstructor.prototype = prototypeConstructor;
	prototypeConstructor.constructor = finalConstructor;

	return <T> finalConstructor;
}
