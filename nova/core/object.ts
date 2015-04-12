/**
 * implemation of es6 Object.assign
 *
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
