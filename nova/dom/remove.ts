/**
 * remove a node from the dom
 * @param	element	the node to removed
 * @return			the removed node
 */
var remove = function (element: Node): HTMLElement {
	if (!element.parentNode) {
		throw 'element must have a parentNode';
	}
	return <HTMLElement> element.parentNode.removeChild(element);
};

export = remove;
