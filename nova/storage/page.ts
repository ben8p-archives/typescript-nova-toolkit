import StorageApi = require('./api/Storage');

/** default object constructor (to prevent IE security issue) */
var ObjectConstructor = (<any> window.top).Object || Object;
/** default array constructor (to prevent IE security issue) */
var ArrayConstructor = (<any> window.top).Array || Array;

/**
 * Implement a page storage
 * Storage content lives as long as the page lives.
 * Support any type of value
 */
class PageStorage extends StorageApi.AbtractStorage {
	/** storage placeholder */
	private topPageStorage: any;
	/** number of items in the storage */
	length: number;

	/** construct the class, create the storage and map the .length property */
	constructor() {
		super();
		this.createStorageObject();
		Object.defineProperty(this, 'length', {
			get: () => {
				return this.topPageStorage.length;
			}
		});
	}

	/** create a storage space on the top window */
	private createStorageObject() {
		this.topPageStorage = (<any> window.top).pageStorage = (<any> window.top).pageStorage || new ArrayConstructor();
		this.topPageStorage.__hash__ = this.topPageStorage.__hash__ || new ObjectConstructor();
	}

	/** see nova/storage/api/Storage */
	key(index: number): string {
		var item = this.topPageStorage[index];
		return item ? item.key : null;
	}
	/** see nova/storage/api/Storage */
	getItem(key: string): any {
		var index = this.topPageStorage.__hash__[key];
		if (!key || index === undefined || !this.topPageStorage[index]) { return null; }
		return this.topPageStorage[index].value;
	}
	/** see nova/storage/api/Storage */
	setItem(key: string, value: any): void {
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
	/** see nova/storage/api/Storage */
	removeItem(key: string): void {
		var index = this.topPageStorage.__hash__[key];
		if (!key || index === undefined || !this.topPageStorage[index]) { return; }
		this.topPageStorage.splice(index, 1);
		delete this.topPageStorage.__hash__[key];
		//re-index
		(<any[]> this.topPageStorage).forEach((item, index) => {
			this.topPageStorage.__hash__[item.key] = index;
		});
	}
	/** see nova/storage/api/Storage */
	clear(): void {
		(<any> window.top).pageStorage = null;
		this.createStorageObject();
	}
	/** see nova/storage/api/Storage */
	getStorage(): StorageApi.StorageObject {
		return this;
	}
}
var page = new PageStorage();
export = page;
