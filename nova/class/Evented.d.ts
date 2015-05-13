interface Interface {
	removeEventListener(type: string, listener: EventListener): void;
	addEventListener(type: string, listener: EventListener): void;
	dispatchEvent(event: Event): boolean;
}
export = Interface;
