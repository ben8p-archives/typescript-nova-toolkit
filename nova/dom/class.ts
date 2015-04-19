/**
 * helper for update dom nodes classes
 */
const SPACES = /\s+/g;
var cache: {[index: string]: RegExp} = {};

function getFromCache(className: string): RegExp {
	cache[className] = cache[className] || new RegExp('\\b' + className + '\\b', 'g');
	return cache[className];
}

function getClassNames(classNames: string[]|string): string[] {
	//convert string to array
	if (!(classNames instanceof Array)) {
		classNames = (<string> classNames).split(' ');
	}
	return <string[]> classNames;
}

/**
 * add one or more class to a domNode
 */
export function add(element: HTMLElement, classNames: string[]|string): HTMLElement {
	classNames = getClassNames(classNames);
	element.className += ' ' + (<string[]> classNames).join(' ');
	return element;
};

/**
 * remove one or more class of a domNode
 */
export function remove(element: HTMLElement, classNames: string[]|string): HTMLElement {
	classNames = getClassNames(classNames);
	var newValue = element.className;
	(<string[]> classNames).forEach((className: string) => {
		newValue = newValue.replace(getFromCache(className), '');
	});

	//cleanup remaining spaces
	element.className = newValue.replace(SPACES, ' ');
	return element;
};

/**
 * add or remove one or more class of a domNode, depending on a boolean value
 */
export function toggle(element: HTMLElement, classNames: string[]|string, condition: boolean): HTMLElement {
	classNames = getClassNames(classNames);
	if (condition) {
		return add(element, classNames);
	}
	return remove(element, classNames);
};

/**
 * return true if a classname is present
 */
export function has(element: HTMLElement, className: string): boolean {
	return !!element.className.match(getFromCache(className));
};
