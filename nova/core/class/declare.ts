import c3mro = require('./c3mro');
import object = require('../object');

/** Quick access to native Function constructor */
let defaultConstructor:any = new Function();

/**
 * create object with correct prototype using a do-nothing constructor
 * @param	currentConstructor	a Function constructor
 * @return	a function constructor
 */
let forceNew = function (currentConstructor:Function):Function {
	//copy from dojotoolkit
	defaultConstructor.prototype = currentConstructor.prototype;
	let object:Function = new defaultConstructor();
	defaultConstructor.prototype = null;	// clean up
	return object;
}
/**
 * Generate a constructor which will call all constructor of passed arguments in cascade.
 * @param	bases	an array of function constructor to chain
 * @return	a function constructor
 */
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
/**
 * iterate over the passed argument and determine if a property is a function.
 * if yes, it add the name of the property to the 'functionName' property of the function
 * so we can later on know what is the name of some anonymous function
 * @param	target	anything inheriting from ObjectConstructor
 */
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
 * linearize and combine all class and subclass in order to create one extended Class
 *
 * @param	base			The base class
 * @param	superclasses	an array of class mixins
 * @return					a class
 */
var declareClass = function  <T extends Object>(base: T, superclasses:any[]): T {
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
export = declareClass;
