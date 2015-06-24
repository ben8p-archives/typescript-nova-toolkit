/**
 * implemation of es6 Object.assign
 * see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 * @param	target	the object which will receive new attributes
 * @param	sources	sources which will be combined into target
 * @return			target (modified by reference)
 */
export function assign(target: Object, ...sources: Object[]): Object {
	if (target === undefined || target === null) {
		throw 'Cannot convert first argument to object';
	}
	let to: any = Object(target);
	sources.forEach((source: any) => {
		if (source === undefined || source === null) {
			return;
		}
		let keys: any[] = Object.keys(Object(source));
		keys.forEach((key: string) => {
			let desc: PropertyDescriptor = Object.getOwnPropertyDescriptor(source, key);
			if (desc !== undefined && desc.enumerable) {
				to[key] = source[key];
			}
		});
	});

	return to;
}

/** internal implememtation for "every" and "some" */
function everyOrSome(some: boolean, object: {[index: string]: any}, callback: (value: any, key: string|number, object: {[index: string]: any}) => any, thisArg?: any): boolean {
	var result: any;
	for (let key in object) {
		if (object.hasOwnProperty(key)) {
			if (thisArg) {
				result = !callback.call(thisArg, object[key], key, object);
			} else {
				result = !callback(object[key], key, object);
			}
			if ((some ? 1 : 0) ^ result) { //this is an bitwise XOR
				return !result;
			}
		}
	}
	return !some; //!some == every
}

/**
 * clone of Array.forEach but for Objects
 * see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
 */
export function forEach(object: {[index: string]: any}, callback: (value: any, key: string|number, object: {[index: string]: any}) => void, thisArg?: any): void {
	if (object) {
		for (let key in object) {
			if (object.hasOwnProperty(key)) {
				let value = object[key];
				if (thisArg) {
					callback.call(thisArg, value, key, object);
				} else {
					callback(value, key, object);
				}
			}
		}
	}
}
/**
 * clone of Array.map but for Objects
 * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
 */
export function map(object: {[index: string]: any}, callback: (value: any, key: string|number, object: {[index: string]: any}) => any, thisArg?: any): {[index: string]: any} {
	var key: string;
	var out: {[index: string]: any} = {};
	for (key in object) {
		if (object.hasOwnProperty(key)) {
			if (thisArg) {
				out[key] = callback.call(thisArg, object[key], key, object);
			} else {
				out[key] = callback(object[key], key, object);
			}
		}
	}
	return out;
}
/**
 * clone of Array.some but for Objects
 * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
 */
export function some(object: {[index: string]: any}, callback: (value: any, key: string|number, object: {[index: string]: any}) => any, thisArg?: any): boolean {
	return everyOrSome(true, object, callback, thisArg);
}

/**
 * clone of Array.every but for Objects
 * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every
 */
export function every(object: {[index: string]: any}, callback: (value: any, key: string|number, object: {[index: string]: any}) => any, thisArg?: any): boolean {
	return everyOrSome(false, object, callback, thisArg);
}

/**
 * clone of Array.filter but for Objects
 * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
 */
export function filter(object: {[index: string]: any}, callback: (value: any, key: string|number, object: {[index: string]: any}) => any, thisArg?: any): {[index: string]: any} {
	var out: {[index: string]: any} = {};

	for (let key in object) {
		if (object.hasOwnProperty(key)) {
			let value = object[key];
			var result: any;
			if (thisArg) {
				result = callback.call(thisArg, value, key, object);
			} else {
				result = callback(value, key, object);
			}
			if (result) {
				out[key] = value;
			}
		}
	}
	return out;
}
