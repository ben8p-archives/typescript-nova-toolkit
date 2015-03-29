/// <reference path="_base/c3mro.ts" />
/// <reference path="object.ts" />

import c3mro = require('./_base/c3mro');
import object = require('./object');

var defaultConstructor:any = new Function();
var forceNew = function (currentConstructor:Function):Function {
	//from dojo toolkit
	// create object with correct prototype using a do-nothing
	// constructor
	defaultConstructor.prototype = currentConstructor.prototype;
	var object:Function = new defaultConstructor();
	defaultConstructor.prototype = null;	// clean up
	return object;
}
var chainedConstructor = function (bases:Function[]):Function {
	return function() {
		var i:number;
		var baseLength:number = bases.length;
		//execute the construcotrs from bottom to top
		for(i = baseLength - 1; i >= 0; --i){
			var objectConstructor:any = bases[i];
			var meta:any = objectConstructor._meta;
			objectConstructor = meta ? meta.baseConstructor : objectConstructor;
			if(objectConstructor instanceof Function) {
				objectConstructor.apply(this, arguments);
			}
		}
	}
}
var computeMethodNames = function (target:any):void {
	var name:string;

	for(name in target) {
		var property:any = target[name];
		if(property instanceof Function) {
			property.functionName = name;
		}
	}

}

export class Base {

	inherited(args: IArguments): Function {
		var inheritedFunction:Function;
		var callee:any = <any>args.callee;
		if(callee.superclass) {
			inheritedFunction = callee.superclass;
		} else {
			var bases:Function[] = (<any>this.constructor)._meta.bases;

			var stopHere:Boolean = false;
			var name: string = (<any>args.callee).functionName;

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

export function declare <T extends Object>(base: T, superclasses:any[]): T {
	//inspired from dojo toolkit
	var bases:any[] = c3mro.linearize(superclasses);
	var i:number;
	var mixins:number = bases.length - bases[0];
	var superclass:any = bases[mixins];

	var finalConstructor:any;
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
