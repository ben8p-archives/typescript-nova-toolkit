var status: {[key: string]: number} = {
	// This means that the server has received the request headers, and that the client should proceed to send the request body (in the case of a request for which a body needs to be sent; for example, a POST request). If the request body is large, sending it to a server when a request has already been rejected based upon inappropriate headers is inefficient. To have a server check if the request could be accepted based on the request's headers alone, a client must send Expect: 100-continue as a header in its initial request and check if a 100 Continue status code is received in response before continuing (or receive 417 Expectation Failed and not continue).
	CONTINUE: 100,
	// This means the requester has asked the server to switch protocols and the server is acknowledging that it will do so.
	SWITCHING_PROTOCOLS: 101,
	// (WebDAV; RFC 2518)
	// As a WebDAV request may contain many sub-requests involving file operations, it may take a long time to complete the request. This code indicates that the server has received and is processing the request, but no response is available yet.[2] This prevents the client from timing out and assuming the request was lost.
	PROCESSING: 102,
	// Standard response for successful HTTP requests. The actual response will depend on the request method used. In a GET request, the response will contain an entity corresponding to the requested resource. In a POST request the response will contain an entity describing or containing the result of the action.
	OK: 200,
	// The request has been fulfilled and resulted in a new resource being created.
	CREATED: 201,
	// The request has been accepted for processing, but the processing has not been completed. The request might or might not eventually be acted upon, as it might be disallowed when processing actually takes place.
	ACCEPTED: 202,
	// The server successfully processed the request, but is returning information that may be from another source. (since HTTP/1.1)
	NON_AUTHORITATIVE_INFORMATION: 203,
	// The server successfully processed the request, but is not returning any content. Usually used as a response to a successful delete request.
	NO_CONTENT: 204,
	// The server successfully processed the request, but is not returning any content. Unlike a 204 response, this response requires that the requester reset the document view.
	RESET_CONTENT: 205,
	// The server is delivering only part of the resource (byte serving) due to a range header sent by the client. The range header is used by tools like wget to enable resuming of interrupted downloads, or split a download into multiple simultaneous streams.
	PARTIAL_CONTENT: 206,
	// (WebDAV; RFC 4918)
	// The message body that follows is an XML message and can contain a number of separate response codes, depending on how many sub-requests were made.[3]
	MULTI_STATUS: 207,
	// (WebDAV; RFC 5842)
	// The members of a DAV binding have already been enumerated in a previous reply to this request, and are not being included again.
	ALREADY_REPORTED: 208,
	// (RFC 3229)
	// The server has fulfilled a request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.[4]
	IM_USED: 226,
	// Indicates multiple options for the resource that the client may follow. It, for instance, could be used to present different format options for video, list files with different extensions, or word sense disambiguation.
	MULTIPLE_CHOICES: 300,
	// This and all future requests should be directed to the given URI.
	MOVED_PERMANENTLY: 301,
	// This is an example of industry practice contradicting the standard. The HTTP/1.0 specification (RFC 1945) required the client to perform a temporary redirect (the original describing phrase was "Moved Temporarily"),[5] but popular browsers implemented 302 with the functionality of a 303 See Other. Therefore, HTTP/1.1 added status codes 303 and 307 to distinguish between the two behaviours.[6] However, some Web applications and frameworks use the 302 status code as if it were the 303.[7]
	FOUND: 302,
	// (since HTTP/1.1)
	// The response to the request can be found under another URI using a GET method. When received in response to a POST (or PUT/DELETE), it should be assumed that the server has received the data and the redirect should be issued with a separate GET message.
	SEE_OTHER: 303,
	// Indicates that the resource has not been modified since the version specified by the request headers If-Modified-Since or If-None-Match. This means that there is no need to retransmit the resource, since the client still has a previously-downloaded copy.
	NOT_MODIFIED: 304,
	// (since HTTP/1.1)
	// The requested resource is only available through a proxy, whose address is provided in the response. Many HTTP clients (such as Mozilla[8] and Internet Explorer) do not correctly handle responses with this status code, primarily for security reasons.[9]
	USE_PROXY: 305,
	// No longer used. Originally meant "Subsequent requests should use the specified proxy."[10]
	SWITCH_PROXY: 306,
	// (since HTTP/1.1)
	// In this case, the request should be repeated with another URI; however, future requests should still use the original URI. In contrast to how 302 was historically implemented, the request method is not allowed to be changed when reissuing the original request. For instance, a POST request should be repeated using another POST request.[11]
	TEMPORARY_REDIRECT: 307,
	// (Experimental RFC; RFC 7238)
	// The request, and all future requests should be repeated using another URI. 307 and 308 (as proposed) parallel the behaviours of 302 and 301, but do not allow the HTTP method to change. So, for example, submitting a form to a permanently redirected resource may continue smoothly.[12]
	PERMANENT_REDIRECT: 308,
	// The request could not be understood by the server due to malformed syntax.
	BAD_REQUEST: 400,
	// Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided. The response must include a WWW-Authenticate header field containing a challenge applicable to the requested resource. See Basic access authentication and Digest access authentication.
	UNAUTHORIZED: 401,
	// Reserved for future use. The original intention was that this code might be used as part of some form of digital cash or micropayment scheme, but that has not happened, and this code is not usually used. YouTube uses this status if a particular IP address has made excessive requests, and requires the person to enter a CAPTCHA.[citation needed]
	PAYMENT_REQUIRED: 402,
	// The request was a valid request, but the server is refusing to respond to it. Unlike a 401 Unauthorized response, authenticating will make no difference.
	FORBIDDEN: 403,
	// The requested resource could not be found but may be available again in the future. Subsequent requests by the client are permissible.
	NOT_FOUND: 404,
	// A request was made of a resource using a request method not supported by that resource; for example, using GET on a form which requires data to be presented via POST, or using PUT on a read-only resource.
	METHOD_NOT_ALLOWED: 405,
	// The requested resource is only capable of generating content not acceptable according to the Accept headers sent in the request.
	NOT_ACCEPTABLE: 406,
	// The client must first authenticate itself with the proxy.
	PROXY_AUTHENTICATION_REQUIRED: 407,
	// The server timed out waiting for the request. According to HTTP specifications: "The client did not produce a request within the time that the server was prepared to wait. The client MAY repeat the request without modifications at any later time."
	REQUEST_TIMEOUT: 408,
	// Indicates that the request could not be processed because of conflict in the request, such as an edit conflict in the case of multiple updates.
	CONFLICT: 409,
	// Indicates that the resource requested is no longer available and will not be available again. This should be used when a resource has been intentionally removed and the resource should be purged. Upon receiving a 410 status code, the client should not request the resource again in the future. Clients such as search engines should remove the resource from their indices. [citation needed] Most use cases do not require clients and search engines to purge the resource, and a "404 Not Found" may be used instead.
	GONE: 410,
	// The request did not specify the length of its content, which is required by the requested resource.
	LENGTH_REQUIRED: 411,
	// The server does not meet one of the preconditions that the requester put on the request.
	PRECONDITION_FAILED: 412,
	// The request is larger than the server is willing or able to process.
	REQUEST_ENTITY_TOO_LARGE: 413,
	// The URI provided was too long for the server to process. Often the result of too much data being encoded as a query-string of a GET request, in which case it should be converted to a POST request.
	REQUEST_URI_TOO_LONG: 414,
	// The request entity has a media type which the server or resource does not support. For example, the client uploads an image as image/svg+xml, but the server requires that images use a different format.
	UNSUPPORTED_MEDIA_TYPE: 415,
	// The client has asked for a portion of the file (byte serving), but the server cannot supply that portion. For example, if the client asked for a part of the file that lies beyond the end of the file.
	REQUESTED_RANGE_NOT_SATISFIABLE: 416,
	// The server cannot meet the requirements of the Expect request-header field.
	EXPECTATION_FAILED: 417,
	// (RFC 2324)
	// This code was defined in 1998 as one of the traditional IETF April Fools' jokes, in RFC 2324, Hyper Text Coffee Pot Control Protocol, and is not expected to be implemented by actual HTTP servers.
	I_AM_A_TEAPOT: 418,
	// (not in RFC 2616)
	// Not a part of the HTTP standard, 419 Authentication Timeout denotes that previously valid authentication has expired. It is used as an alternative to 401 Unauthorized in order to differentiate from otherwise authenticated clients being denied access to specific server resources.[citation needed]
	AUTHENTICATION_TIMEOUT: 419,
	// (Spring Framework)
	// Not part of the HTTP standard, but defined by Spring in the HttpStatus class to be used when a method failed. This status code is deprecated by Spring.
	METHOD_FAILURE: 420,
	// (Twitter)
	// Not part of the HTTP standard, but returned by version 1 of the Twitter Search and Trends API when the client is being rate limited.[13] Other services may wish to implement the 429 Too Many Requests response code instead.
	ENHANCE_YOUR_CALM: 420,
	// (WebDAV; RFC 4918)
	// The request was well-formed but was unable to be followed due to semantic errors.[3]
	UNPROCESSABLE_ENTITY: 422,
	// (WebDAV; RFC 4918)
	// The resource that is being accessed is locked.[3]
	LOCKED: 423,
	// (WebDAV; RFC 4918)
	// The request failed due to failure of a previous request (e.g., a PROPPATCH).[3]
	FAILED_DEPENDENCY: 424,
	// The client should switch to a different protocol such as TLS/1.0.
	UPGRADE_REQUIRED: 426,
	// (RFC 6585)
	// The origin server requires the request to be conditional. Intended to prevent "the 'lost update' problem, where a client GETs a resource's state, modifies it, and PUTs it back to the server, when meanwhile a third party has modified the state on the server, leading to a conflict."[14]
	PRECONDITION_REQUIRED: 428,
	// (RFC 6585)
	// The user has sent too many requests in a given amount of time. Intended for use with rate limiting schemes.[14]
	TOO_MANY_REQUESTS: 429,
	// (RFC 6585)
	// The server is unwilling to process the request because either an individual header field, or all the header fields collectively, are too large.[14]
	REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
			// A Microsoft extension. Indicates that your session has expired.[15]
	LOGIN_TIMEOUT: 440,
	// Used in Nginx logs to indicate that the server has returned no information to the client and closed the connection (useful as a deterrent for malware).
	NO_RESPONSE: 444,
	// A Microsoft extension. The request should be retried after performing the appropriate action.[16]
	// Often search-engines or custom applications will ignore required parameters. Where no default action is appropriate, the Aviongoo website sends a "HTTP/1.1 449 Retry with valid parameters: param1, param2, . . ." response. The applications may choose to learn, or not.
	RETRY_WITH: 449,
	// A Microsoft extension. This error is given when Windows Parental Controls are turned on and are blocking access to the given webpage.[17]
	BLOCKED_BY_WINDOWS_PARENTAL_CONTROLS: 450,
	// Defined in the internet draft "A New HTTP Status Code for Legally-restricted Resources".[18] Intended to be used when resource access is denied for legal reasons, e.g. censorship or government-mandated blocked access. A reference to the 1953 dystopian novel Fahrenheit 451, where books are outlawed.[19]
	UNAVAILABLE_FOR_LEGAL_REASONS: 451,
	// (Microsoft)
	// Used in Exchange ActiveSync if there either is a more efficient server to use or the server cannot access the users' mailbox.[20]
	// The client is supposed to re-run the HTTP Autodiscovery protocol to find a better suited server.[21]
	REDIRECT: 451,
	// Nginx internal code similar to 431 but it was introduced earlier in version 0.9.4 (on January 21, 2011).[22][original research?]
	REQUEST_HEADER_TOO_LARGE: 494,
	// Nginx internal code used when SSL client certificate error occurred to distinguish it from 4XX in a log and an error page redirection.
	CERT_ERROR: 495,
	// Nginx internal code used when client didn't provide certificate to distinguish it from 4XX in a log and an error page redirection.
	NO_CERT: 496,
	// Nginx internal code used for the plain HTTP requests that are sent to HTTPS port to distinguish it from 4XX in a log and an error page redirection.
	HTTP_TO_HTTPS: 497,
	// (Esri) Returned by ArcGIS for Server. A code of 498 indicates an expired or otherwise invalid token.[23]
	TOKEN_EXPIRED: 498,
	TOKEN_INVALID: 498,
	// Used in Nginx logs to indicate when the connection has been closed by client while the server is still processing its request, making server unable to send a status code back.[24]
	CLIENT_CLOSED_REQUEST: 499,
	// (Esri) Returned by ArcGIS for Server. A code of 499 indicates that a token is required (if no token was submitted).[23]
	TOKEN_REQUIRED: 499,
	// A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.
	INTERNAL_SERVER_ERROR: 500,
	// The server either does not recognize the request method, or it lacks the ability to fulfil the request. Usually this implies future availability (e.g., a new feature of a web-service API).
	NOT_IMPLEMENTED: 501,
	// The server was acting as a gateway or proxy and received an invalid response from the upstream server.
	BAD_GATEWAY: 502,
	// The server is currently unavailable (because it is overloaded or down for maintenance). Generally, this is a temporary state.
	SERVICE_UNAVAILABLE: 503,
	// The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.
	GATEWAY_TIMEOUT: 504,
	// The server does not support the HTTP protocol version used in the request.
	HTTP_VERSION_NOT_SUPPORTED: 505,
	// (RFC 2295) Transparent content negotiation for the request results in a circular reference.[25]
	VARIANT_ALSO_NEGOTIATES: 506,
	// (WebDAV; RFC 4918) The server is unable to store the representation needed to complete the request.[3]
	INSUFFICIENT_STORAGE: 507,
	// (WebDAV; RFC 5842) The server detected an infinite loop while processing the request (sent in lieu of 208 Already Reported).
	LOOP_DETECTED: 508,
	// (Apache bw/limited extension)[26] This status code is not specified in any RFCs. Its use is unknown.
	BANDWIDTH_LIMIT_EXCEEDED: 509,
	// (RFC 2774) Further extensions to the request are required for the server to fulfil it.[27]
	NOT_EXTENDED: 510,
	// (RFC 6585) The client needs to authenticate to gain network access. Intended for use by intercepting proxies used to control access to the network (e.g., "captive portals" used to require agreement to Terms of Service before granting full Internet access via a Wi-Fi hotspot).[14]
	NETWORK_AUTHENTICATION_REQUIRED: 511,
	// (CloudFlare) This status code is not specified in any RFCs, but is used by CloudFlare's reverse proxies to signal an "unknown connection issue between CloudFlare and the origin web server" to a client in front of the proxy.
	ORIGIN_ERROR: 520,
	// CloudFlare) This status code is not specified in any RFCs, but is used by CloudFlare's reverse proxies to indicate that the origin webserver refused the connection.[28]
	WEB_SERVER_IS_DOWN: 521,
	// CloudFlare) This status code is not specified in any RFCs, but is used by CloudFlare's reverse proxies to signal that a server connection timed out.[29]
	CONNECTION_TIMED_OUT: 522,
	// CloudFlare) This status code is not specified in any RFCs, but is used by CloudFlare's reverse proxies to signal a resource that has been blocked by the administrator of the website or proxy itself.
	PROXY_DECLINED_REQUEST: 523,
	// CloudFlare) This status code is not specified in any RFCs, but is used by CloudFlare's reverse proxies to signal a network read timeout behind the proxy to a client in front of the proxy.
	A_TIMEOUT_OCCURRED: 524,
	// (Unknown) This status code is not specified in any RFCs, but is used by Microsoft HTTP proxies to signal a network read timeout behind the proxy to a client in front of the proxy.[citation needed]
	NETWORK_READ_TIMEOUT_ERROR: 598,
	// (Unknown) This status code is not specified in any RFCs, but is used by Microsoft HTTP proxies to signal a network connect timeout behind the proxy to a client in front of the proxy.[citation needed]
	NETWORK_CONNECT_TIMEOUT_ERROR: 599
};
export = status;
