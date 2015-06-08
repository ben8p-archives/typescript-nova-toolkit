/** check if a selector match a given Node element */
export function matches(element: HTMLElement, selector: string) {
	var matches = (<any> element).matches || element.webkitMatchesSelector || element.msMatchesSelector;
	matches = matches.bind(element);
	return matches(selector);
}
/** check if a selector match a Node contained in a topElement Node and containing a given Node element */
export function matchesAncestor(topElement: HTMLElement, element: HTMLElement, selector: string): HTMLElement {
	if (matches(element, selector)) {
		return element;
	}
	var query = topElement.querySelectorAll(selector);
	if (query.length) {
		for (var i = 0; i < query.length; i++) {
			if ((<HTMLElement> query[i]).contains(element)) {
				return <HTMLElement> query[i];
			}
		}
	}
	return null;
}
