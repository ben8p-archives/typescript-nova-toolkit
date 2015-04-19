/**
 * dom ready detection plugin
 * usage:
 * dom/ready!
 */

import event = require('../core/event');

var isReady = false;
var delayedLoad: Function[] = [];

function processLoad() {
	if (isReady && delayedLoad.length > 0) {
		var callback: Function;
		while (callback = delayedLoad.pop()) {
			callback();
		}
	}
}

function onLoad() {
	isReady = true;
	processLoad();
};

event.once(document, 'DOMContentLoaded').then(onLoad);
event.once(window, 'load').then(onLoad);

/**
 * see requirejs documentation
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
 * see requirejs documentation
 */
export function normalize(moduleName: string, normalize: (moduleName: string) => string): string {
	return moduleName && normalize(moduleName);
}
