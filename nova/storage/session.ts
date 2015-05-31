/**
 * Implement sessionStorage
 * Improve standard sessionStorage by supporting any type of value
 */

import StorageApi = require('./api/Storage');

class Session extends StorageApi.AbtractStorage {
	getStorage(): StorageApi.StorageObject {
		return window.top.sessionStorage;
	}
}
var session = new Session();
export = session;
