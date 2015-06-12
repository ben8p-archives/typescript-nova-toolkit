/**
 * helper for creating dom nodes
 */
import style = require('./style');

interface IHTMLElement {
	[key: string]: any;
	innerHTML?: string;
	className?: string[]|string;
	style?: {[key: string]: string|number};
}

var attributeMap: {[key: string]: string} = {
	className: 'class'
};

/**
 * create a dom node and add given attributes
 */
var create = function(type: string, attributes?: IHTMLElement): HTMLElement {
	var element = document.createElement(type);
	if (!attributes) { return element; }
	for (var attribute in attributes) {
		var value: any = attributes[attribute];
		if (attribute === 'className' && value instanceof Array) {
			value = value.join(' ');
		} else if (attribute === 'style') {
			style.set(element, value);
			continue;
		} else if (attribute === 'innerHTML') {
			element.innerHTML = value;
			continue;
		}
		element.setAttribute(attributeMap[attribute] || attribute, value);
	}
	return element;
};

export = create;
