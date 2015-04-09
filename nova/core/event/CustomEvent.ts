/** interface for event properties */
interface EventProperties {
	bubbles?:boolean;
	cancelable?:boolean;
	detail?:any;
}
/** a polyfill for CustomEvent implemetation. Allow to create a dispatchable event */
class CustomEventPolyfill implements CustomEvent {
	detail:any;
	timeStamp:number;
	defaultPrevented:boolean;
	isTrusted:boolean;
	currentTarget:HTMLElement;
	cancelBubble:boolean;
	target:HTMLElement;
	eventPhase:number;
	cancelable:boolean;
	type:string;
	srcElement:HTMLElement;
	bubbles:boolean;
	CAPTURING_PHASE:number;
	AT_TARGET:number;
	BUBBLING_PHASE:number;
	stopImmediatePropagation(){}
	stopPropagation() {}
	preventDefault() {}
	initEvent() {}
	initCustomEvent() {}
	/**
	 * construct and init a custom event
	 * @param	type		the  type of the event
	 * @param	properties	sme extra properties, respecting the interface EventProperties
	 * @constructor
	 */
	constructor(type:string, properties?:EventProperties) {
		let customEvent:CustomEvent;
		customEvent = <CustomEvent>document.createEvent('CustomEvent');
		properties = properties || <EventProperties>{};
		customEvent.initCustomEvent(type, properties.bubbles, properties.cancelable, properties.detail);
		return <any>customEvent;
	}
}

CustomEventPolyfill.prototype = (<any>window).Event.prototype;
let BrowserCustomEvent = (<any>window).CustomEvent;
if (typeof BrowserCustomEvent !== 'function') {
  BrowserCustomEvent = CustomEventPolyfill;
}
export = BrowserCustomEvent;
