/**
 * Stateful class links getters and setters to properties
 */
import Base = require('./Base');
const SETTER_GETTER_SEARCH = /(s|g)et([A-Z])([a-zA-Z0-9]+)/;
export interface Interface {
}
export class Class extends Base.Class implements Interface {
	protected postConstructor() {
		var key: string;
		var instance: {[key: string]: any} = <any> this;

		var toAdd: {[key: string]: any} = {};

		//collect all getter and setter
		for (key in instance) {
			if (typeof instance[key] !== 'function') { continue; }
			let value: Function = instance[key];

			let match = key.match(SETTER_GETTER_SEARCH);
			let property = match && match[2].toLowerCase() + match[3];
			if (match && match[1] === 'g') {
				toAdd[property] = toAdd[property] || {};
				toAdd[property].get = value.bind(this);
			} else if (match && match[1] === 's') {
				toAdd[property] = toAdd[property] || {};
				toAdd[property].set = value.bind(this);
			}
		}

		//define the properties
		for (let property in toAdd) {
			var propertyValue: any = instance[property];
			Object.defineProperty(this, property, toAdd[property]);
			//run setter if needed
			if (toAdd[property].set && propertyValue !== undefined) {
				toAdd[property].set(instance[property]);
			}
		}
	}
}
