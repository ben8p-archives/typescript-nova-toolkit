import c3mro = require('./c3mro');

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

/** provide a custom extend method for class extends (ES6 Class) */
this.__extends = function(base: any, mixin: any) {
	extend(base, [mixin]);
};

/**
 * linearize and combine all class and subclass in order to create one extended Class
 * @param	base			The base class
 * @param	superclasses	an array of class mixins
 * @return					a class
 */
var extend = function  <T extends Object>(base: any, superclasses: any[]): void {
 	var superclassesList: any[] = [];
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
	function newSuperclass() { this.constructor = base; };
	while (--superclassesCount) {
		var superclass: any = linearizedSuperclasses[superclassesCount];
		if (superclass !== base) {
			superclassesList.push(superclass);
		}

		for (let name in superclass.prototype) {
			if (!newSuperclass.prototype[name]) {
				newSuperclass.prototype[name] = superclass.prototype[name];
			}
		};
		computeMethodNames(superclass.prototype);
	}

	computeMethodNames(newSuperclass.prototype);
	base.prototype = new (<any> newSuperclass)();

	base.prototype.constructor.__meta__ = base.prototype.constructor.__meta__ || {};
	base.prototype.constructor.__meta__.linearized = superclassesList.reverse();
	base.prototype.constructor.__meta__.superclasses = superclasses;

};

export = extend;
