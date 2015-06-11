/** check if a selector match a given Node element */
export function matches(element: HTMLElement, selector: string): boolean {
	var matches = (<any> element).matches || element.webkitMatchesSelector || element.msMatchesSelector || (<any> element).mozMatchesSelector || (<any> element).oMatchesSelector;
	matches = matches.bind(element);
	return matches(selector);
}
/** check if a selector match a Node contained in a topElement Node and containing a given Node element */
export function closest(selector: string, fromElement: HTMLElement, withinElement?: HTMLElement): HTMLElement {
	while (fromElement) {
		if (matches(fromElement, selector)) {
			break;
		}
		fromElement = fromElement.parentElement;
		if (withinElement && fromElement === withinElement) {
			return null;
		}
	}
	return fromElement;
}
