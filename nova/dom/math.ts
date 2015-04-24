/**
 * helper for dom calculations
 */

interface IPositionElement {
	inViewport: {
		left: number
		top: number
	}
	inDocument: {
		left: number
		top: number
	}
}
interface IViewportElement {
	width: number
	height: number
}
interface IBoxElement {
	margin: {
		left: number
		right: number
		top: number
		bottom: number
	},
	padding: {
		left: number
		right: number
		top: number
		bottom: number
	},
	border: {
		left: number
		right: number
		top: number
		bottom: number
	},
	content: {
		availableWidth: number
		availableHeight: number
		width: number
		height: number
	},
	model: string
}

/** return the margin/padding/border size as well as the content size */
export function getBoxSize(element: HTMLElement): IBoxElement {
	var computedStyle = window.getComputedStyle(element);
	var model = computedStyle.boxSizing;
	var box: IBoxElement = {
		margin: {
			left: parseFloat(computedStyle.marginLeft),
			right: parseFloat(computedStyle.marginRight),
			top: parseFloat(computedStyle.marginTop),
			bottom: parseFloat(computedStyle.marginBottom)
		},
		border: {
			left: parseFloat(computedStyle.borderLeftWidth),
			right: parseFloat(computedStyle.borderRightWidth),
			top: parseFloat(computedStyle.borderTopWidth),
			bottom: parseFloat(computedStyle.borderBottomWidth)
		},
		padding: {
			left: parseFloat(computedStyle.paddingLeft),
			right: parseFloat(computedStyle.paddingRight),
			top: parseFloat(computedStyle.paddingTop),
			bottom: parseFloat(computedStyle.paddingBottom)
		},
		content: {
			availableWidth: 0,
			availableHeight: 0,
			height: 0,
			width: 0
		},
		model: model
	};
	box.content.availableWidth = parseFloat(computedStyle.width) - (model === 'border-box' && computedStyle.msUserSelect === undefined
		? box.padding.left + box.padding.right + box.border.left + box.border.right
		: 0);
	box.content.availableHeight = parseFloat(computedStyle.height) - (model === 'border-box' && computedStyle.msUserSelect === undefined
		? box.padding.top + box.padding.bottom + box.border.top + box.border.bottom
		: 0);
	box.content.width = parseFloat(computedStyle.width) + box.margin.left + box.margin.right + (model === 'content-box' || computedStyle.msUserSelect !== undefined
		? box.padding.left + box.padding.right + box.border.left + box.border.right
		: 0);
	box.content.height = parseFloat(computedStyle.height) + box.margin.top + box.margin.bottom + (model === 'content-box' || computedStyle.msUserSelect !== undefined
		? box.padding.top + box.padding.bottom + box.border.top + box.border.bottom
		: 0);
	return box;
}

/** Return the position of the element relative to the viewport and to the document root (does include the scroll). */
export function getPosition(element: HTMLElement, includeScroll?: boolean): IPositionElement {
	var boudingRect = element.getBoundingClientRect();
	var box: IPositionElement = {
		inViewport: {
			left: boudingRect.left,
			top: boudingRect.top
		},
		inDocument: {
			left: boudingRect.left + window.pageXOffset,
			top: boudingRect.top + window.pageYOffset
		}
	};
	return box;
}

/** return the viewport size */
export function getViewportSize(): IViewportElement {
	return <IViewportElement> {
		width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
		height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
	};
}
