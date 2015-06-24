import SingletonBase = require('../class/SingletonBase');
import Evented = require('../class/Evented');
import event = require('../core/event');
import debounce = require('../core/debounce');
import extendsClass = require('../class/extends');
import CustomEvent = require('../class/CustomEvent');

/**
 * provide a debounced resize event
 * as well as the current viewport size
 */
class WindowClass extends SingletonBase {
	/** map Evented method to allow the use of nova/core/event */
	removeEventListener: (type: string, listener: EventListener) => void;
	/** map Evented method to allow the use of nova/core/event */
	addEventListener: (type: string, listener: EventListener) => void;
	/** map Evented method */
	dispatchEvent: (event: Event) => boolean;

	/** attach to the window resize event */
	protected postConstructor() {
		this.own(
			event.when(window, 'resize').then(debounce(this.onResize.bind(this)))
		);
	}

	/** fired everytime the debounced resize fire */
	private onResize(): void {
		this.dispatchEvent(new CustomEvent('resize'));
	}

	/**
	 * get the viewport size
	 * @return	an object with height and width
	 */
	getViewportSize(): {width: number; height: number; } {
		return {
			width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
			height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
		};
	}
}
extendsClass(WindowClass, [Evented]);
var win = new WindowClass();
export = win;
