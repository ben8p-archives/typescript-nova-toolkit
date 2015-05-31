import Base = require('./Base');
import templateParser = require('../template/parse');
import domInsert = require('../dom/insert');

enum EPosition {FIRST, LAST, BEFORE, AFTER}

/**
 * base for all UI componeents.
 * Provide helpers for creating templates and placing in the dom
 */
class UIBase extends Base {
	protected domNode: Node
	protected templateString: string
	protected nodeAnchors: { [anchorName: string]: Node};

	protected postConstructor() {
		this.super(arguments);
		var template = templateParser(this.templateString);
		this.domNode = template.documentFragment;
		this.nodeAnchors = template.anchors;
	}

	insertIn(parentNode: Node, position?: EPosition) {
		if (position === undefined) {
			position = EPosition.LAST;
		}
		domInsert(this.domNode, parentNode, domInsert.position[EPosition[position]]);
	}
}

export = UIBase;
