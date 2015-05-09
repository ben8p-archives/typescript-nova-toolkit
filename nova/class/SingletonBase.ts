import Base = require('./Base');
import Disposable = require('./Disposable');
import extendsClass = require('./extends');
import event = require('../core/event');

export interface Interface extends Base.Interface, Disposable.Interface {
}
/** A Singleton class is a Class which will automatically be disposed when the page is unloaded */
export class Class extends Base.Class implements Interface {
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
extendsClass(Class, [Disposable.Class]);
