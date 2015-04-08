/**
 * An implemeatation of publish/subscribe mechanism
 * handling event is done through a when() method which return a thenable object
 */


/**
 * interface for events
 */
interface IRootEvent {
	then(successCallback:Function):ISubEvent;
}
interface ISubEvent {
	then(successCallback:Function):ISubEvent;
	remove():void;
}

/**
 * represent an event
 */
class PublishEvent {
	private eventName:string;
	private autoRemove:boolean;
	private success:Function[] = [];

	private target:EventTarget;
	private attachedEvent:number = 0;
	private eventListener:EventListener;

	constructor(eventName:string, autoRemove:boolean, target?:EventTarget) {
		this.eventName = eventName;
		this.autoRemove = autoRemove;
		this.target = target;

		this.eventListener = this.execute.bind(this);
	}
	private onFirstAddEvent() {
		if(this.target) {
			this.target.addEventListener(this.eventName, this.eventListener);
		}
	}
	private onLastRemoveEvent() {
		if(this.target) {
			this.target.removeEventListener(this.eventName, this.eventListener);
		}
	}
	/**
	 * attach a handler to an event. Return a removeer method
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
 * handle the publish and the subscribe
 */
class EventBus {
	private events:any = {};
	private subscribe(eventName:string, autoRemove:boolean):IRootEvent;
	private subscribe(eventName:string, autoRemove:boolean, target:EventTarget):IRootEvent;

	private subscribe(eventName:string, autoRemove:boolean, target?:EventTarget):IRootEvent {
		let event:PublishEvent;
		if(target) {
			event = new PublishEvent(eventName, autoRemove, target);
		} else {
			this.events[eventName] = this.events[eventName] || [];
			event = new PublishEvent(eventName, autoRemove);

			this.events[eventName].push(event);
		}

		return {
			then: event.then.bind(event)
		};
	}

	when(eventName:string):IRootEvent;
	when(target:EventTarget, eventName:string):IRootEvent;
	when(target:EventTarget|string, eventName?:string):IRootEvent {
		if(typeof target === 'string') {
			return this.subscribe(target, false);
		}
		return this.subscribe(eventName, false, <EventTarget>target);
	}
	once(eventName:string):IRootEvent;
	once(target:EventTarget, eventName:string):IRootEvent;
	once(target:EventTarget|string, eventName?:string):IRootEvent {
		if(typeof target === 'string') {
			return this.subscribe(target, true);
		}
		return this.subscribe(eventName, true, <EventTarget>target);
	}
	dispatchEvent(eventName:string, ...values:any[]):void;
	dispatchEvent(target:EventTarget, event:Event):void;
	dispatchEvent(eventName:string|EventTarget, ...values:any[]) {
		if(typeof eventName === 'string') {
			let events = this.events[eventName] || [];
			events.forEach((event:PublishEvent) => {
				event.execute.apply(event, values);
			});
		} else {
			eventName.dispatchEvent(values[0]);
		}
	}
}
export = new EventBus();
