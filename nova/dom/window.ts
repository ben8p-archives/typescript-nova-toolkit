import SingletonBase = require('../class/SingletonBase');
import Evented = require('../class/Evented');
import event = require('../core/event');
import debounce = require('../core/debounce');
import extendsClass = require('../class/extends');
import CustomEvent = require('../class/CustomEvent');

interface IViewportElement {
	width: number
	height: number
}

/**
 * helper for the borser window.
 * provide a debounced resize event
 * as well as the current viewport size
 */
class WindowClass extends SingletonBase.Class implements SingletonBase.Interface {
	/** map Evented method to allow the use of nova/core/event */
	removeEventListener: (type: string, listener: EventListener) => void;
	/** map Evented method to allow the use of nova/core/event */
	addEventListener: (type: string, listener: EventListener) => void;
	/** map Evented method */
	dispatchEvent: (event: Event) => boolean;

	protected postConstructor() {
		this.own(
			event.when(window, 'resize').then(debounce(this.onResize.bind(this)))
		);
	}

	private onResize(): void {
		this.dispatchEvent(new CustomEvent('resize'));
	}

	/** return the viewport size */
	getViewportSize(): IViewportElement {
		return <IViewportElement> {
			width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
			height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
		};
	}
}
extendsClass(WindowClass, [Evented.Class]);

export = new WindowClass();
