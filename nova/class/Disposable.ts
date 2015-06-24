import Interface = require('./Disposable.d');
/**
 * Disposable class is responsible for cleaning up memory
 * It act as a store, collect all items the application needs to destroy
 * And clean then when dispose() is called.
 */
class Disposable implements Interface.DisposableClass {
	/** array of disposable elements */
	private disposable: any[] = [];

	/**
	 * add items to the disposable array
	 * @param	items	as many disposable/removable objects as needed
	 */
	own(...items: any[]): void {
		this.disposable = this.disposable.concat(items);
	}

	/**
	 * clean up everything
	 * @return false is returned if some element were not correctly disposed
	 */
	dispose(): boolean {
		var disposed = true;
		this.disposable.forEach((item: any, index: number) => {
			var processed = false;
			if (item && typeof item === 'object') {
				if (item.tagName && item.parentNode) { //a node, attached to the dom
					item.parentNode.removeChild(item);
					processed = true;
				} else if (typeof item.remove === 'function') { //an event ?
					item.remove();
					processed = true;
				} else if (typeof item.dispose === 'function') { //an disposable object ?
					item.dispose();
					processed = true;
				}
			} else if (item && typeof item === 'number') { //a timeout/interval handle
				clearInterval(item);
				clearTimeout(item);
				processed = true;
			}
			if (processed) {
				this.disposable[index] = null;
			} else if (!processed && disposed) {
				disposed = false;
			}
		});
		return disposed;
	}
}
export = Disposable;
