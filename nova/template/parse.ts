import stringUtil = require('../core/string');

const PLACE_HOLDER = document.createElement('div');
const SPACES = /\s+/g;

var WRAPPERS = {
	option: ['select'],
	tbody: ['table'],
	thead: ['table'],
	tfoot: ['table'],
	tr: ['table', 'tbody'],
	td: ['table', 'tbody', 'tr'],
	th: ['table', 'thead', 'tr'],
	legend: ['fieldset'],
	caption: ['table'],
	colgroup: ['table'],
	col: ['table', 'colgroup'],
	li: ['ul']
};
// prepare wrappers for dom parsing
for (var key in WRAPPERS) {
	if (WRAPPERS.hasOwnProperty(key)) {
		WRAPPERS[key].prefix = '<' + WRAPPERS[key].join('><') + '>';
		WRAPPERS[key].suffix = '</' + WRAPPERS[key].reverse().join('></') + '>';
	}
}

const FIND_TAGS = /<\s*([\w\:]+)/;

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

	//first of all, we process the place holders
	if (placeHolders) {
		template = stringUtil.interpolate(template, placeHolders);
	}

	var match = template.match(FIND_TAGS),
		tag = match ? match[1].toLowerCase() : '',
		master: HTMLElement = PLACE_HOLDER;
		//if the domnode we are creating needs some wrappers
		if (match && WRAPPERS[tag]) {
			PLACE_HOLDER.innerHTML = WRAPPERS[tag].prefix + template + WRAPPERS[tag].suffix;
			for (var i = WRAPPERS[tag].length; i; --i) {
				master = <HTMLElement> master.firstChild;
			}
		} else {
			master.innerHTML = template;
		}

	//move all nodes to the document fragment
	while (master.firstChild) {
		let domNode = master.firstChild;
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
