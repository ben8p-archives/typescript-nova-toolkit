import AMDPlugin = require('../AMDPlugin.d');
const tokenRegExp = /([^?]+)\?([^:]+):(.*)/g;

interface Has {
	(name: string): any;
	add(key: string, value: any, force?: boolean): void;
	load(moduleName: string, parentRequire: Function, onLoad: (value?: any) => void): void
	normalize(moduleName: string, normalize: (moduleName: string) => string): string
}

/**
 * feature detection plugin
 * usage:
 * has!the-test?when-true-module:when-false-module
 */
class HasPlugin implements AMDPlugin {
	private hasCache: {[key: string]: any} = {};

	/**
	 * add the status of a feature to the plugin
	 */
	add(key: string, value: any, force?: boolean): void {
		if (!force && this.hasCache[key]) { return; }
		this.hasCache[key] = value;
	}

	/**
	 * return the status of a feature
	 */
	has(key: string): any {
		return this.hasCache[key];
	}

	/**
	 * see requirejs documentation
	 */
	load(moduleName: string, parentRequire: Function, onLoad: (value?: any) => void): void {
		if (moduleName) {
			parentRequire([moduleName], onLoad);
		} else {
			onLoad();
		}
	}
	/**
	 * see requirejs documentation
	 */
	normalize(moduleName: string, normalize: (moduleName: string) => string): string {
		// has!the-test?when-true-module:when-false-module
		// tokens  1         2                3
		let tokens = tokenRegExp.exec(moduleName);
		tokenRegExp.lastIndex = 0; //reset the lastIndex due to a bug (or feature in chrome)
		if (!tokens) {
			return null;
		}
		moduleName = tokens[3];
		if (this.hasCache[tokens[1]]) {
			moduleName = tokens[2];
		}
		return moduleName && normalize(moduleName);
	}
}

var plugin = new HasPlugin();

var has: Has = <Has> function(key: string): any {
	return plugin.has(key);
};
has.add = plugin.add.bind(plugin);
has.load = plugin.load.bind(plugin);
has.normalize = plugin.normalize.bind(plugin);

/** add feature detection for the running environment */
has.add('browser-host', typeof this.window !== 'undefined' && typeof this.document !== 'undefined' && window.document === document);
has.add('node-host', typeof this.process === 'object' && this.process.versions && this.process.versions.node);
has.add('amd', !!(typeof this.window !== 'undefined' && typeof (<any> window).define === 'function' && typeof (<any> window).define.amd === 'object' && (<any> window).define.amd));
has.add('cookie', navigator.cookieEnabled);

export = has;
