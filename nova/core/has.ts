import AMDPlugin = require('../AMDPlugin.d');

/** internally used by the plugin to parse conditional module loading */
const TOKEN_REGEXP = /([^?]+)\?([^:]+):(.*)/g;
/** internally used to remove every charactere not supported as ccss class name */
const CLEANUP_REGEXP = /[^a-zA-Z_\-0-9]/g;
/** internal cache for regular expression used to update css classname */
var cache: {[index: string]: RegExp} = {};
/** populate the internal cache */
function getFromCache(className: string): RegExp {
	cache[className] = cache[className] || new RegExp('\\b' + className + '\\b', 'g');
	return cache[className];
}

/** internal interface describing the AMD plugin */
interface Has {
	(name: string): any;
	add(key: string, value: boolean|string|number, force?: boolean): void;
	load(moduleName: string, parentRequire: Function, onLoad: (value?: any) => void): void;
	normalize(moduleName: string, normalize: (moduleName: string) => string): string;
}

/**
 * feature detection plugin
 * Add a convenient way to populate available feature
 * Also populate HTML tag of the page with class according to available features
 * possible usage:
 * has!the-test?when-true-module:when-false-module
 */
class HasPlugin implements AMDPlugin {
	/** cache of feature already added */
	private hasCache: {[key: string]: any} = {};
	/** html tag of the page */
	private htmlTag: Node = typeof document !== 'undefined' && document.querySelector('html');

	/**
	 * add the status of a feature
	 * @param	key		the name of the feature
	 * @param	value	the value to set to the feature (a boolean, a string, a number)
	 * @param	force	if true, previous value will be overridden, otherwise previous value is not changed
	 */
	add(key: string, value: boolean|string|number, force?: boolean): void {
		if (!force && this.hasCache[key] && this.hasCache[key] !== undefined) { return; }

		var originalValue = this.hasCache[key];
		this.hasCache[key] = value;

		if (this.htmlTag) {
			let classNames = (<HTMLElement> this.htmlTag).className;
			if (originalValue) { //remove previous classes
				originalValue = [key, originalValue.toString().replace(CLEANUP_REGEXP, '-')].join('-');
				classNames = classNames.replace(getFromCache(originalValue), '');
				classNames = classNames.replace(getFromCache(key), '');
			}
			if (value) { //add new one
				value = value !== true ? [key, value.toString().replace(CLEANUP_REGEXP, '-')].join('-') : '';
				classNames = [classNames, key,  value].join(' ');
			}
			(<HTMLElement> this.htmlTag).className = classNames;
		}

	}

	/**
	 * return the status of a feature
	 * @param	key		the name of the feature
	 * @return			the value saved for that feature
	 */
	has(key: string): boolean|string|number {
		return this.hasCache[key];
	}

	/**
	 * Load the plugin
	 * see http://requirejs.org/docs/plugins.html
	 */
	load(moduleName: string, parentRequire: Function, onLoad: (value?: any) => void): void {
		if (moduleName) {
			parentRequire([moduleName], onLoad);
		} else {
			onLoad();
		}
	}
	/**
	 * Normalise the module name
	 * see http://requirejs.org/docs/plugins.html
	 */
	normalize(moduleName: string, normalize: (moduleName: string) => string): string {
		// has!the-test?when-true-module:when-false-module
		// tokens  1         2                3
		let tokens = TOKEN_REGEXP.exec(moduleName);
		TOKEN_REGEXP.lastIndex = 0; //reset the lastIndex due to a bug (or feature in chrome)
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

/** instance of the plugin singleton */
var plugin = new HasPlugin();
var has: Has = <Has> function(key: string): any {
	return plugin.has(key);
};
has.add = plugin.add.bind(plugin);
has.load = plugin.load.bind(plugin);
has.normalize = plugin.normalize.bind(plugin);

// add feature detection for the running environment
has.add('browser-host', typeof window !== 'undefined' && typeof document !== 'undefined' && window.document === document);
has.add('node-host', typeof this.process === 'object' && this.process.versions && this.process.versions.node);
has.add('amd', !!(typeof this.window !== 'undefined' && typeof (<any> window).define === 'function' && typeof (<any> window).define.amd === 'object' && (<any> window).define.amd));
has.add('cookie', has('browser-host') && navigator.cookieEnabled);

export = has;
