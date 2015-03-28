// C3 Method Resolution Order (see http://www.python.org/download/releases/2.3/mro/)
// code from dojo toolkit


var counter: number = 0;

export function linearize (bases: any[]): any[] {
	var result : any[] = [];
	var	roots = [{
			cls: 0,
			refs: []
		}],
		nameMap = {},
		clsCount = 1,
		l = bases.length,
		i = 0,
		j, lin, base, top, proto, rec, name, refs;

	// build a list of bases naming them if needed
	for (; i < l; ++i) {
		base = bases[i];
		if (!base) {
			throw "mixin #" + i + " is unknown.";
		} else if (Object.prototype.toString.call(base) != "[object Function]") {
			throw "mixin #" + i + " is not a callable constructor.";
		}
		lin = base._meta ? base._meta.bases : [base];
		top = 0;
		// add bases to the name map
		for (j = lin.length - 1; j >= 0; --j) {
			proto = lin[j].prototype;
			if (!proto.hasOwnProperty("declaredClass")) {
				proto.declaredClass = "uniqName_" + (counter++);
			}
			name = proto.declaredClass;
			if (!nameMap.hasOwnProperty(name)) {
				nameMap[name] = {
					count: 0,
					refs: [],
					cls: lin[j]
				};
				++clsCount;
			}
			rec = nameMap[name];
			if (top && top !== rec) {
				rec.refs.push(top);
				++top.count;
			}
			top = rec;
		}
		++top.count;
		roots[0].refs.push(top);
	}

	// remove classes without external references recursively
	while (roots.length) {
		top = roots.pop();
		result.push(top.cls);
		--clsCount;
		// optimization: follow a single-linked chain
		while (refs = top.refs, refs.length == 1) {
			top = refs[0];
			if (!top || --top.count) {
				// branch or end of chain => do not end to roots
				top = 0;
				break;
			}
			result.push(top.cls);
			--clsCount;
		}
		if (top) {
			// branch
			for (i = 0, l = refs.length; i < l; ++i) {
				top = refs[i];
				if (!--top.count) {
					roots.push(top);
				}
			}
		}
	}
	if (clsCount) {
		throw "can't build consistent linearization";
	}

	// calculate the superclass offset
	base = bases[0];
	result[0] = base ?
		base._meta && base === result[result.length - base._meta.bases.length] ?
		base._meta.bases.length : 1 : 0;

	return result;
}
