/**
 * helper for updating dom nodes styles
 */

interface IStyleElement {
	[key: string]: string|number
}

// const JS_ATTRIBUTE_REGEXP = /([A-Z])/g;
const CSS_ATTRIBUTE_REGEXP = /(?:\-)([a-z0-9])/g;

// /** convert a JS property into CSS property */
// function toCssAttribute(property: string): string {
// 	return property.replace(JS_ATTRIBUTE_REGEXP, '-$1').toLowerCase();
// }
/** convert a CSS property into a JS property */
function toJsAttribute(property: string): string {
	return property.replace(CSS_ATTRIBUTE_REGEXP, function(match: string, value: string): string { return value.toUpperCase(); });
}

/**
 * set dom style attributes
 * No specific support for vendor prefix
 */
export function set(element: HTMLElement, attributes: IStyleElement): HTMLElement {
	for (var attribute in attributes) {
		element.style[<any> toJsAttribute(attribute)] = <string> attributes[attribute];

	}
	return element;
};

/**
 * get any dom style attributes
 * No specific support for vendor prefix
 */
export function get(element: HTMLElement, attributes: string[]|string): IStyleElement {
	if (typeof attributes === 'string') {
		attributes = [<string> attributes];
	}
	var values = <IStyleElement> {};
	(<string[]> attributes).forEach(function (attribute) {
		attribute = toJsAttribute(attribute);
		values[attribute] = element.style[<any> attribute];
	});
	return values;
};
