/** interface for events returned when() and once() */
interface IRootEvent {
	then(successCallback:Function):ISubEvent;
}
/** interface for events returned by then() */
interface ISubEvent {
	then(successCallback:Function):ISubEvent;
	remove():void;
}

/** represent an event, it can be attached to a target or the the event bus */
class InternalEvent {
	private eventName:string;
	private autoRemove:boolean;
	private success:Function[] = [];

	private target:EventTarget;
	private attachedEvent:number = 0;
	private eventListener:EventListener;
	/**
	 * construct the event
	 * @constructor
	 */
	constructor(eventName:string, autoRemove:boolean, target?:EventTarget) {
		this.eventName = eventName;
		this.autoRemove = autoRemove;
		this.target = target;

		this.eventListener = this.execute.bind(this);
	}
	/** executed when the first event handler is attached to this class*/
	private onFirstAddEvent() {
		if(this.target) {
			this.target.addEventListener(this.eventName, this.eventListener);
		}
	}
	/** executed when the last event handler is detached from this class*/
	private onLastRemoveEvent() {
		if(this.target) {
			this.target.removeEventListener(this.eventName, this.eventListener);
		}
	}
	/**
	 * attach a handler to an event. Return a ISubEvent object
	 * @param	successCallback	callback executed when the event is fired
	 * @return	ISubEvent
	 */
	then(successCallback:Function): ISubEvent {
		let handlerIndex = this.success.length;
		this.success.push(successCallback);

		if(this.attachedEvent === 0) {
			this.onFirstAddEvent();
		}
		this.attachedEvent++;

		return {
			then: this.then.bind(this),
			remove: () => {
				this.success[handlerIndex] = null;
				this.attachedEvent--;

				if(this.attachedEvent === 0) {
					this.onLastRemoveEvent();
				}
			}
		};
	}
	/**
	* fire all callbacks attached to this class
	* @param	values	any arguments the listener are suposed to receive
	*/
	execute(...values:any[]):void {
		this.success.forEach((callback:Function, index:number) => {
			if(callback) {
				callback.apply(null, values);
			}
			if(this.autoRemove) {
				this.success[index] = null;
			}
		});
	}
}

/**
 * core part of the event mechanism
 * it includes an implementation of publish/subscribe mechanism
 * as well as an implementation for dom events and custom events
 * handling event is done through a when()/once() method which return a thenable object
 */
class EventBus {
	private events:any = {};
	/**
	 * prepare an event to receive handlers and attach it to the event bus
	 * @param	eventName	type of the event
	 * @param	autoRemove	if true, the handler will be disconnected after being fired
	 * @return	IRootEvent
	 */
	private subscribe(eventName:string, autoRemove:boolean):IRootEvent;
	/**
	 * prepare an event to receive handlers
	 * @param	eventName	type of the event
	 * @param	autoRemove	if true, the handler will be disconnected after being fired
	 * @param	target		an EventTarget to attach the event to
	 * @return	IRootEvent
	 */
	private subscribe(eventName:string, autoRemove:boolean, target:EventTarget):IRootEvent;
	private subscribe(eventName:string, autoRemove:boolean, target?:EventTarget):IRootEvent {
		let event:InternalEvent;
		if(target) {
			event = new InternalEvent(eventName, autoRemove, target);
		} else {
			this.events[eventName] = this.events[eventName] || [];
			event = new InternalEvent(eventName, autoRemove);

			this.events[eventName].push(event);
		}

		return {
			then: event.then.bind(event)
		};
	}
	/**
	 * return a thenable object reacting when @eventName is fired by the event bus
	 * @param	eventName	type of the event
	 * @return	IRootEvent
	 */
	when(eventName:string):IRootEvent;
	/**
	 * return a thenable object reacting when @target fire @eventName
	 * @param	target		target firing the vent
	 * @param	eventName	type of the event
	 * @return	IRootEvent
	 */
	when(target:EventTarget, eventName:string):IRootEvent;
	/** overload for managing the different method signature */
	when(target:EventTarget|string, eventName?:string):IRootEvent {
		if(typeof target === 'string') {
			return this.subscribe(target, false);
		}
		return this.subscribe(eventName, false, <EventTarget>target);
	}
	/**
	 * return a thenable object reacting when @eventName is fired by the event bus
	 * the handler will be disconnected after being executed.
	 * @param	eventName	type of the event
	 * @return	IRootEvent
	 */
	once(eventName:string):IRootEvent;
	/**
	 * return a thenable object reacting when @target fire @eventName
	 * the handler will be disconnected after being executed.
	 * @param	target		target firing the vent
	 * @param	eventName	type of the event
	 * @return	IRootEvent
	 */
	once(target:EventTarget, eventName:string):IRootEvent;
	/** overload for managing the different method signature */
	once(target:EventTarget|string, eventName?:string):IRootEvent {
		if(typeof target === 'string') {
			return this.subscribe(target, true);
		}
		return this.subscribe(eventName, true, <EventTarget>target);
	}
	/**
	 * dispatch @eventName from the event bus
	 * @param	eventName	type of the event
	 * @param	values		anything handlers should receive as argument
	 */
	dispatchEvent(eventName:string, ...values:any[]):void;
	/**
	 * dispatch @eventName from @target
	 * @param	target		the event dispatcher
	 * @param	event		the event itself containing anything that should be fired with it
	 */
	dispatchEvent(target:EventTarget, event:Event):void;
	/** overload for managing the different method signature */
	dispatchEvent(eventName:string|EventTarget, ...values:any[]) {
		if(typeof eventName === 'string') {
			let events = this.events[eventName] || [];
			events.forEach((event:InternalEvent) => {
				event.execute.apply(event, values);
			});
		} else {
			eventName.dispatchEvent(values[0]);
		}
	}
}
export = new EventBus();
