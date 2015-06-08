import Stateful = require('../class/Stateful');
import object = require('../core/object');

function match(query: any, item: {[key: string]: any; }, key: string): boolean {
	var value = item[key];
	if (typeof query === 'string' || typeof query === 'number' || typeof query === 'boolean') {
		return value === query;
	} else if (query instanceof RegExp) {
		return query.test(value);
	} else if (query instanceof Function) {
		return query(value, key, item);
	}
	return false;
}

/** store for data managment */
class Store extends Stateful {
	data: {[key: string]: any; }[]; //for interface
	private _data: {[key: string]: any; }[] = null; //real data handler

	protected setData(data: {[key: string]: any; }[]): void {
		this._data = data;
	}
	protected getData(): {[key: string]: any; }[] {
		return this._data;
	}
	sort(compareFunction?: (itemA: {[key: string]: any; }, itemB: {[key: string]: any; }) => number): {[key: string]: any}[] {
		compareFunction = compareFunction || function(itemA: {[key: string]: any; }, itemB: {[key: string]: any; }): number {
			var jsonA = JSON.stringify(itemA);
			var jsonB = JSON.stringify(itemB);

			return (jsonA > jsonB)
				? 1
				: (jsonA < jsonB)
					? -1
					: 0;
		};

		return this._data.sort(compareFunction);
	}
	query(query: {[key: string]: string|number|boolean|RegExp|((value: any, key: string, item: {[key: string]: any; }) => boolean); }): {[key: string]: any; }[] {
		return this._data.filter((item: {[key: string]: any; }) => {
			var result: boolean = true;
			object.forEach(query, function(value: any, key: string): void {
				if (!item.hasOwnProperty(key) || !match(value, item, key)) {
					result = false;
				}
			});
			return result;
		});
	}
}
export = Store;
