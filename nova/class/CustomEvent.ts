import has = require('../core/has');
/** interface for event properties */
interface EventProperties {
	bubbles?: boolean;
	cancelable?: boolean;
	detail?: any;
}
/**
 * a polyfill for CustomEvent implemetation. Allow to create a dispatchable event
 * in Node, support only preventDefault()
 */
class CustomEventPolyfill implements CustomEvent {
	detail: any;
	timeStamp: number;
	defaultPrevented: boolean;
	returnValue: boolean;
	isTrusted: boolean;
	currentTarget: HTMLElement;
	cancelBubble: boolean;
	target: HTMLElement;
	eventPhase: number;
	cancelable: boolean;
	type: string;
	srcElement: HTMLElement;
	bubbles: boolean;
	CAPTURING_PHASE: number;
	AT_TARGET: number;
	BUBBLING_PHASE: number;
	stopImmediatePropagation() {
		this.stopPropagation();
	}
	stopPropagation() {
	}
	preventDefault() {
		if (this.cancelable) {
			this.cancelable = false;
			this.defaultPrevented = true;
		}
	}
	initEvent() {}
	initCustomEvent() {}
	/**
	 * construct and init a custom event
	 * @param	type		the  type of the event
	 * @param	properties	sme extra properties, respecting the interface EventProperties
	 * @constructor
	 */
	constructor(type: string, properties?: EventProperties) {
		if (has('node-host')) {
			//create a lite event just for node
			this.type = type;
			this.bubbles = properties.bubbles;
			this.cancelable = properties.cancelable;
			this.detail = properties.detail;
			this.timeStamp = (new Date()).getTime();
			return this;
		} else {
			let customEvent: CustomEvent = <CustomEvent> document.createEvent('CustomEvent');
			properties = properties || <EventProperties> {};
			customEvent.initCustomEvent(type, properties.bubbles, properties.cancelable, properties.detail);

			//fix for ie
			var preventDefaultNative = customEvent.preventDefault.bind(customEvent);
			customEvent.preventDefault = function() {
				preventDefaultNative();
				if (customEvent.cancelable && !customEvent.defaultPrevented) {
					Object.defineProperty(customEvent, 'cancelable', {get: function () {return false; }});
					Object.defineProperty(customEvent, 'defaultPrevented', {get: function () {return true; }});
				}

			};

			return <any> customEvent;
		}

	}
}

//CustomEventPolyfill.prototype = <any> Event.prototype;
var BrowserCustomEvent = CustomEventPolyfill;
if (!has('node-host') && typeof CustomEvent === 'function') {
	has.add('browser-custom-event', true);
	BrowserCustomEvent = <any> CustomEvent;
}
export = BrowserCustomEvent;
