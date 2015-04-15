/**
 * represent an evented class
 * implements EventTarget interface
 */
class Evented implements EventTarget {
	private events: any = {};
	/**
	 * detach a handler from an event type in the event bus
	 * @param	type		the type event to attach
	 * @param	listener	the handler to attach
	 */
	removeEventListener(type: string, listener: Function) {
		var handlers = <Function[]> this.events[type];
		handlers.some((handler, index) => {
			if (handler === listener) {
				handlers[index] = null;
				return true;
			}
			return false;
		});
	}
	/**
	 * attach a handler to an event type in the event bus
	 * @param	type		the type event to attach
	 * @param	listener	the handler to attach
	 */
	addEventListener(type: string, listener: Function) {
		this.events[type] = this.events[type] || [];
		this.events[type].push(listener);
	}
	/**
	 * dispatch a event to the event bus
	 * does not execute other handlers if preventDefault() is called on the event
	 * @param	event	the event to dispatch
	 * @return	boolean
	 */
	dispatchEvent(event: Event): boolean {
		var handlers = <Function[]> this.events[event.type];
		if (!handlers || handlers.length === 0) { return true; }
		handlers.forEach((handler) => {
			if (event.defaultPrevented) { return; }
			if (typeof handler === 'function') {
				handler(event);
			}
		});
		return true;
	}
}

export = Evented;
