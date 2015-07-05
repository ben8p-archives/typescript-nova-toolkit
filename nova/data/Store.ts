import Stateful = require('../class/Stateful');
import Evented = require('../class/Evented');
import CustomEvent = require('../class/CustomEvent');
import object = require('../core/object');

/** internal matcher to filter the store according to a query */
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

/** internal interface for events returned by query() */
interface QueryRootEvent {
	then(queryCallback: (items: {[key: string]: any; }[]) => void): QuerySubEvent;
}
/** internal interface for events returned by then() */
interface QuerySubEvent {
	then(queryCallback: (items: {[key: string]: any; }[]) => void): QuerySubEvent;
	remove(): void;
}

/**
 * store for data managment.
 * Handle filtering, sorting, add, remove and return
 * observable queries
 */
class Store extends Stateful {
	/** used as attach point for getter/setter */
	data: {[key: string]: any; }[];
	/** real data object (see Stateful for details) */
	private _data: {[key: string]: any; }[] = [];

	/**
	 * set the data
	 * @param	data	array of objects
	 */
	protected setData(data: {[key: string]: any; }[]): void {
		this._data = data;
		this._dispatchEvent();
	}
	/**
	 * return the data
	 */
	protected getData(): {[key: string]: any; }[] {
		return this._data;
	}

	/** cache of all active queries */
	private _eventCache: Evented[] = [];

	/** update all queries */
	private _dispatchEvent() {
		this._eventCache.forEach((eventBus) => {
			eventBus.dispatchEvent(new CustomEvent('update'));
		});
	}

	/**
	 * add data to the store
	 * @param	item	object to add
	 * @return			the added item
	 */
	add(item: {[key: string]: any; }): {[key: string]: any} {
		if (this._data.indexOf(item) === -1) {
			this._data.push(item);
			this._dispatchEvent();
			return item;
		}
		return null;
	}
	/**
	 * remove data from the store
	 * @param	item	object to add
	 * @return			the removed item
	 */
	remove(item: {[key: string]: any; }): {[key: string]: any} {
		var index = this._data.indexOf(item);
		if (index >= 0) {
			this._data.splice(index, 1);
			this._dispatchEvent();
			return item;
		}
		return null;
	}

	/**
	 * filter the data using the query, sort them if requested
	 * @param	query			an optional object representing a way to filter the data (see match for implementation)
	 * @param	compareFunction	should be provided if a sorting needs to be applied
	 * @return					a thenable object
	 */
	query(query?: {[key: string]: string|number|boolean|RegExp|((value: any, key: string, item: {[key: string]: any; }) => boolean); },
			compareFunction?: (itemA: {[key: string]: any; }, itemB: {[key: string]: any; }) => number): QueryRootEvent {

		//each query is Observable, so each query has its own event bus
		var eventBus = new Evented();
		var then = (queryCallback: (items: {[key: string]: any; }[]) => void): QuerySubEvent => {
			//caling then, actually add an event listener
			var listener = (evt: Event): void => {
				//this event listener, will run and return the query
				var filter = this._data.filter((item: {[key: string]: any; }) => {
					var result: boolean = true;
					object.forEach(query, function(value: any, key: string): void {
						if (!item.hasOwnProperty(key) || !match(value, item, key)) {
							result = false;
						}
					});
					return result;
				});
				queryCallback(compareFunction ? filter.sort(compareFunction) : filter);
			};
			eventBus.addEventListener('update', listener);

			//execute the callback immediatly
			listener(null);

			return {
				then: then,
				remove: function() { eventBus.removeEventListener('update', listener); }
			};
		};
		this._eventCache.push(eventBus);

		return <QueryRootEvent> {
			then: then
		};
	}
}
export = Store;
