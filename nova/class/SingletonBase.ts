import Base = require('./Base');
import Disposable = require('./Disposable');
import DisposableInterface = require('./Disposable.d');
import extendsClass = require('./extends');
import event = require('../core/event');

/** A Singleton class is a Class which will automatically be disposed when the page is unloaded */
class SingletonBase extends Base implements DisposableInterface.DisposableClass {
	/** map Disposable method */
	own: (...items: any[]) => void;
	/** map Disposable method */
	dispose: () => boolean;

	protected postConstructor() {
		this.own(
			event.when('unload').then(this.dispose.bind(this)),
			event.when('beforeunload').then(this.dispose.bind(this))
		);
	}
}
extendsClass(SingletonBase, [Disposable]);
export = SingletonBase;
