/** internal regexp to match spaces */
const SPACES = /\s+/g;
/** internal cache for classname regexp */
var cache: {[index: string]: RegExp} = {};
/**
 * get the regexp matchin a classname
 * @param	className	the class to convert into a regexp
 * @return				a regexp matchin the classname
 */
function getFromCache(className: string): RegExp {
	cache[className] = cache[className] || new RegExp('\\b' + className + '\\b', 'g');
	return cache[className];
}
/**
 * split a list of classnames
 * @param	className	list of classnames within a string
 * @return				an array of string where each index is a classname
 */
function getClassNames(classNames: string[]|string): string[] {
	//convert string to array
	if (!((<any> classNames) instanceof Array)) {
		classNames = (<string> classNames).split(' ');
	}
	return <string[]> classNames;
}

/**
 * add one or more class to a domNode
 * @param	element		the node to update
 * @param	classNames	list of classnames to add
 * @return				the updated node
 */
export function add(element: HTMLElement, classNames: string[]|string): HTMLElement {
	classNames = getClassNames(classNames);
	element.className += ' ' + (<string[]> classNames).join(' ');
	return element;
};

/**
 * remove one or more class of a domNode
 * @param	element		the node to update
 * @param	classNames	list of classnames to remove
 * @return				the updated node
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
 * @param	element		the node to update
 * @param	classNames	list of classnames to add
 * @param	condition	true to add, false to remove
 * @return				the updated node
 */
export function toggle(element: HTMLElement, classNames: string[]|string, condition: boolean): HTMLElement {
	classNames = getClassNames(classNames);
	if (condition) {
		return add(element, classNames);
	}
	return remove(element, classNames);
};

/**
 * check if a node has a certain class 
 * @param	element		the node to update
 * @param	classNames	list of classnames to remove
 * @return				true if a classname is present
 */
export function has(element: HTMLElement, className: string): boolean {
	return !!element.className.match(getFromCache(className));
};
