import StorageApi = require('./api/Storage');
import has = require('../core/has');
import page = require('./page');

if (!has('cookie')) {
	console.warn('Cookies are not supported, cookie support is required for localStore to work, falling back to pageStorage');
}

/**
 * Implement localStorage and fall back to page storage if cookies are not available
 * Improve standard localStore by supporting any type of value
 */
class Local extends StorageApi.AbtractStorage {
	/** see nova/storage/api/Storage */
	getStorage(): StorageApi.StorageObject {
		return window.top.localStorage;
	}
}
var local = has('cookie') ? new Local() : page;
export = local;
