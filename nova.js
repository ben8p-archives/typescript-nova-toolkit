/**
 * Nova's object
 * 
 * @author iDo (ido@woow-fr.com)
 * @license Paternité - Pas d'Utilisation Commerciale - Partage des Conditions Initiales à l'Identique 2.5 (http://creativecommons.org/licenses/by-nc-sa/2.5/deed.fr_CA)
 * @version 0.1
 * @fileoverview Framework javascript
 * Note 		: 
 *	 	Connect & Disconnect from John Resig (http://ejohn.org/projects/flexible-javascript-events/)
 * 		Convert froms domNode in url encoded string from Dojo tookit (http://dojotoolkit.org)
 * 		getElementsByAnything from Matthew Pennell (http://www.javascriptsearch.com/guides/Advanced/articles/0607ABetterDollarFunction.html)
 * 		UTF-8 <=> UTF-16 convertion from Masanao Izumo (iz@onicos.co.jp)
 * 		JavaScript to PHP serialize / unserialize class from Ma Bingyao (andot@ujn.edu.cn / http://www.coolcode.cn/?p=171)
 */

/**
 * Nova's object
 * @constructor
 */
var nova = new Object({
	version:01,
	/**
	 * Attach [type] event on [obj]
	 *  
	 * @param {Object} obj the object
	 * @param {String} type the type of connection ("click,"keyup",etc...)
	 * @param {function} methode the function to connect
	 */
	connect : function (obj,type,methode) {
		if ( obj.attachEvent ) {
			obj['e'+type+methode] = methode;
			obj[type+methode] = function(){obj['e'+type+methode]( window.event );}
			obj.attachEvent( 'on'+type, obj[type+methode] );
		} else
			obj.addEventListener(type, methode, false );
 	
	},
	/**
	 * Dettach [type] event from [obj]
	 *  
	 * @param {Object} obj the object
	 * @param {String} type the type of connection ("click,"keyup",etc...)
	 * @param {function} methode the function to disconnect
	 */
	disconnect : function (obj,type,methode) {
		if ( obj.detachEvent ) {
			obj.detachEvent( 'on'+type, obj[type+methode] );
			obj[type+methode] = null;
		} else
			obj.removeEventListener( type, methode, false );
	},
	/**
	 * clone a JS object
	 * 
	 * @constructor
	 * @param {Object} what the object you want to clone
	 * @param {bool} rec toggle recursivity
	 */
	clone:function (what,rec) {
	    for (var i in what) {
	       if ((rec) && (typeof what[i]=="object"))
	           this[i] = new objClone(what[i],true);
	       else
	           this[i] = what[i];
	    }
	},
	/**
	 * like classical setTimeOut but preserv context
	 * @param {Function} fn the function you want to delay
	 * @param {Object} delay the delay
	 * @param {Object} _this the context you want to have in this
	 */
	setTimeOut:function(fn, delay,_this) {
		args=nova.variable.object.toArray(arguments,false);
		args.shift();
		args.shift();
		args.shift();	
		window.setTimeout(function () { 
			fn.apply(_this, args); 
		}, delay);
	},
});

/**
 * Nova's config namespace
 * @constructor
 */
nova.config = {
	isDebug:true,	
	firebug:(console && console.log)?true:false,
	/**
	 * toggle debug mode
	 * 
	 * @param {Bool} bool put debug on true or false
	 */
	debug:function(bool) {
		nova.config.isDebug=bool;
	}
	
},

/**
 * Nova's html namespace
 * @constructor
 */
nova.html = {
	/**
	 * Add a class on object
	 * 
	 * @param {Object} obj your object
	 * @param {String} classN the class you want to add
	 */
	addClass : function (obj,classN) {
		obj.className+=" "+classN;
	},
	/**
	 * Check if an object has (or not) a class
	 * 
	 * @param {Object} obj your object
	 * @param {String} classN the class you want to check
	 * @return {Bool} true if class exist
	 */
	hasClass : function (obj,classN) {
		var r=new RegExp(classN,"");
		var matc=obj.className.match(r);
		if (matc==null)
			return false;
		return true;
	},
	/**
	 * Remove a class on object
	 * 
	 * @param {Object} obj your object
	 * @param {String} classN the class you want to remove
	 */
	removeClass: function (obj,classN) {
		var r=new RegExp(classN,"");
		obj.className=obj.className.replace(r,'');
	},
	/**
	 * Replace all class by another on object
	 * 
	 * @param {Object} obj your object
	 * @param {String} classN the classes you want to set
	 */
	setClass: function (obj,classN) {
		obj.className=classN;
	},
	/**
	 * toggle a class on object
	 * 
	 * @param {Object} obj your object
	 * @param {String} classN the class you want to toggle
	 */
	toggleClass: function (obj,classN) {
		if (this.hasClass(obj,classN))
			this.removeClass(obj,classN);
		else
			this.addClass(obj,classN);
	},
	/**
	 * get Dom elements by anything (name,tagname,id,class,selector,....)
	 * Can have much than one parameters
	 * 
	 * @param {String} mixed Selectors (#myid, div>ul>li, .myclass, ...)
	 * @return {Array || Object} An array with all matching objects or just one objects (if no more)
	 */
	getElementsByAnything:function () {
		var elements = new Array();
		for (var i=0,len=arguments.length;i<len;i++) {
			var element = arguments[i];
			if (typeof element == 'string') {
				var matched = document.getElementById(element);
				if (matched) {
					elements.push(matched);
				} else {
					var allels = (document.all) ? document.all : document.getElementsByTagName('*');
					var regexp = new RegExp('(^| )'+element+'( |$)');
					for (var i=0,len=allels.length;i<len;i++) if (regexp.test(allels[i].className)) elements.push(allels[i]);
				}
				if (!elements.length) elements = document.getElementsByTagName(element);
				if (!elements.length) {
					elements = new Array();
					var allels = (document.all) ? document.all : document.getElementsByTagName('*');
					for (var i=0,len=allels.length;i<len;i++) if (allels[i].getAttribute(element)) elements.push(allels[i]);
				}
				if (!elements.length) {
					var allels = (document.all) ? document.all : document.getElementsByTagName('*');
					for (var i=0,len=allels.length;i<len;i++) if (allels[i].attributes) for (var j=0,lenn=allels[i].attributes.length;j<lenn;j++) if (allels[i].attributes[j].specified) if (allels[i].attributes[j].nodeValue == element) elements.push(allels[i]);
				}
				} else {
					elements.push(element);
				}
		}
		if (elements.length == 1) {
			return elements[0];
		} else {
			return elements;
		}
	},
	/**
	 * Return the Dom offset for an object
	 * 
	 * @param {Object} Obj your object 
	 * @param {String} Prop the offset you want to know (left,top,height,width...)
	 * @return {Int} The dom offset 
	 */
	getDomOffset:function (Obj,Prop) {
		var iVal = 0;
		while (Obj && Obj.tagName != 'BODY') {
			eval('iVal += Obj.' + Prop + ';');
			Obj = Obj.offsetParent;
		}
		return iVal;
	},
	/**
	 * Return an obejct with the viewport size
	 * 
	 * @return {Object} like {width:xxx, height:yyy}
	 */
	viewportSize:function () {
		if( typeof( window.innerWidth ) == 'number' )
			return {width : window.innerWidth,height : window.innerHeight };
		else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) )
			return {width : document.documentElement.clientWidth,height : document.documentElement.clientHeight };
		else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) )
			return {width : document.body.clientWidth,height : document.body.clientHeight };
	},
	/**
	 * Place an object on viewport's center
	 * 
	 * @param {Object} obj you dom object
	 */
	centerObjectOnViewport : function (obj) {
		vpSize=nova.html.viewportSize();
		objSize= {width:obj.offsetWidth,height:obj.offsetHeight};
		obj.style.position="absolute";
		obj.style.left=(vpSize.width-(vpSize.width/2)-(objSize.width/2))+"px";
		obj.style.top=(vpSize.height-(vpSize.height/2)-(objSize.height/2))+"px";
	}
};
/**
 * Nova's variable namespace
 * @constructor
 */
