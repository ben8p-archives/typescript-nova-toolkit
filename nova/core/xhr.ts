import Deferred = require('./promise/Deferred');
import object = require('./object');
import xhrInterface = require('./xhr.d');

/** interface used to defined how options should look like */
export interface xhrOptions {
	url: string;
	handleAs?: handleAs;
	timeout?: number;
	query?:any;
	post?:any;
	withCredentials?:boolean;
	user?:string;
	password?:string;
	headers?:string[];
}
/** interface used to defined how options should look like when including xhr method */
interface xhrFinalOptions extends xhrOptions {
	method: method
}

/** enum of supported protocols */
enum method {GET, POST, DEL, PUT};

/**
 * return true is the value is an object
 * @param	value	anything to test
 * @return	a boolean
 */
function isNativeObject(value:any):Boolean {
	if(value && value.toString && value.toString() === '[object Object]') {
		return true;
	}
	return false;
}

/**
 * execute an xhr request
 * @param	options	represent the xhr options
 * @return	Deferred
 */
function xhr(options:xhrFinalOptions):Deferred {
	let request = new XMLHttpRequest();
	let deferred = new Deferred();

	let url:string = options.url;
	let query:string = isNativeObject(options.query) ? toQuery(options.query) : options.query;
	if(query !== undefined) {
		let lastUrlCharacter = options.url.substr(-1);
		let firstQueryCharacter = query.substr(0, 1);
		if(lastUrlCharacter !== '?' && lastUrlCharacter !== '&' && firstQueryCharacter !== '?' && firstQueryCharacter !== '&') {
			url += url.indexOf('?') > 0 ? '&' : '?';
		}
		url += query;
	}
	if(options.headers) {
		for(var header in options.headers) {
			if(options.headers.hasOwnProperty(header) && options.headers[header]) {
				request.setRequestHeader(header, options.headers[header]);
			}
		}
	}

	if(options.withCredentials){
		request.withCredentials = options.withCredentials;
	}
	request.open(method[options.method], url, true, options.user || undefined, options.password || undefined);
	request.timeout = options.timeout || 0;

	request.addEventListener('load', (event) => {
		let response:xhrInterface.TextResponse = {
			status: request.status,
			response: request.responseText
		}
		let responseJson:xhrInterface.JsonResponse;
		let responseXml:xhrInterface.XmlResponse;
		if(options.handleAs === handleAs.JSON) {
			responseJson = {
				status: request.status,
				response: JSON.parse(response.response)
			}
		} else if(options.handleAs === handleAs.XML) {
			if(!request.responseXML) {
				let parser = new DOMParser();
				request.responseXML = parser.parseFromString(response.response, 'text/xml');
			}
			responseXml = {
				status: request.status,
				response: request.responseXML
			}
		}
		deferred.resolve(responseJson || responseXml || response);
	}, false);
	request.addEventListener('error', () => {
		deferred.reject(<xhrInterface.TextResponse>{
			status: request.status,
			response: request.responseText
		});
	}, false);

	let post:string = options.post !== undefined
		? isNativeObject(options.post)
			? toQuery(options.post)
			: options.query
		: null
	request.send(post);
	return deferred
}



/** types of data we will return */
export enum handleAs {JSON, XML, TEXT};
/**
 * convert an object into a query string
 * @param	object		will be the query
 * @return				a query string
 */
export function toQuery(value:any):string {
	if(value === undefined) {
		return undefined;
	}
	if(value === null) {
		return 'null';
	}
	if(!isNativeObject(value)) {
		return encodeURIComponent(value.toString());
	}
	let query:string[] = [];
	let key:string;
	for(key in value) {
		if(value.hasOwnProperty(key)) {
			let item:any = value[key];
			if(item instanceof Array) {
				(<any[]>item).forEach((itemValue:any) => {
					query.push(key + '[]=' + toQuery(itemValue));
				});
			} else {
				if(isNativeObject(item)) {
					item = JSON.stringify(item);
				}
				item = toQuery(item);
				query.push(key + '=' + (item === undefined ? '' : item));
			}
		}
	}
	return query.join('&');
}
/**
 * execute a get query
 * @param	options		xhr options, see interface
 * @return				promise resolved when the query is done
 */
export function get(options:xhrOptions):Deferred {
	(<xhrFinalOptions>options).method = method.GET;
	return xhr(<xhrFinalOptions>options);
}
/**
 * execute a post query
 * @param	options		xhr options, see interface
 * @return				promise resolved when the query is done
 */
export function post(options:xhrOptions):Deferred {
	(<xhrFinalOptions>options).method = method.POST;
	return xhr(<xhrFinalOptions>options);
}
/**
 * execute a del query
 * @param	options		xhr options, see interface
 * @return				promise resolved when the query is done
 */
export function del(options:xhrOptions):Deferred {
	(<xhrFinalOptions>options).method = method.DEL;
	return xhr(<xhrFinalOptions>options);
}
/**
 * execute a put query
 * @param	options		xhr options, see interface
 * @return				promise resolved when the query is done
 */
export function put(options:xhrOptions):Deferred {
	(<xhrFinalOptions>options).method = method.PUT;
	return xhr(<xhrFinalOptions>options);
}
