/**
 * Implement a page storage
 * Storage content lives as long as the page lives.
 * Support any type of value
 */

import StorageApi = require('./api/Storage');

var ObjectConstructor = (<any> window.top).Object || Object;
var ArrayConstructor = (<any> window.top).Array || Array;

/** this defines a storage object with same API as browsers storage */
class PageStorage extends StorageApi.AbtractStorage {
	private topPageStorage: any;
	length: number;

	constructor() {
		super();
		this.createStorageObject();
		Object.defineProperty(this, 'length', {
			get: () => {
				return this.topPageStorage.length;
			}
		});
	}

	private createStorageObject() {
		this.topPageStorage = (<any> window.top).pageStorage = (<any> window.top).pageStorage || new ArrayConstructor();
		this.topPageStorage.__hash__ = this.topPageStorage.__hash__ || new ObjectConstructor();
	}

	key(index: number): string {
		/** see api/apiStorage */

		var item = this.topPageStorage[index];
		return item ? item.key : null;
	}
	getItem(key: string): any {
		/** see api/apiStorage */

		var index = this.topPageStorage.__hash__[key];
		if (!key || index === undefined || !this.topPageStorage[index]) { return null; }
		return this.topPageStorage[index].value;
	}
	setItem(key: string, value: any): void {
		/** see api/apiStorage */

		if (!key) { return; }

		var index = this.topPageStorage.__hash__[key],
			item: any;
		if (index === undefined) {
			item = new ObjectConstructor();
			item.key = key;
			this.topPageStorage.push(item);
			index = this.topPageStorage.__hash__[key] = this.topPageStorage.length - 1;
		}
		this.topPageStorage[index].value = value;
	}
	removeItem(key: string): void {
		/**
		 * see api/apiStorage
		 */
		var index = this.topPageStorage.__hash__[key];
		if (!key || index === undefined || !this.topPageStorage[index]) { return; }
		this.topPageStorage.splice(index, 1);
		delete this.topPageStorage.__hash__[key];
		//re-index
		(<any[]> this.topPageStorage).forEach((item, index) => {
			this.topPageStorage.__hash__[item.key] = index;
		});
	}
	clear(): void {
		/**
		 * see api/apiStorage
		 */
		(<any> window.top).pageStorage = null;
		this.createStorageObject();
	}
	getStorage(): StorageApi.StorageObject {
		return this;
	}
}

export = new PageStorage();
