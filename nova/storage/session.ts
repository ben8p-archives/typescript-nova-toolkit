import StorageApi = require('./api/Storage');

/**
 * Implement sessionStorage
 * Improve standard sessionStorage by supporting any type of value
 */
class Session extends StorageApi.AbtractStorage {
	/** see nova/storage/api/Storage */
	getStorage(): StorageApi.StorageObject {
		return window.top.sessionStorage;
	}
}
var session = new Session();
export = session;
