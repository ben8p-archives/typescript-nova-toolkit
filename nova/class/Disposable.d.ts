/** interface to implements when a class inherits from Disposable */
export interface DisposableClass {
	own?(...items: any[]): void;
	dispose?(): boolean;
}

/** interface to implements for disposable objects */
export interface DisposableObject {
	dispose(): boolean;
}

/** interface to implements for removable objects (like injected method. See nova/function/inject) */
export interface RemoveableObject {
	remove(): boolean;
}
