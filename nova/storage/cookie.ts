import StorageApi = require('./api/Storage');

/** internal regexp for getting an item */
const GET_ITEM_REGEXP = /[\-\.\+\*]/g;
/** internal regexp to eclude everything but the keys */
const KEY_NOISE_REMOVAL = /((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g;
/** internal regexp for separating keys (after noise removal) */
const KEY_SPLIT = /\s*(?:\=[^;]*)?;\s*/;
/** internal regexp to prevent setting keys with cookie reserved names */
const COOKIE_PROPERTIES = /^(?:expires|max\-age|path|domain|secure)$/i;

/**
 * Implement cookie management with a Storage API
 * Due to cookie size limitation, only String is supported by set item
 * use other type of storage for storing complex types
 */
class CookieStorage extends StorageApi.AbtractStorage {
	/** number of items in the storage */
	length: number;

	/** construct the class, map the .length property */
	constructor() {
		super();
		Object.defineProperty(this, 'length', {
			get: () => {
				return this.getAllKeys().length;
			}
		});
	}

	/**
	 * check if a key exists
	 * @param	key	key to check
	 * @return		true if the key exist
	 */
	private hasItem(key: string): boolean {
		if (!key) { return false; }
		return (new RegExp('(?:^|;\\s*)' + encodeURIComponent(key).replace(GET_ITEM_REGEXP, '\\$&') + '\\s*\\=')).test(document.cookie);
	}
	/**
	 * return all existing keys
	 * @return		an array of string (keys)
	 */
	private getAllKeys(): string[] {
		var allKeys = document.cookie.replace(KEY_NOISE_REMOVAL, '').split(KEY_SPLIT);
		if (allKeys[0] === '') {
			allKeys.pop();
		}
		return allKeys;
	}
	/** see nova/storage/api/Storage */
	key(index: number): string {
		var allKeys = this.getAllKeys();
		return allKeys[index] ? decodeURIComponent(allKeys[index]) : null;
	}
	/** see nova/storage/api/Storage */
	getItem(key: string): any {
		return decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(key).replace(GET_ITEM_REGEXP, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null;
	}
	/** see nova/storage/api/Storage */
	setItem(key: string, value: string, maxAge?: number|string|Date, path?: string, domain?: string, secure?: boolean): void {
		if (!key || COOKIE_PROPERTIES.test(key)) { return; }
		var expires = '';
		if (maxAge) {
			switch (maxAge.constructor) {
				case Number:
					expires = maxAge === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + maxAge;
					break;
				case String:
					expires = '; expires=' + maxAge;
					break;
				case Date:
					expires = '; expires=' + (<Date> maxAge).toUTCString();
					break;
				}
		}
		document.cookie = encodeURIComponent(key) + '=' + encodeURIComponent(value) + expires + (domain ? '; domain=' + domain : '') + (path ? '; path=' + path : '') + (secure ? '; secure' : '');

	}
	/** see nova/storage/api/Storage */
	removeItem(key: string, path?: string, domain?: string): void {
		if (!this.hasItem(key)) { return; }
		document.cookie = encodeURIComponent(key) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' + (domain ? '; domain=' + domain : '') + (path ? '; path=' + path : '');
	}
	/** see nova/storage/api/Storage */
	clear(): void {
		this.getAllKeys().forEach((key: string) => {
			this.removeItem(key);
		});
	}
	/** see nova/storage/api/Storage */
	getStorage(): StorageApi.StorageObject {
		return this;
	}
}
var storage = new CookieStorage();
export = storage;
