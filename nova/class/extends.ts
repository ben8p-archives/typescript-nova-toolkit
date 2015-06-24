import c3mro = require('./c3mro');
import has = require('../core/has');

/** Override typescript __extends method with a custom one supporting multiple inheritance and ES6 Class. */
this.__extends = function(base: any, mixin: any) {
	extend(base, [mixin]);
};
if (has('node-host')) {
	//export the custom __extends in global scope
	(<any> this.global).__extends = this.__extends;
} else if (has('browser-host')) {
	//export the custom __extends in window scope
	(<any> window).__extends = this.__extends;
}

/**
 * linearize (using c3mro) and combine all class and subclass in order to create one extended Class
 * @param	base			The base class. Will be modified and receive all subclasses
 * @param	superclasses	an array of class mixins
 */
var extend = function  <T extends Object>(base: any, superclasses: any[]): void {
 	var superclassesList: any[] = [];
	superclasses = superclasses.reverse();
	if (base.prototype.constructor.__meta__) {
		let meta = base.prototype.constructor.__meta__;
		for (let name in base.prototype) {
			if (!base.prototype.hasOwnProperty(name)) {
				delete base.prototype[name];
			}
		}
		delete base.prototype.constructor.__meta__;

		superclasses = superclasses.concat(meta.superclasses);
	}
	let linearizedSuperclasses: any[] = c3mro.linearize([base].concat(superclasses));

	var superclassesCount = linearizedSuperclasses.length;

	//chain all mixins
	function newSuperclass() { this.constructor = base; }
	while (--superclassesCount) {
		var superclass: any = linearizedSuperclasses[superclassesCount];
		if (superclass !== base) {
			superclassesList.push(superclass);
		}

		for (let name in superclass.prototype) {
			if (!newSuperclass.prototype[name] && superclass.prototype.hasOwnProperty(name)) {
				newSuperclass.prototype[name] = superclass.prototype[name];
			}
		}
	}

	base.prototype = new (<any> newSuperclass)();

	base.prototype.constructor.__meta__ = base.prototype.constructor.__meta__ || {};
	base.prototype.constructor.__meta__.linearized = superclassesList.reverse();
	base.prototype.constructor.__meta__.superclasses = superclasses;

};

export = extend;
