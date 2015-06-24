/**
 * Interface to implements in class inheriting from Evented
 * See https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
 */
interface Interface {
	removeEventListener(type: string, listener: EventListener): void;
	addEventListener(type: string, listener: EventListener): void;
	dispatchEvent(event: Event): boolean;
}
export = Interface;
