import Evented = require('../class/Evented');

/** interface for events returned when() and once() */
interface IRootEvent {
	then(successCallback: Function): ISubEvent;
}
/** interface for events returned by then() */
interface ISubEvent {
	then(successCallback: Function): ISubEvent;
	remove(): void;
}

/** represent an event, it can be attached to a target or the the event bus */
class InternalEvent {
	private eventName: string;
	private autoRemove: boolean;
	private success: Function[] = [];

	private target: EventTarget;
	private attachedEvent: number = 0;
	private eventListener: EventListener;
	/**
	 * construct the event
	 * @constructor
	 */
	constructor(eventName: string, autoRemove: boolean, target?: EventTarget) {
		this.eventName = eventName;
		this.autoRemove = autoRemove;
		this.target = target;

		this.eventListener = this.execute.bind(this);
	}
	/** executed when the first event handler is attached to this class */
	private onFirstAddEvent() {
		if (this.target) {
			this.target.addEventListener(this.eventName, this.eventListener);
		}
	}
	/** executed when the last event handler is detached from this class */
	private onLastRemoveEvent() {
		if (this.target) {
			this.target.removeEventListener(this.eventName, this.eventListener);
		}
	}
	/**
	 * attach a handler to an event. Return a ISubEvent object
	 * @param	successCallback	callback executed when the event is fired
	 * @return	ISubEvent
	 */
	then(successCallback: Function): ISubEvent {
		let handlerIndex = this.success.length;
		this.success.push(successCallback);

		if (this.attachedEvent === 0) {
			this.onFirstAddEvent();
		}
		this.attachedEvent++;

		return {
			then: this.then.bind(this),
			remove: () => {
				this.success[handlerIndex] = null;
				this.attachedEvent--;

				if (this.attachedEvent === 0) {
					this.onLastRemoveEvent();
				}
			}
		};
	}
	/**
	 * fire all callbacks attached to this class
	 * support preventDefault() to prevent other handlers to starts
	 * @param	values	any arguments the listener are suposed to receive
	 */
	execute(...values: any[]): void {
		this.success.forEach((callback: Function, index: number) => {
			var event = <CustomEvent> values[0];
			if (event && event.defaultPrevented) {
				return;
			}
			if (callback) {
				callback.apply(null, values);
			}
			if (this.autoRemove) {
				this.success[index] = null;
			}
		});
	}
}

/** implementation of the bus for publish/subscribe pattern */
let eventBus = new Evented.Class();

/**
 * prepare an event to receive handlers
 * @param	target		an EventTarget to attach the event to
 * @param	eventName	type of the event
 * @param	autoRemove	if true, the handler will be disconnected after being fired
 * @return	IRootEvent
 */
function subscribe(target: EventTarget, eventName: string, autoRemove: boolean): IRootEvent {
	let event: InternalEvent = new InternalEvent(eventName, autoRemove, target);
	return {
		then: event.then.bind(event)
	};
}

/**
 * return a thenable object reacting when @eventName is fired by the event bus
 * @param	eventName	type of the event
 * @return	IRootEvent
 */
export function when(eventName: string): IRootEvent;
/**
 * return a thenable object reacting when @target fire @eventName
 * @param	target		target firing the vent
 * @param	eventName	type of the event
 * @return	IRootEvent
 */
export function when(target: EventTarget, eventName: string): IRootEvent;
/** overload for managing the different method signature */
export function when(target: EventTarget|string, eventName?: string): IRootEvent {
	if (typeof target === 'string') {
		eventName = <string> target;
		target = eventBus;
	}
	return subscribe(<EventTarget> target, eventName, false);
}
/**
 * return a thenable object reacting when @eventName is fired by the event bus
 * the handler will be disconnected after being executed.
 * @param	eventName	type of the event
 * @return	IRootEvent
 */
export function once(eventName: string): IRootEvent;
/**
 * return a thenable object reacting when @target fire @eventName
 * the handler will be disconnected after being executed.
 * @param	target		target firing the vent
 * @param	eventName	type of the event
 * @return	IRootEvent
 */
export function once(target: EventTarget, eventName: string): IRootEvent;
/** overload for managing the different method signature */
export function once(target: EventTarget|string, eventName?: string): IRootEvent {
	if (typeof target === 'string') {
		eventName = <string> target;
		target = eventBus;
	}
	return subscribe(<EventTarget> target, eventName, true);
}
/**
 * dispatch @eventName from the event bus
 * @param	event		the event itself containing anything that should be fired with it
 */
export function dispatchEvent(event: Event): boolean;
/**
 * dispatch @eventName from @target
 * @param	target		the event dispatcher
 * @param	event		the event itself containing anything that should be fired with it
 */
export function dispatchEvent(target: EventTarget, event: Event): boolean;
/** overload for managing the different method signature */
export function dispatchEvent(target: Event|EventTarget, event?: Event): boolean {
	if (!event) {
		event = <Event> target;
		target = eventBus;
	}
	(<EventTarget> target).dispatchEvent(event);
	return true;
}
