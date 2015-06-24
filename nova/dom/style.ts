/** internal interface for style attributes */
interface IStyleElement {
	[key: string]: string|number;
}

const CSS_ATTRIBUTE_REGEXP = /(?:\-)([a-z0-9])/g;

/**
 * convert a CSS property into a JS property
 * @param	property	the CSS property
 * @return				a JS property
 */
function toJsAttribute(property: string): string {
	return property.replace(CSS_ATTRIBUTE_REGEXP, function(match: string, value: string): string { return value.toUpperCase(); });
}

/**
 * set dom style attributes
 * No specific support for vendor prefix
 * @param	element		node to update
 * @param	attributes	styles to update
 * @return				the updated node
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
 * @param	element		node to read
 * @param	attributes	array of styles to get
 * @return				an object with all requested styles
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
