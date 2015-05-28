export interface DisposableClass {
	own?(...items: any[]): void;
	dispose?(): boolean;
}

export interface DisposableObject {
	dispose(): boolean;
}
export interface RemoveableObject {
	remove(): boolean;
}
