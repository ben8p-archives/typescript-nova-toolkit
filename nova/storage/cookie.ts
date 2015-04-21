/**
 * Implement cookie management with a Storage API
 * Due to cookie size limitation, only String is supported by set item
 * use other type of storage for storing complex types
 */

import StorageApi = require('./api/Storage');

const GET_ITEM_REGEXP = /[\-\.\+\*]/g;
const KEY_NOISE_REMOVAL = /((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g;
const KEY_SPLIT = /\s*(?:\=[^;]*)?;\s*/;
const COOKIE_PROPERTIES = /^(?:expires|max\-age|path|domain|secure)$/i;
/** this defines a storage object with same API as browsers storage */
class CookieStorage extends StorageApi.AbtractStorage {
	length: number;

	constructor() {
		super();
		Object.defineProperty(this, 'length', {
			get: () => {
				return this.getAllKeys().length;
			}
		});
	}
	private hasItem(key: string): boolean {
		if (!key) { return false; }
		return (new RegExp('(?:^|;\\s*)' + encodeURIComponent(key).replace(GET_ITEM_REGEXP, '\\$&') + '\\s*\\=')).test(document.cookie);
	}
	private getAllKeys(): string[] {
		var allKeys = document.cookie.replace(KEY_NOISE_REMOVAL, '').split(KEY_SPLIT);
		if (allKeys[0] === '') {
			allKeys.pop();
		}
		return allKeys;
	}

	key(index: number): string {
		/** see api/apiStorage */
		var allKeys = this.getAllKeys();
		return allKeys[index] ? decodeURIComponent(allKeys[index]) : null;
	}
	getItem(key: string): any {
		/** see api/apiStorage */
		return decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(key).replace(GET_ITEM_REGEXP, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null;
	}
	setItem(key: string, value: string, maxAge?: number|string|Date, path?: string, domain?: string, secure?: boolean): void {
		/** see api/apiStorage */
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

	removeItem(key: string, path?: string, domain?: string): void {
		/**
		 * see api/apiStorage
		 */
		if (!this.hasItem(key)) { return; }
		document.cookie = encodeURIComponent(key) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' + (domain ? '; domain=' + domain : '') + (path ? '; path=' + path : '');
	}
	clear(): void {
		/**
		 * see api/apiStorage
		 */
		this.getAllKeys().forEach((key: string) => {
			this.removeItem(key);
		});
	}
	getStorage(): StorageApi.StorageObject {
		return this;
	}
}

export = new CookieStorage();
