/** enum of available position for insertion */
enum EPosition {FIRST, LAST, BEFORE, AFTER}

/** internal interface reprensenting the exported object */
interface Insert {
	(element: Node, reference: Node, position: EPosition): HTMLElement;
	before(element: Node, reference: Node): HTMLElement;
	after(element: Node, reference: Node): HTMLElement;
	last(element: Node, reference: Node): HTMLElement;
	first(element: Node, reference: Node): HTMLElement;
	position: {
		FIRST: number;
		LAST: number;
		BEFORE: number;
		AFTER: number;
	};
}

/**
 * helper to insert a node somewhere in the dom
 * @param	element		element to insert
 * @param	reference	node to use as reference when inserting
 * @param	position	position relative to reference
 * @return				the inserted node
 */
var insert = <Insert> function (element: Node, reference: Node, position: EPosition): HTMLElement {
	var method: (element: Node, reference: Node) => Node;
	switch (position) {
		case EPosition.FIRST:
			method = insert.first;
			break;
		case EPosition.LAST:
			method = insert.last;
			break;
		case EPosition.BEFORE:
			method = insert.before;
			break;
		case EPosition.AFTER:
			method = insert.after;
			break;
	}
	return <HTMLElement> method(element, reference);
};
/** see internal interface EPosition */
insert.position = EPosition;

/**
 * insert a node before a reference node
 * @param	element		element to insert
 * @param	reference	node to use as reference when inserting
 * @return				the inserted node
 */
insert.before = function(element: Node, reference: Node): HTMLElement {
	if (!reference.parentNode) {
		throw 'reference element must have a parentNode';
	}
	return <HTMLElement> reference.parentNode.insertBefore(element, reference);
};

/**
 * insert a node after a reference node
 * @param	element		element to insert
 * @param	reference	node to use as reference when inserting
 * @return				the inserted node
 */
insert.after = function(element: Node, reference: Node): HTMLElement {
	if (!reference.parentNode) {
		throw 'reference element must have a parentNode';
	}
	var next = reference.nextSibling;
	if (next === null) {
		return insert.last(element, reference.parentNode);
	}
	return insert.before(element, next);
};

/**
 * insert a node as first child of a reference node
 * @param	element		element to insert
 * @param	reference	node to use as reference when inserting
 * @return				the inserted node
 */
insert.first = function(element: Node, reference: Node): HTMLElement {
	if (!reference.parentNode) {
		throw 'reference element must have a parentNode';
	}
	var firstChild = reference.firstChild;
	if (firstChild === null) {
		return insert.last(element, reference);
	}
	return insert.before(element, firstChild);
};

/**
 * insert a node as last child of a reference node
 * @param	element		element to insert
 * @param	reference	node to use as reference when inserting
 * @return				the inserted node
 */
insert.last = function(element: Node, reference: Node): HTMLElement {
	if (!reference.parentNode) {
		throw 'reference element must have a parentNode';
	}
	return <HTMLElement> reference.appendChild(element);
};

export = insert;
