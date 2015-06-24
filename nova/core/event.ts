import Evented = require('../class/Evented');

/** interface for events returned by when() and once() */
interface IRootEvent {
	then(eventCallback: Function): ISubEvent;
}
/** interface for events returned by then() */
interface ISubEvent {
	then(eventCallback: Function): ISubEvent;
	remove(): void;
}

/** internal representation of an event, it can be attached to any kind of target */
class InternalEvent {
	/** the event type */
	private eventType: string;
	/** when true, listener is detached after the first exection */
	private autoRemove: boolean;
	/** list of listener to execute when an event is fired */
	private eventCallbacks: Function[] = [];
	/** element on which the listener will be attached */
	private target: EventTarget;
	/** amount of event currently attached to the target */
	private attachedEvent: number = 0;
	/** listener to attach to the target */
	private eventListener: EventListener;
	/**
	 * construct the event
	 * @param	eventType	the type of the event
	 * @param	autoRemove	when true, listener is detached after the first exection
	 * @param	target		the target on which the listener will be attached
	 */
	constructor(eventType: string, autoRemove: boolean, target?: EventTarget) {
		this.eventType = eventType;
		this.autoRemove = autoRemove;
		this.target = target;

		this.eventListener = this.execute.bind(this);
	}
	/**
	 * executed when the first event listener is attached to this class.
	 * this method is reponsible for attaching this class to the target (and this class will fire all listeners)
	 */
	private onFirstAddEvent() {
		if (this.target) {
			this.target.addEventListener(this.eventType, this.eventListener);
		}
	}
	/**
	 * executed when the last event listener is detached from this class
	 * this method is reponsible for detaching this class to the target
	 */
	private onLastRemoveEvent() {
		if (this.target) {
			this.target.removeEventListener(this.eventType, this.eventListener);
		}
	}
	/**
	 * attach a listener to an event. Return a ISubEvent object
	 * @param	eventCallback	listener executed when the event is fired
	 * @return					a removabale object
	 */
	then(eventCallback: Function): ISubEvent {
		let handlerIndex = this.eventCallbacks.length;
		this.eventCallbacks.push(eventCallback);

		if (this.attachedEvent === 0) {
			this.onFirstAddEvent();
		}
		this.attachedEvent++;

		return {
			then: this.then.bind(this),
			remove: () => {
				this.eventCallbacks[handlerIndex] = null;
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
		this.eventCallbacks.forEach((callback: Function, index: number) => {
			var event = <CustomEvent> values[0];
			if (event && event.defaultPrevented) {
				return;
			}
			if (callback) {
				callback.apply(null, values);
			}
			if (this.autoRemove) {
				this.eventCallbacks[index] = null;
			}
		});
	}
}

/**
 * implementation of the bus for publish/subscribe pattern
 * This behaves as a global target.
 * if when() or once() are not receiving any taget, then this global object is used as target.
 * See https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern
 */
let eventBus = new Evented();

/**
 * internal method prepare an event to receive handlers
 * @param	target		an EventTarget to attach the event to
 * @param	eventType	type of the event
 * @param	autoRemove	if true, the handler will be disconnected after being fired
 * @return				A thenable object
 */
function subscribe(target: EventTarget, eventType: string, autoRemove: boolean): IRootEvent {
	let event: InternalEvent = new InternalEvent(eventType, autoRemove, target);
	return {
		then: event.then.bind(event)
	};
}

/**
 * return a thenable object reacting when @eventType is fired by the event bus (publish/subscribe pattern)
 * @param	eventType	type of the event
 * @return				A thenable object
 */
export function when(eventType: string): IRootEvent;
/**
 * return a thenable object reacting when @target fire @eventType
 * @param	target		target firing the vent
 * @param	eventType	type of the event
 * @return				A thenable object
 */
export function when(target: EventTarget, eventType: string): IRootEvent;
/** overload for managing the different method signature */
export function when(target: EventTarget|string, eventType?: string): IRootEvent {
	if (typeof target === 'string') {
		eventType = <string> target;
		target = eventBus;
	}
	return subscribe(<EventTarget> target, eventType, false);
}
/**
 * return a thenable object reacting when @eventType is fired by the event bus (publish/subscribe pattern)
 * the handler will be disconnected after being executed.
 * @param	eventType	type of the event
 * @return				A thenable object
 */
export function once(eventType: string): IRootEvent;
/**
 * return a thenable object reacting when @target fire @eventType
 * the handler will be disconnected after being executed.
 * @param	target		target firing the vent
 * @param	eventType	type of the event
 * @return				A thenable object
 */
export function once(target: EventTarget, eventType: string): IRootEvent;
/** overload for managing the different method signature */
export function once(target: EventTarget|string, eventType?: string): IRootEvent {
	if (typeof target === 'string') {
		eventType = <string> target;
		target = eventBus;
	}
	return subscribe(<EventTarget> target, eventType, true);
}
/**
 * dispatch @eventType from the event bus (publish/subscribe pattern)
 * @param	event		the event itself containing anything that should be fired with it
 * @return				a booelan (so far, always true)
 */
export function dispatchEvent(event: Event): boolean;
/**
 * dispatch @eventType from @target
 * @param	target		the event dispatcher
 * @param	event		the event itself containing anything that should be fired with it
 * @return				a booelan (so far, always true)
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

/** stop an event */
export function stop(event: Event) {
	if (event.preventDefault) {
		event.preventDefault();
	}
	if (event.stopPropagation) {
		event.stopPropagation();
	}
	return false;
}
