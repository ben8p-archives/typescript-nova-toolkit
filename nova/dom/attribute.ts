/**
 * helper for updating dom nodes attributes
 */
const DOM_PROPERTIES: {[name: string]: boolean|string} = {
	className: 'class',
	tabIndex: 'tabindex',
	readOnly: 'readonly',
	innerHTML: true,
	textContent: true,
	value: true
};

function getRealAttribute(name: string): string {
	if (typeof DOM_PROPERTIES[name] === 'string') {
		return (<string> DOM_PROPERTIES[name]);
	}
	return name;
}

/**
 * set attributes of a domNode
 */
export function set(element: HTMLElement, attributes: {[name: string]: any}): HTMLElement {
	for (var name in attributes) {
		if (attributes.hasOwnProperty(name)) {

			var value = attributes[name];
			name = getRealAttribute(name);

			if (DOM_PROPERTIES[name] === true) {
				(<any> element)[name] = value === null || value === undefined ? '' : value;
			}  else if (value === null || value === undefined) {
				element.removeAttribute(name);
			} else {
				element.setAttribute(name, value);
			}
		}
	}
	return element;
};

/**
 * remove attributes of a domNode
 */
export function remove(element: HTMLElement, attributes: string[]|string): HTMLElement {
	if (!((<any> attributes) instanceof Array)) {
		attributes = <string[]> [attributes];
	}
	(<string[]> attributes).forEach((attribute) => {
		attribute = getRealAttribute(attribute);

		if (DOM_PROPERTIES[attribute] === true) {
			(<any> element)[attribute] = '';
		}  else {
			element.removeAttribute(attribute);
		}
	});
	return element;
};

/**
 * get a dom attribute
 */
export function get(element: HTMLElement, attribute: string): any {
	attribute = getRealAttribute(attribute);

	if (DOM_PROPERTIES[attribute] === true) {
		return (<any> element)[attribute];
	}
	return element.getAttribute(attribute);
};

/**
 * return true if a dom attribute is present
 */
export function has(element: HTMLElement, attribute: string): boolean {
	attribute = getRealAttribute(attribute);

	if (DOM_PROPERTIES[attribute] === true) {
		return !!((<any> element)[attribute]);
	}
	return element.hasAttribute(attribute);
};
