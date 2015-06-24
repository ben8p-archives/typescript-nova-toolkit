import event = require('../core/event');

/** will be set to true when dom is ready */
var isReady = false;
/** array of callback to run when the dom is ready */
var delayedLoad: Function[] = [];

/** execute all pending callbacks */
function processLoad() {
	if (isReady && delayedLoad.length > 0) {
		var callback: Function;
		while (callback = delayedLoad.pop()) {
			callback();
		}
	}
}

/** fired when dom is ready */
function onLoad() {
	isReady = true;
	processLoad();
};
if (typeof document !== 'undefined') {
	event.once(document, 'DOMContentLoaded').then(onLoad);
}
if (typeof window !== 'undefined') {
	event.once(window, 'load').then(onLoad);
}

/**
 * dom ready detection plugin
 * It will delay the execution of AMD modules until dom is ready
 * see see http://requirejs.org/docs/plugins.html
 * usage:
 * dom/ready!
 */
export function load(moduleName: string, parentRequire: Function, onLoad: (value?: any) => void): void {
	delayedLoad.push(function() {
		if (moduleName) {
			parentRequire([moduleName], onLoad);
		} else {
			onLoad();
		}
	});
	processLoad();
}
/**
 * normalize the module name
 * see http://requirejs.org/docs/plugins.html
 */
export function normalize(moduleName: string, normalize: (moduleName: string) => string): string {
	return moduleName && normalize(moduleName);
}
