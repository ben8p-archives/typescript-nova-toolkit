import c3mro = require('./c3mro');

declare var global: any;

/** provide a custom extend method for class (ES6 Class). See how typescript implement Class inheritance */
this.__extends = function(base: any, mixin: any) {
	extend(base, [mixin]);
};
//give it to window AND NodeJs
try { global.__extends = this.__extends; } catch (e) {}
try { (<any> window).__extends = this.__extends; } catch (e) {}

/**
 * linearize and combine all class and subclass in order to create one extended Class
 * @param	base			The base class
 * @param	superclasses	an array of class mixins
 * @return					a class
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
			if (!newSuperclass.prototype[name]) {
				newSuperclass.prototype[name] = superclass.prototype[name];
			}
		}
		//computeMethodNames(superclass.prototype);
	}

	//computeMethodNames(newSuperclass.prototype);
	base.prototype = new (<any> newSuperclass)();

	base.prototype.constructor.__meta__ = base.prototype.constructor.__meta__ || {};
	base.prototype.constructor.__meta__.linearized = superclassesList.reverse();
	base.prototype.constructor.__meta__.superclasses = superclasses;

};

export = extend;
