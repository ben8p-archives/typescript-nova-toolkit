export function assign (target:Object, ...sources:Object[]):Object {
	if (target === undefined || target === null) {
		throw 'Cannot convert first argument to object';
	}
	var to:any = Object(target);
	sources.forEach((source:any) => {
		if (source === undefined || source === null) {
			return;
		}
		var keys:any[] = Object.keys(Object(source));
		keys.forEach((key:string) => {
			var desc:PropertyDescriptor = Object.getOwnPropertyDescriptor(source, key);
			if (desc !== undefined && desc.enumerable) {
				to[key] = source[key];
			}
		});
	});

	return to;
}
