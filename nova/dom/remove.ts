/**
 * Class for manipulating domnode positions
 */

/** helper to remove a node from the dom */
var remove = function (element: Node): HTMLElement {
	if (!element.parentNode) {
		throw 'element must have a parentNode';
	}
	return <HTMLElement> element.parentNode.removeChild(element);
};

export = remove;
