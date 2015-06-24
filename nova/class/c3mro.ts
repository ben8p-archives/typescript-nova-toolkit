let counter: number = 0;

/**
 * C3 Method Resolution Order (see http: //www.python.org/download/releases/2.3/mro/)
 * @param	bases	an array of class (may contain subclasses)
 * @return			an array containing linearized classes
 */
export function linearize (bases: any[]): any[] {
	//Note: code partially from dojo toolkit
	let result : any[] = [];
	var	roots = [{
			classes: <number> 0,
			references: <any> []
		}],
		nameMap = <any> {},
		classCount = <number> 1,
		iteratorLength = <number> bases.length,
		i = <number> 0,
		j: number, linearizedBases: any, base: any, top: any, linearizedPrototype: any, record: any, name: any, references: any;

	// build a list of bases naming them if needed
	for (; i < iteratorLength; ++i) {
		base = bases[i];
		if (!base) {
			throw 'mixin #' + i + ' is unknown.';
		} else if (Object.prototype.toString.call(base) !== '[object Function]') {
			throw 'mixin #' + i + ' is not a callable constructor.';
		}
		linearizedBases = base.__meta__ ? base.__meta__.linearized.concat([base]) : [base];
		top = 0;
		// add bases to the name map
		for (j = linearizedBases.length - 1; j >= 0; --j) {
			linearizedPrototype = linearizedBases[j].prototype;
			//linearizedPrototype.classId = linearizedPrototype.classId || 'novaClass_' + (counter++);
			linearizedBases[j].classId = linearizedBases[j].classId || 'novaClass_' + (counter++);

			name = linearizedBases[j].classId;
			if (!nameMap.hasOwnProperty(name)) {
				nameMap[name] = {
					count: 0,
					references: [],
					classes: linearizedBases[j]
				};
				++classCount;
			}
			record = nameMap[name];
			if (top && top !== record) {
				record.references.push(top);
				++top.count;
			}
			top = record;
		}
		++top.count;
		roots[0].references.push(top);
	}

	// remove classes without external references recursively
	while (roots.length) {
		top = roots.pop();
		result.push(top.classes);
		--classCount;
		// optimization: follow a single-linked chain
		while (references = top.references, references.length === 1) {
			top = references[0];
			if (!top || --top.count) {
				// branch or end of chain => do not end to roots
				top = 0;
				break;
			}
			result.push(top.classes);
			--classCount;
		}
		if (top) {
			// branch
			for (i = 0, iteratorLength = references.length; i < iteratorLength; ++i) {
				top = references[i];
				if (!--top.count) {
					roots.push(top);
				}
			}
		}
	}
	if (classCount) {
		throw 'can\'t build consistent linearization';
	}

	// calculate the superclass offset
	base = bases[0];
	result[0] = base ?
		base.__meta__ && base === result[result.length - base.__meta__.linearized.length] ?
		base.__meta__.linearized.length : 1 : 0;

	return result;
}
