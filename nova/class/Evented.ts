import Interface = require('./Evented.d');
/**
 * represent an evented class (a class which can emit event and inform listeners about these)
 * See https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
 * implements EventTarget interface
 */
class Evented implements EventTarget, Interface {
	private events: any = {};
	/**
	 * detach an EventListener from an event type
	 * @param	type		the type event where the listener is attached to
	 * @param	listener	the handler to detach
	 */
	removeEventListener(type: string, listener: EventListener): void {
		var handlers = <EventListener[]> this.events[type];
		handlers.some((handler, index) => {
			if (handler === listener) {
				handlers[index] = null;
				return true;
			}
			return false;
		});
	}
	/**
	 * attach an EventListener to an event type
	 * @param	type		the type event to attach
	 * @param	listener	the handler to attach
	 */
	addEventListener(type: string, listener: EventListener): void {
		this.events[type] = this.events[type] || [];
		this.events[type].push(listener);
	}
	/**
	 * dispatch an event
	 * does not execute other listeners if preventDefault() is called on the event
	 * @param	event	the event to dispatch
	 * @return	boolean		so far, always true
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
