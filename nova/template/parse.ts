import stringUtil = require('../core/string');

const PLACE_HOLDER = document.createElement('div');
const SPACES = /\s+/g;

interface IParse {
	documentFragment: DocumentFragment
	anchors: {[anchorName: string]: HTMLElement}
}

/**
 * this module parse a string and convert it into nodes.
 * it return a documentFragment which can be attached to the main document.
 */
function parse(template: string, placeHolders?: {[name: string]: any}): IParse {
	var fragment = document.createDocumentFragment();

	//first of all, we process the palce holders
	if (placeHolders) {
		template = stringUtil.interpolate(template, placeHolders);
	}

	PLACE_HOLDER.innerHTML = template;
	//move all nodes to the document fragment
	while (PLACE_HOLDER.firstChild) {
		let domNode = PLACE_HOLDER.firstChild;
		fragment.appendChild(domNode);
	}

	var anchors: {[anchorName: string]: Node} = {};
	var anchorNodes = fragment.querySelectorAll('[data-anchor]');
	for (let index = 0; index < anchorNodes.length; index++) {
		var anchorNode = <HTMLElement> anchorNodes[index];
		let anchorName = anchorNode.getAttribute('data-anchor').replace(SPACES, '');
		let anchorNames = anchorName.split(',');
		anchorNames.forEach((anchorName: string) => {
			anchors[anchorName] = anchorNode;
		});
	}

	return <IParse> {
		documentFragment: fragment,
		anchors: anchors
	};
}
export = parse;
