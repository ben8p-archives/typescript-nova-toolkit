import Base = require('./Base');
import templateParser = require('../template/parse');
import domInsert = require('../dom/insert');

/** Positions where the current Class node can be inserted in */
enum EPosition {FIRST, LAST, BEFORE, AFTER}

/**
 * Base for all UI componeents.
 * It will create a domNode according to a template
 * It can also populate the template and attach anchor to the class
 * See nova/template/parse
 */
class UIBase extends Base {
	/** represent the main domNode of the class */
	protected domNode: HTMLElement;
	/** represent the template used to create the main domNode */
	protected templateString: string;
	/** a list of anchors fetched from the template (to allow easy dom access) */
	protected nodeAnchors: { [anchorName: string]: HTMLElement};
	/** list placeholders to replace in the template */
	protected templatePlaceHolders: { [name: string]: string};

	/** parse the template, get the main node and grab the anchors */
	protected postConstructor() {
		this.super(arguments);
		var template = templateParser(this.templateString, this.templatePlaceHolders);
		this.domNode = <HTMLElement> template.documentFragment.firstChild;
		this.nodeAnchors = template.anchors;
	}

	/**
	 * insert the domNode into a parent at the specified position
	 * @param	parentNode	the parent domNode
	 * @param	position	The posistion where to insert the node. default is LAST
	 */
	insertIn(parentNode: Node, position?: EPosition): void {
		if (position === undefined) {
			position = EPosition.LAST;
		}
		domInsert(this.domNode, parentNode, domInsert.position[EPosition[position]]);
	}
}

export = UIBase;
