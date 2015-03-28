/// <reference path="_base/c3mro.ts" />
/// <reference path="object.ts" />

import c3mro = require('./_base/c3mro');
import object = require('./object');

var defaultConstructor:any = new Function();
var forceNew = function (ctor:Function):Function {
	//from dojo toolkit
	// create object with correct prototype using a do-nothing
	// constructor
	defaultConstructor.prototype = ctor.prototype;
	var t:Function = new defaultConstructor;
	defaultConstructor.prototype = null;	// clean up
	return t;
}
var chainedConstructor = function (bases:Function[]):Function {
	return function() {
		var i:number;
		var l:number = bases.length;
		for(i = l - 1; i >= 0; --i){
			var f:any = bases[i];
			var m:any = f._meta;
			f = m ? m.ctor : f;
			if(f instanceof Function) {
				f.apply(this, arguments);
			}
		}
	}
}

export class Base {

	inherited(args: IArguments): any {
		var fnc:Function;
		var callee:any = <any>args.callee;
		if(callee.superclass) {
			fnc = callee.superclass;
		} else {
			var bases:Function[] = (<any>this.constructor)._meta.bases;

			var stopHere:Boolean = false;
			var name: string = (<any>args.callee).functionName;

			bases.some(function(base:Function) {
				if(!base.prototype) { return false; }

				if(!fnc && base.prototype[name]) {
					fnc = base.prototype[name];
				}
				if(fnc && stopHere) {
					return true;
				}
				if(base.prototype[name] === callee) {
					//pick the next one
					stopHere = true;
					fnc = null;
				}
			});
		}
		if(fnc instanceof Function) {
			callee.superclass = fnc;
			return fnc.apply(this, args);
		}
	}
}

export function declare <T extends Object>(base: T, superclasses:any[]): T {
	//inspired from dojo toolkit
	var bases:any[] = c3mro.linearize(superclasses);
	var i:number;
	var mixins:number = bases.length - bases[0];
	var superclass:any = bases[mixins];

	var ctor:any;
	for(i = mixins - 1;; --i){
		var proto = forceNew(superclass);
		if(!i){
			// stop if nothing to add (the last base)
			break;
		}
		// mix in properties
		object.mixin(proto, bases[i].prototype);
		// chain in new constructor
		ctor = new Function();
		ctor.superclass = superclass;
		ctor.prototype = proto;
		superclass = proto.constructor = ctor;
	}

	// mix in properties
	object.mixin(proto, (<any> base).prototype);
	proto.constructor = base.constructor;
	bases[0] = ctor = chainedConstructor([<any> base].concat(bases));

	// add meta information to the constructor
	ctor._meta  = {bases: bases, parents: superclasses, ctor: base.constructor};
	ctor.superclass = superclass && superclass.prototype;
	ctor.prototype = proto;
	proto.constructor = ctor;

	return <T> ctor;
}
