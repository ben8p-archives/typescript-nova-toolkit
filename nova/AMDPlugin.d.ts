/**
 * Interface for creating AMD plugin
 * see http://requirejs.org/docs/plugins.html
 */
interface AMDPlugin {
	load?: (moduleName: string, parentRequire: Function, onLoad: (value?: any) => void, config?: Object) => void;
	normalize?: (moduleName: string, normalize: (moduleName: string) => string) => string;
}
export = AMDPlugin;
