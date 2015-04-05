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
	cancel():void;
}
/**
 * represent an event
 */
class PublishEvent {
	private eventName:string;
	private autoCancel:boolean;
	private success:Function[] = [];

	constructor(eventName:string, autoCancel:boolean) {
		this.eventName = eventName;
		this.autoCancel = autoCancel;
	}
	/**
	 * attach a handler to an event. Return a canceler method
	 */
	then(successCallback:Function): ISubEvent {
		var handlerIndex = this.success.length;
		this.success.push(successCallback);
		return {
			then: this.then.bind(this),
			cancel: () => {
				this.success[handlerIndex] = null;
			}
		};
	}
	execute(...values:any[]):void {
		this.success.forEach((callback:Function, index:number) => {
			if(callback) {
				callback.apply(null, values);
			}
			if(this.autoCancel) {
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
	private subscribe(eventName:string, autoCancel:boolean):IRootEvent {
		this.events[eventName] = this.events[eventName] || [];
		var event = new PublishEvent(eventName, autoCancel);

		this.events[eventName].push(event);

		return {
			then: event.then.bind(event)
		};
	}
	when(eventName:string):IRootEvent {
		return this.subscribe(eventName, false);
	}
	once(eventName:string):IRootEvent {
		return this.subscribe(eventName, true);
	}
	publish(eventName:string, ...values:any[]) {
		var events = this.events[eventName] || [];
		events.forEach((event:PublishEvent) => {
			event.execute.apply(event, values);
		});
	}
}
export = new EventBus();
