/** interface for response when handled as JSON */
export interface JsonResponse {
	status: number;
	response: any;
}
/** interface for response when handled as XML */
export interface XmlResponse {
	status: number;
	response: XMLDocument;
}
/** interface for response when handled as TEXT */
export interface TextResponse {
	status: number;
	response: string;
}
/** interface for response when handled as BLOB */
export interface BlobResponse {
	status: number;
	response: Blob;
}
