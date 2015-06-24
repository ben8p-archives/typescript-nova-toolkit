/// <amd-dependency path="nova/dom/ready!" />

/** hook for style tag */
var inlineStyleTag: HTMLStyleElement = null;
/** internal regexp to match url() values */
const URL = /url\((['']?)([^'')]+)(['']?)\)/g;

/** create a style tag in the page and keep a reference to it */
function _getInlineStyleTag() {
	if (inlineStyleTag === null) {
		inlineStyleTag = document.createElement('style');
		inlineStyleTag.type = 'text/css';
		document.getElementsByTagName('head')[0].appendChild(inlineStyleTag);
	}
	return inlineStyleTag;
}

/**
 * Add a given css string to an existing style element in the header
 * @param	text		The CSS style string
 * @param	basePath	A base path to prepend to any url() style declarations within the css. Useful for image paths
 */
export function inject(text: string, basePath?: string): void {
		var styleTag = _getInlineStyleTag(),
			basePathReplace = function(globalMatch: string, border1: string, content: string) {
				//if content is not containing HTTP
				//and if content is not starting by a /
				//then we must add the base path
				if (content.toLowerCase().indexOf('http') === -1 && content.indexOf('/') !== 0) {
					content = basePath + content;
				}
				return 'url(' + content + ')';
			};

		if (basePath) {
			if (basePath[basePath.length - 1] !== '/') {
				//add slash at the end of the base path, if needed
				basePath += '/';
			}
			text = text.replace(URL, basePathReplace);
		}

		// if (styleTag.styleSheet) {
		// 	//for IE
		// 	(<any> styleTag.styleSheet).cssText += text;
		// } else {
		styleTag.appendChild(document.createTextNode(text));
		// }
	}