nova.variable = {
	/**
	 * Return false if [valeur] isn't in [array] else return index
	 * 
	 * @param {Array} array your array to check
	 * @param {String} value the value to search
	 * @return {False || Int} dont forget use ===false to prevent 0 index
	 */
	inArray : function(array,value) {
		for (var i in array) { if (array[i] == value) return i;}
		return false;
	},
	/**
	 * Check if [v] is an Array
	 * 
	 * @param {Mixed} v your variable
	 * @return {bool} true or false
	 */
	isArray:function (v) {
		return (typeof(v)=="array")?true:false;
	},
	/**
	 * Check if [v] is a function
	 * 
	 * @param {Mixed} v your variable
	 * @return {bool} true or false
	 */
	isFunction:function(v) {
		return (typeof(v)=="function")?true:false;
	},
	/**
	 * Check if arguments[0] is defined
	 * 
	 * @param {Mixed} mixed your variable
	 * @return {bool} true or false
	 */
	isSet:function() {
		return ((!arguments[0]) || (typeof(arguments[0])=="undefined") || (arguments[0]==null) || (arguments[0]=="undefined"))?false:true;
	},
	/**
	 * Check if [v] is a String
	 * 
	 * @param {Mixed} v your variable
	 * @return {bool} true or false
	 */
	isString:function(v) {
		return (typeof(v)=="string")?true:false;
	},
	/**
	 * Check if [v] is an Object
	 * 
	 * @param {Mixed} v your variable
	 * @return {bool} true or false
	 */
	isObject:function (v) {
		return (typeof(v)=="object")?true:false;
	},
	
	/**
	 * Convert data from utf16 to utf8
	 * 
	 * @param {String} str your utf16 string
	 * @return {String} new utf8 string
	 */
	utf16to8:function(str) {
	    var out, i, len, c;
	    out = "";
	    len = str.length;
	    for(i = 0; i < len; i++) {
			c = str.charCodeAt(i);
			if ((c >= 0x0001) && (c <= 0x007F))
		    	out += str.charAt(i);
			else if (c > 0x07FF) {
		    	out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
		    	out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
		    	out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
			} else {
		    	out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
		    	out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
			}
	    }
	    return out;
	},	
	/**
	 * Convert data from utf8 to utf16
	 * 
	 * @param {String} str your utf8 string
	 * @return {String} new utf16 string
	 */
	utf8to16:function (str) {
	    var out, i, len, c;
	    var char2, char3;
	    out = "";
	    len = str.length;
	    i = 0;
	    while(i < len) {
			c = str.charCodeAt(i++);
			switch(c >> 4) { 
				case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
				    // 0xxxxxxx
				    out += str.charAt(i-1);
				    break;
				case 12: case 13:
				    // 110x xxxx   10xx xxxx
				    char2 = str.charCodeAt(i++);
				    out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
				    break;
				case 14:
				    // 1110 xxxx  10xx xxxx  10xx xxxx
				    char2 = str.charCodeAt(i++);
				    char3 = str.charCodeAt(i++);
				    out += String.fromCharCode(((c & 0x0F) << 12) |
								   ((char2 & 0x3F) << 6) |
								   ((char3 & 0x3F) << 0));
				    break;
			}
	    }
	    return out;
	},
	
	/**
	 * This class is designed to convert javascript variables to php with a php serialize
	 * compatible way.
	 * 
	 * @param {Mixed} o what you want to serialize
	 * @return {string} the serialized string
	 */
	serialize:function (o) {
	    var p = 0, sb = [], ht = [], hv = 1;
	    var classname = function(o) {
	        if (typeof(o) == "undefined" || typeof(o.constructor) == "undefined") return '';
	        var c = o.constructor.toString();
	        c = nova.variable.utf16to8(c.substr(0, c.indexOf('(')).replace(/(^\s*function\s*)|(\s*$)/ig, ''));
	        return ((c == '') ? 'Object' : c);
	    };
	    var is_int = function(n) {
	        var s = n.toString(), l = s.length;
	        if (l > 11) return false;
	        for (var i = (s.charAt(0) == '-') ? 1 : 0; i < l; i++) {
	            switch (s.charAt(i)) {
	                case '0':
	                case '1':
	                case '2':
	                case '3':
	                case '4':
	                case '5':
	                case '6':
	                case '7':
	                case '8':
	                case '9': break;
	                default : return false;
	            }
	        }
	        return !(n < -2147483648 || n > 2147483647);
	    };
	    var in_ht = function(o) {
	        for (k in ht) if (ht[k] === o) return k;
	        return false;
	    };
	    var ser_null = function() {
	        sb[p++] = 'N;';
	    };
	    var ser_boolean = function(b) {
	        sb[p++] = (b ? 'b:1;' : 'b:0;');
	    };
	    var ser_integer = function(i) {
	        sb[p++] = 'i:' + i + ';';
	    };
	    var ser_double = function(d) {
	        if (isNaN(d)) d = 'NAN';
	        else if (d == Number.POSITIVE_INFINITY) d = 'INF';
	        else if (d == Number.NEGATIVE_INFINITY) d = '-INF';
	        sb[p++] = 'd:' + d + ';';
	    };
	    var ser_string = function(s) {
	        var utf8 = nova.variable.utf16to8(s);
	        sb[p++] = 's:' + utf8.length + ':"';
	        sb[p++] = utf8;
	        sb[p++] = '";';
	    };
	    var ser_array = function(a) {
	        sb[p++] = 'a:';
	        var lp = p;
	        sb[p++] = 0;
	        sb[p++] = ':{';
	        for (var k in a) {
	            if (typeof(a[k]) != 'function') {
	                is_int(k) ? ser_integer(k) : ser_string(k);
	                __serialize(a[k]);
	                sb[lp]++;
	            }
	        }
	        sb[p++] = '}';
	    };
	    var ser_object = function(o) {
	        var cn = classname(o);
	        if (cn == '') ser_null();
	        else if (typeof(o.serialize) != 'function') {
	            sb[p++] = 'O:' + cn.length + ':"';
	            sb[p++] = cn;
	            sb[p++] = '":';
	            var lp = p;
	            sb[p++] = 0;
	            sb[p++] = ':{';
	            if (typeof(o.__sleep) == 'function') {
	                var a = o.__sleep();
	                for (var kk in a) {
	                    ser_string(a[kk]);
	                    __serialize(o[a[kk]]);
	                    sb[lp]++;
	                }
	            }
	            else {
	                for (var k in o) {
	                    if (typeof(o[k]) != 'function') {
	                        ser_string(k);
	                        __serialize(o[k]);
	                        sb[lp]++;
	                    }
	                }
	            }
	            sb[p++] = '}';
	        }
	        else {
	            var cs = o.serialize();
	            sb[p++] = 'C:' + cn.length + ':"';
	            sb[p++] = cn;
	            sb[p++] = '":' + cs.length + ':{';
	            sb[p++] = cs;
	            sb[p++] = "}";
	        }
	    };
	    var ser_pointref = function(R) {
	        sb[p++] = "R:" + R + ";";
	    };
	    var ser_ref = function(r) {
	        sb[p++] = "r:" + r + ";";
	    };
	    var __serialize = function(o) {
	        if (o == null || o.constructor == Function) {
	            hv++;
	            ser_null();
	        }
	        else switch (o.constructor) {
	            case Boolean: {
	                hv++;
	                ser_boolean(o);
	                break;
	            }
	            case Number: {
	                hv++;
	                is_int(o) ? ser_integer(o) : ser_double(o);
	                break;
	            }
	            case String: {
	                hv++;
	                ser_string(o);
	                break;
	            }
	            case Array: {
	                var r = in_ht(o);
	                if (r) {
	                    ser_pointref(r);
	                }
	                else {
	                    ht[hv++] = o;
	                    ser_array(o);
	                }
	                break;
	            }
	            default: {
	                var r = in_ht(o);
	                if (r) {
	                    hv++;
	                    ser_ref(r);
	                }
	                else {
	                    ht[hv++] = o;
	                    ser_object(o);
	                }
	                break;
	            }
	        }
	    };
	    __serialize(o);
	    return sb.join('');
	},
	/**
	 * This class is designed to convert php variables to javascript with a php unserialize
	 * compatible way.
	 * 
	 * @param {String} ss what you want to unserialize
	 * @return {Mixed}
	 */
	unserialize:function (ss) {
	    var p = 0, ht = [], hv = 1; r = null;
	    var unser_null = function() {
	        p++;
	        return null;
	    };
	    var unser_boolean = function() {
	        p++;
	        var b = (ss.charAt(p++) == '1');
	        p++;
	        return b;
	    };
	    var unser_integer = function() {
	        p++;
	        var i = parseInt(ss.substring(p, p = ss.indexOf(';', p)));
	        p++;
	        return i;
	    };
	    var unser_double = function() {
	        p++;
	        var d = ss.substring(p, p = ss.indexOf(';', p));
	        switch (d) {
	            case 'NAN': d = NaN; break;
	            case 'INF': d = Number.POSITIVE_INFINITY; break;
	            case '-INF': d = Number.NEGATIVE_INFINITY; break;
	            default: d = parseFloat(d);
	        }
	        p++;
	        return d;
	    };
	    var unser_string = function() {
	        p++;
	        var l = parseInt(ss.substring(p, p = ss.indexOf(':', p)));
	        p += 2;
	        var s = nova.variable.utf8to16(ss.substring(p, p += l));
	        p += 2;
	        return s;
	    };
	    var unser_array = function() {
	        p++;
	        var n = parseInt(ss.substring(p, p = ss.indexOf(':', p)));
	        p += 2;
	        var a = [];
	        ht[hv++] = a;
	        for (var i = 0; i < n; i++) {
	            var k;
	            switch (ss.charAt(p++)) {
	                case 'i': k = unser_integer(); break;
	                case 's': k = unser_string(); break;
	                case 'U': k = unser_unicode_string(); break;
	                default: return false;
	            }
	            a[k] = __unserialize();
	        }
	        p++;
	        return a;
	    };
	    var unser_object = function() {
	        p++;
	        var l = parseInt(ss.substring(p, p = ss.indexOf(':', p)));
	        p += 2;
	        var cn = nova.variable.utf8to16(ss.substring(p, p += l));
	        p += 2;
	        var n = parseInt(ss.substring(p, p = ss.indexOf(':', p)));
	        p += 2;
	        if (eval(['typeof(', cn, ') == "undefined"'].join(''))) {
	            eval(['function ', cn, '(){}'].join(''));
	        }
	        var o = eval(['new ', cn, '()'].join(''));
	        ht[hv++] = o;
	        for (var i = 0; i < n; i++) {
	            var k;
	            switch (ss.charAt(p++)) {
	                case 's': k = unser_string(); break;
	                case 'U': k = unser_unicode_string(); break;
	                default: return false;
	            }
	            if (k.charAt(0) == '\0') {
	                k = k.substring(k.indexOf('\0', 1) + 1, k.length);
	            }
	            o[k] = __unserialize();
	        }
	        p++;
	        if (typeof(o.__wakeup) == 'function') o.__wakeup();
	        return o;
	    };
	    var unser_custom_object = function() {
	        p++;
	        var l = parseInt(ss.substring(p, p = ss.indexOf(':', p)));
	        p += 2;
	        var cn = nova.variable.utf8to16(ss.substring(p, p += l));
	        p += 2;
	        var n = parseInt(ss.substring(p, p = ss.indexOf(':', p)));
	        p += 2;
	        if (eval(['typeof(', cn, ') == "undefined"'].join(''))) {
	            eval(['function ', cn, '(){}'].join(''));
	        }
	        var o = eval(['new ', cn, '()'].join(''));
	        ht[hv++] = o;
	        if (typeof(o.unserialize) != 'function') p += n;
	        else o.unserialize(ss.substring(p, p += n));
	        p++;
	        return o;
	    };
	    var unser_unicode_string = function() {
	        p++;
	        var l = parseInt(ss.substring(p, p = ss.indexOf(':', p)));
	        p += 2;
	        var sb = [];
	        for (var i = 0; i < l; i++) {
	            if ((sb[i] = ss.charAt(p++)) == '\\') {
	                sb[i] = String.fromCharCode(parseInt(ss.substring(p, p += 4), 16));
	            }
	        }
	        p += 2;
	        return sb.join('');
	    };
	    var unser_ref = function() {
	        p++;
	        var r = parseInt(ss.substring(p, p = ss.indexOf(';', p)));
	        p++;
	        return ht[r];
	    };
	    var __unserialize = function() {
	        switch (ss.charAt(p++)) {
	            case 'N': return ht[hv++] = unser_null();
	            case 'b': return ht[hv++] = unser_boolean();
	            case 'i': return ht[hv++] = unser_integer();
	            case 'd': return ht[hv++] = unser_double();
	            case 's': return ht[hv++] = unser_string();
	            case 'U': return ht[hv++] = unser_unicode_string();
	            case 'r': return ht[hv++] = unser_ref();
	            case 'a': return unser_array();
	            case 'O': return unser_object();
	            case 'C': return unser_custom_object();
	            case 'R': return unser_ref();
	            default: return false;
	        }
	    };
	    return __unserialize();
	},
	/**
	 * Array subnamespace
	 * 
	 * @constructor
	 */
	array: {
		/**
		 * Insert [value] at [i] position in [array]
		 * 
		 * @param {Array} array your array
		 * @param {Int} i the insert index
		 * @param {Mixed} value what you want to insert
		 * @return {Array} the new array
		 */
		insert:function(array,i,value){
			if(i>=0){
				var a=array.slice(),b=a.splice(i);
				a[i]=value;
				return a.concat(b);
			}
		},
	},
	/**
	 * Object subnamespace
	 * 
	 * @constructor
	 */
	object: {
		/**
		 * Convert a simple object in Array object
		 * 
		 * @param {Object} obj your object
		 * @param {Bool} preserveKey set at true if you want to conserve properties name
		 * @return {Array}
		 */
		toArray:function(obj,preserveKey) {
			var r=[];
			if (!nova.variable.isObject(obj))
				return obj;
			if (preserveKey)
				for (var i in obj)
					r[i]=(nova.variable.isObject(obj[i]))?new nova.clone(obj[i],true):obj[i];
			else
				for (i=0;i<obj.length;i++)
					r[i]=(nova.variable.isObject(obj[i]))?new nova.clone(obj[i],true):obj[i];
			return r;
		},
	},
};

