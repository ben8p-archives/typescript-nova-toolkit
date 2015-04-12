/**
 * Interface for writing an AMD plugin
 */
interface AMDPlugin {
	load?: (moduleName: string, parentRequire: Function, onLoad: (value?: any) => void, config?: Object) => void;
	normalize?: (moduleName: string, normalize: (moduleName: string) => string) => string;
}
export = AMDPlugin;
