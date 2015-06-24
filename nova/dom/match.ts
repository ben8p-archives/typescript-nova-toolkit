/**
 * check if a selector match a given Node element
 * see https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
 * @param	element		element to check
 * @param	selector	selector to check
 * @return				true if there is a match
 */
export function matches(element: HTMLElement, selector: string): boolean {
	var matches = (<any> element).matches || (<any> element).webkitMatchesSelector || element.msMatchesSelector || (<any> element).mozMatchesSelector || (<any> element).oMatchesSelector;
	matches = matches.bind(element);
	return matches(selector);
}
/**
 * return the closest node (ancestor) matching the given selector
 * @param	selector		selector to check
 * @param	fromElement		element used a root for the checks
 * @param	withinElement	constraint the search to the given element (maximum ancestor)
 * @return					the closest matching element
 */
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