/**
 * Nova's topic namespace
 * @constructor
 */
nova.topic = {
	evts:[],
	/**
	 * Defined a new topic
	 * 
	 * @param {String} name name of the new topic
	 * @param {Function} action function to do when topic is published
	 */
	subscribe : function (name,action) {
		this.evts[name]=action;
	},
	/**
	 * Remove a topic
	 * 
	 * @param {String} name the name of the topic you want to delete
	 */
	unsubscribe :function (name) {
		delete this.evts[name];
	},
	/**
	 * Publish a new event on specified topic.
	 * Give [_this] for context use
	 * 
	 * @param {String} name the name of the topic you want to publish
	 * @param {Object} _this the context you want to pass to you topic
	 * @return {Bool}
	 */
	publish :function (name,_this) {
		if (!nova.variable.isSet(_this))
			return nova.debug.raiseError("publish need 2 agrs");
		if (!nova.variable.isSet(this.evts[name]))
			return nova.debug.raiseError("publish a non existing topic");
				
		args=nova.variable.object.toArray(arguments,false);
		args.shift();
		args.shift();
		this.evts[name].apply(_this,args);
		return true;
	},
};
/**
 * Nova's debug namespace
 * @constructor
 */
nova.debug = { 
	/**
	 * Show a dump of [v] in firebug
	 * 
	 * @param {Mixed} v the dumped variable
	 */
	var_dump:function(v) {
		if ((!nova.config.firebug) || (!nova.config.isDebug)) return false;
		try {
			console.log(typeof(v),v);
			if ((nova.variable.isArray(v)) || (nova.variable.isObject(v))) {
				for (i in v)
					console.log('	(',typeof(v[i]),") ",i," : ",v[i]);
			}
		}
		catch(ex) { nova.debug.raiseError("var_dump error"); }
	},
	/**
	 * Show a debug message
	 * 
	 * @param {Mixed} whant to want to see in firebug
	 */
	show:function() {
		if ((!nova.config.firebug) || (!nova.config.isDebug)) return false;
		console.log.apply(console, arguments);
	},
	/**
	 * Raise a debug message
	 * 
	 * @param {String} msg your error message
	 * @return {Bool} always false
	 */
	raiseError:function(msg) {
		if ((!nova.config.firebug) || (!nova.config.isDebug)) return false;
		console.log("Error :",msg);
		return false;
	}
};

/**
 * Nova's IN/OUT namespace
 * @constructor
 */
nova.io = {
	/**
	 * Send an XHR request
	 * 
	 * <code>
	 *  args {
	 * 		file:"page.htm",
	 * 		method:"POST" || "GET",
	 * 		queryString:"var1=a&var2=b",
	 * 		formNode:document.getElementById("test"),
	 * 		onLoad:function () {},
	 * 		onError:function () {}
	 * }
	 * </code>
	 * 
	 * @param {Object} args see exemple
	 * @return {Bool} false if browser doesn't support XHR 
	 */
	send:function(args) {
		var xhr_object = null;
		if(window.XMLHttpRequest) // Firefox
		   xhr_object = new XMLHttpRequest();
		else if(window.ActiveXObject) // Internet Explorer
		   xhr_object = new ActiveXObject("Microsoft.XMLHTTP");
		else
		   return nova.debug.raiseError("Error : undefined XMLHTTPRequest...");
		
		if (!nova.variable.isSet(args.queryString))
			args.queryString="";
		
		if (nova.variable.isObject(args.formNode))
			args.queryString+=nova.form.encode(args.formNode);
		
		if(args.method.toUpperCase() == "GET" && args.queryString != null) { 
		   args.file += "?"+args.queryString; 
		   args.queryString = ""; 
		}
		if (args.queryString=="") args.queryString=null;
		
		xhr_object.open(args.method, args.file, true);
		xhr_object.args=args;
		xhr_object.onreadystatechange = function() {
			if(xhr_object.readyState == 4) {
				var args=xhr_object.args;
				delete xhr_object.args;
				if(xhr_object.status  == 200) 
                	return args.onLoad(xhr_object.responseText,args); 
            	else {
                 	args.onError(xhr_object.status,args);
					return nova.debug.raiseError("io error :"+xhr_object.status);
				} 
			}
		}
		if(args.method.toUpperCase() == "POST")
		   xhr_object.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr_object.send(args.queryString);
		return true;
	},
};

/**
 * Nova's forms namespace
 * @constructor
 */
nova.form= {
	/**
	 * Convert froms domNode in url encoded string
	 * 
	 * @param {Object} formNode Dom form object
	 * @return {String} URI string
	 */
	encode : function(formNode){
		/*from dojo toolkit*/
		if((!formNode)||(!formNode.tagName)||(!formNode.tagName.toLowerCase() == "form"))
			nova.debug.raiseError("Attempted to encode a non-form element.");
		
		var enc = encodeURIComponent ;
		var values = [];
	
		for(var i = 0; i < formNode.elements.length; i++){
			var elm = formNode.elements[i];
			if(!elm || elm.tagName.toLowerCase() == "fieldset") { continue; }
			var name = enc(elm.name);
			var type = elm.type.toLowerCase();
	
			if(type == "select-multiple"){
				for(var j = 0; j < elm.options.length; j++){
					if(elm.options[j].selected)
						values.push(name + "=" + enc(elm.options[j].value));
				}
			}else if(nova.variable.inArray(["radio", "checkbox"], type)){
				if(elm.checked)
					values.push(name + "=" + enc(elm.value));
			}else
				values.push(name + "=" + enc(elm.value));
		}
	
		// now collect input type="image", which doesn't show up in the elements array
		var inputs = formNode.getElementsByTagName("input");
		for(var i = 0; i < inputs.length; i++) {
			var input = inputs[i];
			if(input.type.toLowerCase() == "image" && input.form == formNode) {
				var name = enc(input.name);
				values.push(name + "=" + enc(input.value));
				values.push(name + ".x=0");
				values.push(name + ".y=0");
			}
		}
		return values.join("&") + "&";
	},
	/**
	 * Validation's form subnamespace
	 *  
	 *  Ajouter une contrainte a un champs (le 3eme parametre pointe sur une fonction)
	 * Le parametre de la fonction (3eme arguments) est le contenu du champs désigné
	 * Applique la classe .constraint
	 *  nova.form.validation.connect(document.getElementById('pseudo'), 'constraint',function() { if (arguments[0].length==3) return true; else return false;});
	 *  
	 * Forcer la selection complete du contenu
	 * 	nova.form.validation.connect(document.getElementById('pseudo'), 'selectall');
	 * 
	 * Verifie que le contenu est bien un nombre
	 * Applique la classe .isnum
	 * 	nova.form.validation.connect(document.getElementById('mdp'), 'isnum');
	 * 
	 * Verifie que le contenu est bien un nombre entier
	 * Applique la classe .isint
	 * 	nova.form.validation.connect(document.getElementById('mdp'), 'isint');
	 * 
	 * Verifie que le contenu est bien du type alphabetique
	 * Applique la classe .isalpha
	 * 	nova.form.validation.connect(document.getElementById('mdp'), 'isalpha');
	 * 
	 * Verifie que le contenu est bien du type alphanumérique
	 * Applique la classe .isalphanum
	 * 	nova.form.validation.connect(document.getElementById('mdp'), 'isalphanum');
	 * 
	 * Verifie que le contenu est bien du type email
	 * Applique la classe .ismail
	 * 	nova.form.validation.connect(document.getElementById('eml'), 'ismail')
	 * 
	 * Rendre un champs obligatoire
	 * Applique la classe .mendatory
	 * 	nova.form.validation.connect(document.getElementById('mdp'), 'mendatory');
	 * 
	 * Verifier la complexité d'un mot de passe
	 * Applique un style qui modifie la couleur de fond de l'input
	 * 	nova.form.validation.connect(document.getElementById('mdp'), 'complexity');
	 * 
	 * Vérifier qu'un champs est la copie d'un autre (le 3eme argument designe un objet)
	 * Applique la classe .copyof
	 * 	nova.form.validation.connect(document.getElementById('mdpverif'), 'copyof',document.getElementById('mdp'));
	 * 
	 * Vérifier qu'un champs correspond bien a une expression réguliere
	 * Applique la classe .matchregexp
	 * 	nova.form.validation.connect(document.getElementById('mdpverif'), 'matchregexp',/[a-zA-Z]/);
	 * 
	 * Verifier qu'un formulaire est valide (le 3eme parametre est facultatif et point sur une fonction)
	 * Le parametre de la fonction (3eme arguments) est un tableau qui contient les champs en erreur
	 * 	nova.form.validation.connect(document.getElementById('adduser'), 'validate',function() {alert("erreur !")});
	 * 
	 * Rafraichi tous les evenements connecté a un objet
	 *  document.getElementById('mdpverif').refresh();
	 *  
	 * Pour Deconnecter un evenement d'un objet, utiliser la même syntaxe que pour le connecter mais avec le mot disconnect.
	 *  nova.form.validation.disconnect(document.getElementById('adduser'), 'validate',function() {alert("erreur !")});
	 *  
	 * ------------------------------------------------------
	 * Exemple :
	 * <code>
 	<style type="text/css">input.mendatory,input.constraint,input.copyof,input.isnum,input.isint,input.isalpha,input.isalphanum,input.matchregexp {background-color:red;}</style>
 	<form method="post" action="" id="adduser">
			<fieldset>
				<legend>Inscription</legend>
				<label> Pseudo : </label><input type="text" name="pseudo" id="pseudo" /><br />
				<label> Mot de passe : </label><input type="password" name="mdp" id="mdp" /><br />
				<label> Confirmation : </label><input type="password" name="mdpverif" id="mdpverif" /><br />
				<input type="submit" value="ok" />
				
				<input type="button" value="disconnect" onclick="test();" />
				<input type="button" value="refresh" onclick="test2();" />
			</fieldset>
		</form>
		<script type="text/javascript">
			nova.form.validation.connect(document.getElementById('pseudo'), 'constraint',function() { if (arguments[0].length==3) return true; else return false;});
			nova.form.validation.connect(document.getElementById('pseudo'), 'selectall');
			
			nova.form.validation.connect(document.getElementById('mdp'), 'selectall');
			nova.form.validation.connect(document.getElementById('mdp'), 'mendatory');
			nova.form.validation.connect(document.getElementById('mdp'), 'complexity');
			
			nova.form.validation.connect(document.getElementById('mdpverif'), 'selectall');
			nova.form.validation.connect(document.getElementById('mdpverif'), 'copyof',document.getElementById('mdp'));
			
			nova.form.validation.connect(document.getElementById('adduser'), 'validate',function() {console.log(arguments[0].length);for (i=0;i!=arguments[0].length;i++) {console.log("erreur :"+arguments[0][i]);}});
			
			function test() {
				nova.form.validation.disconnect(document.getElementById('pseudo'), 'constraint');
				nova.form.validation.disconnect(document.getElementById('mdp'), 'selectall');
				nova.form.validation.disconnect(document.getElementById('mdp'), 'mendatory');
				nova.form.validation.disconnect(document.getElementById('mdp'), 'complexity');
			}
			function test2() {
				document.getElementById('mdp').value="plop";
				document.getElementById('mdp').refresh();
			}
			
		</script>
	 * </code>
	 * @constructor
	 */
	validation : {
		/**
		 * @private
		 * events type (like "click","keyup",...)
		 */
		type : "",
		/**
		 * @private
		 * Object to validate
		 */
		obj:null,
		/**
		 * @private
		 * Hash of connected object
		 */
		elements:new Array(),
		/**
		 * @private
		 * Check complexity on a string.
		 * Apply style background
		 */	
		check:function () {
			var score=0;
			var match;
			
			_this=this;
			if (arguments[0].fromRefresh)
				_this=arguments[0];
			else if (arguments[0].fromConnect) {
				_this=arguments[0];
				_this.o_backgroundColor=_this.style.backgroundColor;
			} else if (arguments[0].fromDisconnect) {
				_this=arguments[0];
				_this.style.backgroundColor=_this.o_backgroundColor;
				return;
			}
	 
			match = new RegExp("[a-z]+","");
			if (match.test(_this.value))
				score+=1;
			
			match = new RegExp("[A-Z]+","");
			if (match.test(_this.value))
				score+=1;
			
			match = new RegExp("[0-9]+","");
			if (match.test(_this.value))
				score+=1;
			
			match = new RegExp("[^A-Za-z0-9]+","");
			if (match.test(_this.value))
				score+=1;
		
			score+=_this.value.length/15;
		
			if (score>5) score=5;
			
			_this.style.backgroundColor='rgb('+Math.round(255-((score*255)/5))+','+Math.round((score*255)/5)+',0)';
	 
		},
		/**
		 * @private
		 * Check if value of connected object is a numeric
		 * Apply isNum class
		 */
		isNum : function () {
			_this=this;
		
			if ((arguments[0].fromConnect) || (arguments[0].fromRefresh)) {
				_this=arguments[0];
			} else if (arguments[0].fromDisconnect) {
				_this=arguments[0];
				_this.inErrors['isNum']=false;
				_this.className=_this.className.replace(/ *isnum/,'');
				return;
			}			
			
			_this.inErrors['isNum']=false;
			_this.className=_this.className.replace(/ *isnum/,'');
			if (isNaN(_this.value)) {
				_this.className+=' isnum';
				_this.inErrors['isNum']=true;
			}	
		},
		/**
		 * @private
		 * Check if value of connected object is an integer
		 * Apply isInt class
		 */
		isInt : function () {
			_this=this;
		
			if ((arguments[0].fromConnect) || (arguments[0].fromRefresh)) {
				_this=arguments[0];
			} else if (arguments[0].fromDisconnect) {
				_this=arguments[0];
				_this.inErrors['isInt']=false;
				_this.className=_this.className.replace(/ *isint/,'');
				return;
			}
				
			_this.inErrors['isInt']=false;
			_this.className=_this.className.replace(/ *isint/,'');
			var matc=_this.value.match(/^[0-9]+$/);
			if ((_this.value!="") && (matc==null)) {
				_this.className+=' isint';
				_this.inErrors['isInt']=true;
			}	
		},
		/**
		 * @private
		 * Check if value of connected object is an email
		 * Apply isMail class
		 */
		isMail : function () {
			_this=this;
		
			if ((arguments[0].fromConnect) || (arguments[0].fromRefresh)) {
				_this=arguments[0];
			} else if (arguments[0].fromDisconnect) {
				_this=arguments[0];
				_this.inErrors['isMail']=false;
				_this.className=_this.className.replace(/ *ismail/,'');
				return;
			}
				
			_this.inErrors['isMail']=false;
			_this.className=_this.className.replace(/ *ismail/,'');
			var matc=_this.value.match(/^.+\@.+\..+$/);
			if ((_this.value!="") && (matc==null)) {
				_this.className+=' ismail';
				_this.inErrors['isMail']=true;
			}
		},
		/**
		 * @private
		 * Check if value of connected object is an alphabetic value
		 * Apply isAlpha class
		 */
		isAlpha : function () {
			_this=this;
		
			if ((arguments[0].fromConnect) || (arguments[0].fromRefresh)) {
				_this=arguments[0];
			} else if (arguments[0].fromDisconnect) {
				_this=arguments[0];
				_this.inErrors['isAlpha']=false;
				_this.className=_this.className.replace(/ *isalpha/,'');
				return;
			}	
				
			_this.inErrors['isAlpha']=false;
			_this.className=_this.className.replace(/ *isalpha/,'');
			var matc=_this.value.match(/^[a-z]+$/i);
			if ((_this.value!="") && (matc==null)) {
				_this.className+=' isalpha';
				_this.inErrors['isAlpha']=true;
			}	
		},
		/**
		 * @private
		 * Check if value of connected object is alphanumeric
		 * Apply isAlphanum class
		 */
		isAlphanum : function () {
			_this=this;
		
			if ((arguments[0].fromConnect) || (arguments[0].fromRefresh)) {
				_this=arguments[0];
			} else if (arguments[0].fromDisconnect) {
				_this=arguments[0];
				_this.inErrors['isAlphanum']=false;
				_this.className=_this.className.replace(/ *isalphanum/,'');
				return;
			}
				
			_this.inErrors['isAlphanum']=false;
			_this.className=_this.className.replace(/ *isalphanum/,'');
			var matc=_this.value.match(/^[a-z0-9]+$/i);
			if ((_this.value!="") && (matc==null)) {
				_this.className+=' isalphanum';
				_this.inErrors['isAlphanum']=true;
			}	
		},
		/**
		 * @private
		 * Check if value of connected object match a regExp
		 * Apply matchRegexp class
		 */
		matchRegexp : function () {
			_this=this;
		
			if ((arguments[0].fromConnect) || (arguments[0].fromRefresh)) {
				_this=arguments[0];
			} else if (arguments[0].fromDisconnect) {
				_this=arguments[0];
				_this.inErrors['matchRegexp']=false;
				_this.className=_this.className.replace(/ *matchregexp/,'');
				return;
			}
				
			_this.inErrors['matchRegexp']=false;
			_this.className=_this.className.replace(/ *matchregexp/,'');
			var matc=_this.value.match(_this.matchregexp);
			if ((_this.value!="") && (matc==null)) {
				_this.className+=' matchregexp';
				_this.inErrors['matchRegexp']=true;
			}	
		},
		/**
		 * @private
		 * Check if value of connected object is not empty
		 * Apply mendatory class
		 */
		mendatory : function () {
			_this=this;
		
			if ((arguments[0].fromConnect) || (arguments[0].fromRefresh)) {
				_this=arguments[0];
			} else if (arguments[0].fromDisconnect) {
				_this=arguments[0];
				_this.className=_this.className.replace(/ *mendatory/,'');
				_this.inErrors['mendatory']=false;
				return;
			}	
			
			_this.inErrors['mendatory']=false;
			if (_this.value=='') {
				_this.className+=' mendatory';
				_this.inErrors['mendatory']=true;
			} else 
				_this.className=_this.className.replace(/ *mendatory/,'');
		},
		/**
		 * @private
		 * Select the value of the connected object
		 */
		selectAll : function () {
			_this=this;
		
			if ((arguments[0].fromConnect) || (arguments[0].fromRefresh)) {
				_this=arguments[0];
			} else if (arguments[0].fromDisconnect) {
				return;
			}
				
			_this.select();
			
		},
		/**
		 * @private
		 * Check if value of connected object is an exact copy of an other object
		 * Apply copyOf class
		 */
		copyOf : function () {
			_this=this;
			if (arguments[0].fromConnect) {
				_this=arguments[0];
				_this.parentPointer.connect(_this.copyof,"copyOfUpdate",_this);
				_this=arguments[0];
			} else if (arguments[0].fromRefresh){
				_this=arguments[0];
			} else if (arguments[0].fromDisconnect) {
				_this=arguments[0];
				_this.inErrors['copyOf']=false;
				_this.className=_this.className.replace(/ *copyOf/,'');
				_this.parentPointer.disconnect(_this.copyof,"copyOfUpdate",_this);
				return;
			}	
	
			_this.inErrors['copyOf']=false;
			_this.className=_this.className.replace(/ *copyOf/,'');
			if ((_this.value!=_this.copyof.value) || (_this.value=='')) {
				_this.className+=' copyOf';
				_this.inErrors['copyOf']=true;
			}
		},
		/**
		 * @private
		 * Update copyOf state when dependance is edited
		 */
		copyOfUpdate:function() {
			_this=this;
		
			if (arguments[0].fromConnect) {
				return;
			} else if (arguments[0].fromRefresh){
				_this=arguments[0];
			} else if (arguments[0].fromDisconnect) {
				return;
			}
			
			
			var fn = _this.parentPointer.copyOf;
			
			var oO=_this.copyOfUpdate;
			_this.copyOfUpdate.fromRefresh=true;
			fn(_this.copyOfUpdate);
			oO.fromRefresh=false;
		},
		/**
		 * @private
		 * Check if the connected form is valide or not
		 * Cancel submit ction when error's detected
		 * See object.Errors for in error's object
		 * @return {Bool}
		 */
		validate : function () {
			_this=this;
		
			if (arguments[0].fromConnect) {
				if (arguments[0] && arguments[0].preventDefault)
					arguments[0].preventDefault(); // DOM style
				return false; 
			} else if (arguments[0].fromRefresh) {
				_this=arguments[0];
			} else if (arguments[0].fromDisconnect) {
				_this=arguments[0];
				_this.inErrors['validate']=false;
				return true;
			}	
	
			_this.inErrors['validate']=false;
			_this.Errors=new Array();
			
			var elm=_this.parentPointer.elements;
	
			for (i in elm) {
				if (elm[i]==_this) continue;
				for (j in elm[i].inErrors) {
					if (elm[i].inErrors[j]) {
						_this.inErrors['validate']=true;
						_this.Errors.push(elm[i]);
						break;
		  			}
				}	
			}
			if (_this.inErrors['validate']) {
				if (arguments[0] && arguments[0].preventDefault)
					arguments[0].preventDefault(); // DOM style
				if (_this.validate)
					_this.validate(_this.Errors);
	  			return false; // IE style
	  		}
		},
		/**
		 * @private
		 * Place a constraint on an object
		 * Constraint defined by functions which return true or false
		 */
		Constraint:function () {
			_this=this;
		
			if ((arguments[0].fromConnect) || (arguments[0].fromRefresh)) {
				_this=arguments[0];
			} else if (arguments[0].fromDisconnect) {
				_this=arguments[0];
				_this.inErrors['Constraint']=false;
				_this.className=_this.className.replace(/ *constraint/,'');
				return;
			}	
	
			_this.inErrors['Constraint']=false;
			_this.className=_this.className.replace(/ *constraint/,'');
			if (!_this.constraint(_this.value)) {
				_this.className+=' constraint';
				_this.inErrors['Constraint']=true;
			}
		},
		/**
		 * @private
		 * Refresh object's connected method
		 */
		Refresh: function() {
			for (i=0; i<this.ConnectedMethod.length;i++) {
				//La methode a lancer
				fn=this.parentPointer._whatAdd(this.ConnectedMethod[i]);
				this.fromRefresh=true;
				fn(this);
				this.fromRefresh=false;
			}
		},
		/**
		 * @private
		 * Return event's type and event's method
		 * 
		 * @param {String} methode
		 * @return {Function}
		 */
	 	_whatAdd : function(methode) {
			switch (methode) {
				case 'complexity':
					this.type="keyup";
					return this.check;
				case 'mendatory':
					this.type="keyup";
					return this.mendatory;
				case 'constraint':
					this.type="keyup";
					return this.Constraint;		
				case 'selectall':
					this.type="click";
					return this.selectAll;
				case 'validate':
					this.type="submit";
					return this.validate;				
				case 'copyof':
					this.type="keyup";
					return this.copyOf;
				case 'isnum':
					this.type="keyup";
					return this.isNum;
				case 'isint':
					this.type="keyup";
					return this.isInt;
				case 'isalpha':
					this.type="keyup";
					return this.isAlpha;
				case 'isalphanum':
					this.type="keyup";
					return this.isAlphanum;
				case 'matchregexp':
					this.type="keyup";
					return this.matchRegexp;
				case 'ismail':
					this.type="keyup";
					return this.isMail;
					
				case 'copyOfUpdate' : /* cas particulier pour la liaison des copyOf */
					this.type="keyup";
					return this.copyOfUpdate;
				default:
					return false;
			}
		},
		/**
		 * Connect a validation method on [obj]
		 * 
		 * @param {Object} obj the object to validate
		 * @param {String} methode the validation method
		 */
		connect : function (obj,methode) {
			
			//La methode a lancer
			fn=this._whatAdd(methode);
			
			//John Resig : http://ejohn.org/projects/flexible-javascript-events/
			if ( obj.attachEvent ) {
				obj['e'+this.type+fn] = fn;
				obj[this.type+fn] = function(){obj['e'+this.type+fn]( window.event );}
				obj.attachEvent( 'on'+this.type, obj[this.type+fn] );
			} else
				obj.addEventListener( this.type, fn, false );
	 
	 		//colle aussi sur le blur
			if (this.type=="keyup") {
				if ( obj.attachEvent ) {
					obj['e'+'blur'+fn] = fn;
					obj['blur'+fn] = function(){obj['e'+'blur'+fn]( window.event );}
					obj.attachEvent( 'on'+'blur', obj['blur'+fn] );
				} else
					obj.addEventListener( 'blur', fn, false );
	 
			}
			if (!obj.inErrors)
	 			obj.inErrors=[];
			
	 		//Ajoute la référence a un objet ou une methode
			if (arguments[2])
				eval("obj."+methode+"=arguments[2];");
	 		
			//Implemente le tableau des evts de l'objet
			if (!obj.ConnectedMethod)
				obj.ConnectedMethod=new Array();
			obj.ConnectedMethod.push(methode);
			
	 		//Ajoute le pointer vers la classe parent
	 		obj.parentPointer=this;
			//La methode de refresh
			obj.refresh=this.Refresh;
			//Implemente le tableau des register
			for(i=0; i<this.elements.length;i++) {
				if (this.elements[i]==obj) {
					this.elements.splice(i,1);				
					break;
				}
			}
			this.elements.push(obj);
	
			//Lance l'evenement
	 		if (this.type!="click") {
	 			obj.fromConnect=true;
				fn(obj);
				obj.fromConnect=false;
	 		}
			
	
		},
		/**
		 * disconnect a validation method from [obj]
		 * 
		 * @param {Object} obj the object to validate
		 * @param {String} methode the validation method
		 */
		disconnect : function (obj,methode) {
			
			//La methode qui était lancée
			fn=this._whatAdd(methode);
			
			//John Resig : http://ejohn.org/projects/flexible-javascript-events/
			if ( obj.detachEvent ) {
				obj.detachEvent( 'on'+this.type, obj[this.type+fn] );
				obj[this.type+fn] = null;
			} else
				obj.removeEventListener( this.type, fn, false );
			
			//colle aussi sur le blur
			if (this.type=="keyup") {
				if ( obj.detachEvent ) {
					obj['blur'+fn] = null;
					obj.detachEvent( 'on'+'blur', obj['blur'+fn] );
				} else
					obj.removeEventListener( 'blur', fn, false );
	 
			}
			
			//Lance l'evenement de deconnection
	 		obj.fromDisconnect=true;
			fn(obj);
			obj.fromDisconnect=false;
			
			//enleve les référence au parent et aux methode/objet
			eval("delete obj."+methode+";");
			delete obj.inErrors;
			
			//Deplemente le tableau des evts de l'objet
			for(i=0; i<obj.ConnectedMethod.length;i++) {
				if (obj.ConnectedMethod[i]==methode) {
					obj.ConnectedMethod.splice(i,1);
					break;
				}
			}
			if (obj.ConnectedMethod.length<1) {
				//le pointer
				delete obj.parentPointer;
				//La methode de refresh
				delete obj.refresh;
				//unregister de l'objet
				for(i=0; i<this.elements.length;i++) {
					if (this.elements[i]==obj) {
						this.elements.splice(i,1);
						break;
					}
				}
			}	
		}
	},
	
};

