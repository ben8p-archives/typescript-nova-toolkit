/**
 * Nova's object
 * 
 * @author iDo (ido@woow-fr.com)
 * @license Paternité - Pas d'Utilisation Commerciale - Partage des Conditions Initiales à l'Identique 3.0 (http://creativecommons.org/licenses/by-nc-sa/3.0/deed.fr_CA)
 * @version 07_08
 * @fileoverview Framework javascript
 * Note 		: 
 *	 	Connect & Disconnect from John Resig (http://ejohn.org/projects/flexible-javascript-events/)
 * 		Convert froms domNode in url encoded string from Dojo tookit (http://dojotoolkit.org)
 * 		getElementsByAnything from Matthew Pennell (http://www.javascriptsearch.com/guides/Advanced/articles/0607ABetterDollarFunction.html)
 * 		UTF-8 <=> UTF-16 convertion from Masanao Izumo (iz@onicos.co.jp)
 * 		JavaScript to PHP serialize / unserialize class from Ma Bingyao (andot@ujn.edu.cn / http://www.coolcode.cn/?p=171)
 * 		Shortcut adding from Binny V A (http://www.openjs.com/scripts/events/keyboard_shortcuts/)
 * 		Tooltip positioning from scriptaculous (http://www.illustate.com/playground/scriptaculous/tooltip/)
 * 		Sortable TABLE from Stuart Langridge (http://www.kryogenix.org/code/browser/sorttable/)
 */

/**
 * Nova's object
 * @constructor
 */
var nova = new Object({
	version:"07_08",
	/**
	 * Attach [type] event on [obj]
	 *  
	 * @param {Object} obj the object
	 * @param {String} type the type of connection ("click,"keyup",etc...)
	 * @param {function} methode the function to connect
	 */
	connect : function (obj,type,methode) {
		if ( obj.attachEvent ) {
			var strFn=methode.toString();
			obj['e'+type+strFn] = methode;
			obj[type+strFn] = function(){obj['e'+type+strFn]( window.event );}
			obj.attachEvent( 'on'+type, obj[type+strFn] );
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
			var strFn=methode.toString();
			obj.detachEvent( 'on'+type, obj[type+strFn] );
			obj[type+strFn] = null;
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
		   if ((rec) && (typeof what[i]=="object")) {
	       	if (nova.variable.isSet(what[i]) && nova.variable.isSet(what[i].ownerDocument))
	       		//Maybe a DOM object
	       		this[i]=what[i].cloneNode(true);
	       	else
	           this[i] = new nova.clone(what[i],true);
	       } else
	           this[i] = what[i];
	    }
	},
	/**
	 * like classical setTimeOut but preserv context
	 * @param {Function} fn the function you want to delay
	 * @param {Object} delay the delay
	 * @param {Object} _this the context you want to have in this
	 * 
	 * @return {handle} handle to the timeout method
	 */
	setTimeOut:function(fn, delay,_this) {
		var args = arguments;
		return window.setTimeout(function () { 
			fn.apply(_this, args); 
		}, delay);
	},
	/**
	 * like classical setInterval but preserv context
	 * @param {Function} fn the function you want to delay
	 * @param {Object} delay the delay
	 * @param {Object} _this the context you want to have in this
	 * 
	 * @return {handle} handle to the interval method
	 */
	setInterval:function(fn, delay,_this) {
		var args = arguments;
		return window.setInterval(function () { 
			fn.apply(_this, args); 
		}, delay);
	}	
	
});
/**
 * Nova's config namespace
 * @constructor
 */
nova.config = {
	isDebug:true,	
	firebug:(typeof console !="undefined" && typeof console.log !="undefined")?true:false,
	/**
	 * toggle debug mode
	 * 
	 * @param {Bool} bool put debug on true or false
	 */
	debug:function(bool) {
		nova.config.isDebug=bool;
	}
};
/**
 * nova's browser namespace
 * @constructor
 */
nova.browser = {
	isIE : (document.all) ?true : false,
	isFirefox:(navigator.userAgent.toLowerCase().indexOf("firefox")!=1)?true:false
};

/**
 * Nova's effect namespace
 * @constructor
 */
nova.effects = {
	_queueList:{'default':[]},
	_defaultDuration:250,
	_queuInProgress:{'default':false},
	
	/**
	 * Add function/method in the queue list
	 * @param {Function} fn effect function
	 * @param {Object} obj the object to effect
	 * @param {Object} object with a least 1 property  : {duration: 00} (duration the duration of the effect is in ms)
	 */
	addToQueue:function(fn,obj,params) {
		if (!nova.variable.isSet(params))
			params={};
		if (!nova.variable.isSet(params.duration))
			params.duration=nova.effects._defaultDuration;
		if (params.scope == null || typeof params.scope == "undefined")
			params.scope = "default";
		
		if (typeof nova.effects._queueList[params.scope] != "object")
			nova.effects._queueList[params.scope]=[];
		
		nova.effects._queueList[params.scope].push({
			fn:fn,
			obj:obj,
			params: params
		});
	},
	/**
	 * Launch the queue. It stop when all queued effect are displayed
	 * @param {String} scope the scope of the queue
	 */
	queueNext:function(scope) {
		if (scope == null || typeof scope == "undefined")
			scope='default';
		if (nova.effects._queuInProgress[scope] == null || typeof nova.effects._queuInProgress[scope] == "undefined")
			nova.effects._queuInProgress[scope] = false;
		
		if (nova.effects._queuInProgress[scope] && !nova.variable.isSet(arguments[1]))
			return;
		queue=nova.effects._queueList[scope].shift();
		if (nova.variable.isSet(queue)) {
			queue.fromQueue=true;
			nova.effects._queuInProgress[scope]=true;
			args=[queue.obj,queue.params,queue.fromQueue];
			queue.fn.apply(queue,args);
		} else {
			nova.effects._queuInProgress[scope]=false;
		}
	},
	
	/**
	 * FadeIn effect on obj
	 * @param {Object} obj the object to fade
	 * @param {Object} params object with 3 properties : {duration: 00, from : 00, to: 00} (the duration of the effect is in ms)
	 * @param {Bool} fromQueue true if lauch from queue
	 */
	fadeIn:function(obj,params,fromQueue) {
		if (!nova.variable.isSet(params))
			params={};
		if (!nova.variable.isSet(params.duration))
			params.duration=nova.effects._defaultDuration;
		params.fadeIn = true;
		if (!nova.variable.isSet(params.from))
			params.from=0;
		if (!nova.variable.isSet(params.to))
			params.to=1;
		if (!nova.variable.isSet(params.scope))
			params.scope = "default";
			
		nova.effects._fade(obj,params,fromQueue);
	},
	/**
	 * FadeOut effect on obj
	 * @param {Object} obj the object to fade
	 * @param {Object} params object with 3 properties : {duration: 00, from : 00, to: 00} (the duration of the effect is in ms)
	 * @param {Bool} fromQueue true if lauch from queue
	 */
	fadeOut:function(obj,params,fromQueue) {
		if (!nova.variable.isSet(params))
			params={};
		if (!nova.variable.isSet(params.duration))
			params.duration=nova.effects._defaultDuration;
		params.fadeIn = false;
		if (!nova.variable.isSet(params.from))
			params.from=1;
		if (!nova.variable.isSet(params.to))
			params.to=0;
		if (!nova.variable.isSet(params.scope))
			params.scope = "default";
			
		nova.effects._fade(obj,params,fromQueue);
	},
	/**
	 * @private
	 * Fade effect
	 * @param {Object} obj the object to fade
	 * @param {Object} params object with 4 properties : {duration: 00, fadeIn: true, from : 00, to : 00} (the duration of the effect is in ms)
	 * @param {Bool} true if the effect is lauch by queue list
	 */
	_fade:function(obj,params,fromQueue) {
		pas = 10;
		
		if (!nova.variable.isSet(params.scope))
			params.scope = "default";
		
		_this={
			obj:obj,
			pas:pas,
			fromQueue:fromQueue,
			params: params,
			effectInProgress:{}
		};
		
		params.duration=params.duration / ((Math.abs(params.from - params.to)*100) / pas);

		_this.effectInProgress[params.scope] = nova.setInterval(function() {
			try {
				if (typeof nova=="undefined" && nova===null) {
					clearInterval(this.effectInProgress[this.params.scope]);
					return;
				}
				obj=this.obj;
				if (typeof this.fadeValue=="undefined") {
					this.fadeValue=this.params.from;
				}
				obj.style.display="";
				nova.html.setOpacity(obj,this.fadeValue );
				
				if (this.params.fadeIn)
					this.fadeValue+=(this.pas/100);
				else
					this.fadeValue-=(this.pas/100);
	
				if ((this.params.fadeIn && this.fadeValue>=params.to) || (!this.params.fadeIn && this.fadeValue<=params.to)) {
					clearInterval(this.effectInProgress[this.params.scope]);
					
					if (!this.params.fadeIn && this.params.to == 0)
						obj.style.display="none";
					else if (this.params.fadeIn && this.params.to == 1) {
						nova.html.setOpacity(obj,1);
					}
					
					if (fromQueue)
						nova.effects.queueNext(this.params.scope,true);
				}
			} catch (e) {
				clearInterval(this.effectInProgress[this.params.scope]);
				return;
			}	
		},params.duration,_this);
	},
	/**
	 * Move an object 
	 * @param {Object} obj the object to fade
	 * @param {Object} params object with 3 properties : {left : 00, top: 00, duration: 00} (the duration of the effect is in ms)
	 * @param {Bool} fromQueue true if lauch from queue
	 */	
	moveTo:function(obj,params,fromQueue) {
		pas=5;
	
		if (!nova.variable.isSet(params))
			params={};
		if (!nova.variable.isSet(params.duration))
			params.duration=nova.effects._defaultDuration;
		if (!nova.variable.isSet(params.scope))
			params.scope = "default";
		
		params.top=parseInt(params.top);
		params.left=parseInt(params.left);
		
		var lEcart = Math.abs(nova.dom.getDomOffset(obj,"left") -params.left);
		var tEcart = Math.abs(nova.dom.getDomOffset(obj,"top") -params.top);
		var ecart=(lEcart>tEcart)?lEcart:tEcart;
			
		_this={
			obj:obj,
			pas:pas,
			fromQueue:fromQueue,
			effectInProgress:{},
			params: params
		};
		params.duration=params.duration/(ecart / pas);
		_this.effectInProgress[params.scope] = nova.setInterval(function() {
			try {
				if (typeof nova=="undefined" && nova===null) {
					clearInterval(this.effectInProgress[this.params.scope]);
					return;
				}
				obj=this.obj;
				
				if (nova.dom.getDomOffset(obj,"left")<this.params.left)
					obj.style.left=nova.dom.getDomOffset(obj,"left")+this.pas+"px";
				if (nova.dom.getDomOffset(obj,"left")>this.params.left)
					obj.style.left=nova.dom.getDomOffset(obj,"left")-this.pas+"px";
				
				
				if (nova.dom.getDomOffset(obj,"top")<this.params.top)
					obj.style.top=nova.dom.getDomOffset(obj,"top")+this.pas+"px";
				if (nova.dom.getDomOffset(obj,"top")>this.params.top)
					obj.style.top=nova.dom.getDomOffset(obj,"top")-this.pas+"px";
				
			
				if (nova.dom.getDomOffset(obj,"left")==this.params.left && nova.dom.getDomOffset(obj,"top")==this.params.top) {
					clearInterval(this.effectInProgress[this.params.scope]);
					if (fromQueue)
						nova.effects.queueNext(this.params.scope,true);
				}
			} catch (e) {
				clearInterval(this.effectInProgress[this.params.scope]);
				return;
			}
		},params.duration,_this);
	},
	/**
	 * Resize an object 
	 * @param {Object} obj the object to fade
	 * @param {Object} params object with 3 properties : {width : 00, height: 00, duration: 00} (the duration of the effect is in ms)
	 * @param {Bool} fromQueue true if lauch from queue
	 */	
	resize:function(obj,params,fromQueue) {
		pas=5;
		if (!nova.variable.isSet(params))
			params={};
		if (!nova.variable.isSet(params.duration))
			params.duration=nova.effects._defaultDuration;
		if (!nova.variable.isSet(params.scope))
			params.scope = "default";
			
		var hEcart = Math.abs(obj.offsetHeight -params.height);
		var wEcart = Math.abs(obj.offsetWidth -params.width);
		var ecart=(hEcart>wEcart)?hEcart:wEcart;
		
			
		_this={
			obj:obj,
			pas:pas,
			fromQueue:fromQueue,
			effectInProgress:{},
			params: params
		};
		params.duration=params.duration/(ecart / pas);
		_this.effectInProgress[params.scope] = nova.setInterval(function() {
			try {
				if (typeof nova=="undefined" && nova===null) {
					clearInterval(this.effectInProgress[this.params.scope]);
					return;
				}
				obj=this.obj;
				if (obj.offsetHeight<this.params.height)
					obj.style.height=obj.offsetHeight+this.pas+"px";
				if (obj.offsetWidth<this.params.width)
					obj.style.width=obj.offsetWidth+this.pas+"px";
			
				if (obj.offsetHeight>=this.params.height && obj.offsetWidth>=this.params.width) {
					clearInterval(this.effectInProgress[this.params.scope]);
					if (fromQueue)
						nova.effects.queueNext(this.params.scope,true);
				}
			} catch (e) {
				clearInterval(this.effectInProgress[this.params.scope]);
				return;
			}
		},params.duration,_this);
	},
	/**
	 * slideUp effect on obj
	 * @param {Object} obj the object to fade
	 * @param {Object} params object with 1 properties : {duration: 00} (the duration of the effect is in ms)
	 * @param {Bool} fromQueue true if lauch from queue
	 */
	slideUp : function(obj,params,fromQueue) {
		if (!nova.variable.isSet(params))
			params={};
		if (!nova.variable.isSet(params.duration))
			params.duration=nova.effects._defaultDuration;
		if (!nova.variable.isSet(params.scope))
			params.scope = "default";
		params.slideUp = true;
		nova.effects._slide(obj,params,fromQueue);
	},
	/**
	 * slideDown effect on obj
	 * @param {Object} obj the object to fade
	 * @param {Object} params object with 1 or properties : {duration: 00, height : 00} (the duration of the effect is in ms)
	 * @param {Bool} fromQueue true if lauch from queue
	 */
	slideDown : function(obj,params,fromQueue) {
		if (!nova.variable.isSet(params))
			params={};
		if (!nova.variable.isSet(params.duration))
			params.duration=nova.effects._defaultDuration;
		if (!nova.variable.isSet(params.scope))
			params.scope = "default";
		params.slideUp = false;
		nova.effects._slide(obj,params,fromQueue);
	},	
	/**
	 * @private
	 * Slide effect
	 * @param {Object} obj the object to fade
	 * @param {Object} params object with 2 properties : {duration: 00, slideUp: true} (the duration of the effect is in ms)
	 * @param {Bool} true if the effect is lauch by queue list
	 */
	_slide : function(obj,params,fromQueue) {
		if (!nova.variable.isSet(params))
			params={};
		if (!nova.variable.isSet(params.duration))
			params.duration=nova.effects._defaultDuration;
		if (!nova.variable.isSet(params.scope))
			params.scope = "default";
			
		var pas=5;
		
		params.originalSize=(obj.offsetHeight>0)?obj.offsetHeight:obj.originalSize;
		
		if (params.originalSize == null || typeof params.originalSize == "undefined") {
			if (params.height == null || typeof params.height == "undefined")
				return nova.debug.raiseError("you must precise the height");
			params.originalSize = params.height;
		}
		obj.originalSize=params.originalSize;
			
		_this={
			obj:obj,
			pas:pas,
			fromQueue:fromQueue,
			effectInProgress:{},
			params: params
		};
		params.duration=params.duration/(params.originalSize / pas);
	
		_this.effectInProgress[params.scope] = nova.setInterval(function() {
			try {
				if (typeof nova=="undefined" && nova===null) {
					clearInterval(this.effectInProgress[this.params.scope]);
					return;
				}
				obj=this.obj;
				
				if (typeof this.slideValue=="undefined") {
					if (this.params.slideUp)
						this.slideValue=0;
					else
						this.slideValue=this.params.originalSize;
				}
				
				obj.style.height=this.slideValue+"px";
				
				if (params.slideUp) {
					if (this.slideValue==0)
						obj.style.display="";
					this.slideValue+=pas;		
				} else
					this.slideValue-=pas;
								
				if ((obj.offsetHeight>=this.params.originalSize && params.slideUp) || (obj.offsetHeight<=0 && !params.slideUp)) {
					clearInterval(this.effectInProgress[this.params.scope]);
					if (!params.slideUp)
						obj.style.display="none";
					if (fromQueue)
						nova.effects.queueNext(this.params.scope,true);
				}
			} catch (e) {
				clearInterval(this.effectInProgress[this.params.scope]);
				return;
			}
		},params.duration,_this);
	}
};
/**
 * Nova's slider namespace
 * @constructor
 */
nova.slider= {
	/**
	 * Connect a slide on ul obj
	 * 
	 * 
	 * props exemple :
	 * {
	 * className : "myCSSStyle",
	 * }
	 * 
	 * @param {Object} obj the ul obj to connect slide
	 * @param {Object} props all props (see exemple)
	 */
	connect : function(obj,props) {
		if (!obj.tagName || obj.tagName.toLowerCase() != "ul")
			return nova.debug.raiseError("you can connect slider only on UL element");
		
		var lis=obj.getElementsByTagName("li");
		if (lis.length<2)
			return nova.debug.raiseError("you need at least 2 li");
		
		for (var i=0;i<lis.length;i++)
			nova.connect(lis[i],"mousemove",nova.slider._move);
		
	    obj.slider=document.createElement('div');
		obj.slider.props=props;
		if (nova.variable.isSet(props.className))
			nova.html.setClass(obj.slider,props.className);
		var _pos = nova.slider._getCoordonate(lis[0]);
		nova.html.setStyle(obj.slider,{position: 'absolute',left: _pos.left,top:_pos.top})

	    document.body.appendChild(obj.slider);
	},
	/**
	 * Disconnect a slide from ul obj
	 * @param {Object} obj the ul obj to disconnect slide
	 */
	disconnect : function(obj) {
		if (!obj.tagName || obj.tagName.toLowerCase() != "ul")
			return nova.debug.raiseError("you can disconnect slider only on UL element");
		
		var lis=obj.getElementsByTagName("li");		
		for (var i in lis)
			nova.disconnect(lis[i],"mousemove",nova.slider._move);
		
		nova.dom.removeNode(obj.slider);
		delete obj.slider;
	},
	/**
	 * @private
	 * get new coordonate of slider object with li current position
	 * @param {Object} obj li object
	 * @return {Object}
	 */
	_getCoordonate :  function(obj) {
		return {left: nova.dom.getDomOffset(obj,"left")+"px",top:(nova.dom.getDomOffset(obj,"top") + obj.offsetHeight)+"px"};
	},
	/**
	 * @private
	 * move the slider to the new pos
	 * @param {Object} evt events object
	 */
	_move: function(evt) {
		var _pos = nova.slider._getCoordonate(this);
		nova.effects.moveTo(this.parentNode.slider,{left: _pos.left,top: _pos.top})
	}
	
};
/**
 * Nova's string namespace
 * @constructor
 */
nova.string = {
	/**
	 * revert htmlEncode
	 * @param {String} str string to encode
	 * @return {String}
	 */
	htmlDecode : function(str) {
		var entities=str.match(/\&\#([0-9]+);/g);
		var num="";
		var reg = null;
		var decoded=str;
		for (var i in entities) {
			num=entities[i].replace(/\&|\#|\;/g,"");
			reg=new RegExp(entities[i],"g");
			decoded=decoded.replace(reg,String.fromCharCode(num));
		}
		return decoded;
	},
	/**
	 * encode a string in html format
	 * @param {String} str string to encode
	 * @return {String}
	 */
	htmlEncode : function (str) {
		var encoded="";
		var tmp="";
		for (var i =0; i<str.length;i++) {
		    tmp=str.substr(i,1);
		    encoded+=(String.charCodeAt(tmp)<32 || String.charCodeAt(tmp) >125)?"&#"+String.charCodeAt(tmp)+";":tmp;
		}
	},
	/**
	 * trim space before and after a string
	 * @param {String} str the str to strim
	 * @return {string}
	 */
	trim : function(str) {
		return str.replace(/^\s+|\s+$/g, "");
	}
};
/**
 * Nova's slideshow namespace
 * @constructor
 */
nova.slideshow = {
	/**
	 * init a slideshow on obj
	 * @description
	 * A slideshow is a UL with all LI (exept one) not displayed. Time after time, LI desappear and let next LI appear.
	 * @param {Object} obj the object which will have slideshow
	 * @param {Object} params params with at least 1 properties : {delay:00} (in milliseconds)
	 */
	init: function(obj,params) {
		if (!obj.tagName || obj.tagName.toLowerCase()!="ul")
			return nova.debug.raiseError("you can have a slideshow only on ul element");
		
		if (!nova.variable.isSet(params))
			params={};
		if (!nova.variable.isSet(params.delay))
			params.delay=3000;
		if (!nova.variable.isSet(params.scope))
			params.scope="slideshow";
		if (!nova.variable.isSet(params.start))
			params.start=false;			
		
		var li = obj.childNodes;
		var showFirst=-1;
		for (var i=0;i<li.length;i++) {
			if (!li[i].nodeType) continue;
			if (li[i].nodeType!=1) continue;
			if (showFirst!=-1)
				li[i].style.display="none";
			else
				showFirst=i
		}
		params.visibleChild=showFirst;
		params.firstLi = showFirst;
		obj.params=params;
		if (params.start)
			nova.slideshow.start(obj);
	},
	/**
	 * Start/restart the slideshow on obj
	 * @param {Object} obj the object which have slideshow
	 */
	start:function(obj) {
		if (nova.variable.isSet(obj.params.slideHandle))
			clearInterval(obj.params.slideHandle);
		obj.params.slideHandle = nova.setInterval(nova.slideshow._next, obj.params.delay,obj);
	},
	/**
	 * Stop (and reset) the slideshow on obj
	 * @param {Object} obj the object which have slideshow
	 */	
	stop:function(obj) {
		clearInterval(obj.params.slideHandle);
		
		nova.effects.addToQueue(nova.effects.fadeOut,obj.childNodes[obj.params.visibleChild],{duration:250,scope:obj.params.scope});
		nova.effects.addToQueue(nova.effects.fadeIn,obj.childNodes[obj.params.firstLi],{duration:250,scope:obj.params.scope});
		nova.effects.queueNext(obj.params.scope);
		obj.params.visibleChild=obj.params.firstLi;
		
	},
	/**
	 * pause the slideshow on obj
	 * @param {Object} obj the object which have slideshow
	 */
	pause:function(obj) {
		clearInterval(obj.params.slideHandle);
	},
	/**
	 * @private
	 * Show the next slide
	 */
	_next:function() {
		var child = this.params.visibleChild;
		var nextChild = child+1;
		
		while (this.childNodes[nextChild].nodeType!=1) {
			nextChild++;
			if (nextChild>this.childNodes.length-1)
				nextChild=this.params.firstLi;
		}		
		nova.effects.addToQueue(nova.effects.fadeOut,this.childNodes[child],{duration:250,scope:this.params.scope});
		nova.effects.addToQueue(nova.effects.fadeIn,this.childNodes[nextChild],{duration:250,scope:this.params.scope});
		nova.effects.queueNext(this.params.scope);
		this.params.visibleChild = nextChild;
	}
	 		
};
/**
 * Nova's lighbox namespace
 * To add a custom style on the dock window, create the css class #lightbox_dock { }
 * To add a custom style on the picture window, create the css class #lightbox_image { }
 * To add a loading picture, place a backgroundImage centered in #lightbox_dock
 * @constructor
 */
nova.lightbox = {
	_modal:null,
	/**
	 * init the lightbox
	 * @param {Object | Array} obj an object or an array of object to apply lightbox
	 */
	init:function(obj) {
		var clk= function () {
				try {
					nova.lightbox._show(this);
				} catch (e) {}
				arguments[0].cancelBubble = true;
				arguments[0].returnValue = false;
				if (arguments[0].stopPropagation) {
					arguments[0].stopPropagation();
					arguments[0].preventDefault();
				}
				return false;
			};
		if (nova.variable.isObject(obj)) {
			nova.connect(obj,"click",clk);
		} else {
			for(i=0;i<obj.length;i++) {
				nova.connect(obj[i],"click",clk);
			}
		}
	},
	/**
	 * @private
	 * show the box
	 * @param {Object} _this object with to to img
	 */
	_show:function(_this) {
		nova.dom.hideNotZindexedElements();
		vps=nova.dom.getViewportSize();
		
		document.getElementsByTagName("body")[0].style.overflowX="hidden";
		document.getElementsByTagName("body")[0].style.overflowY="hidden";
		
			
		modal=document.createElement("div");
		modal.style.height=vps.height+"px";
		modal.style.width=vps.width+"px";
		modal.style.position="absolute";
		modal.id="lightbox_dock";
		modal.style.left=0;
		modal.style.top=0;
		modal.style.zIndex=9999;
		modal.onclick=function() {
			nova.lightbox._hide(this);
		}
		document.getElementsByTagName("body")[0].appendChild(modal);
		
		nova.lightbox._modal=document.createElement("img");
		nova.lightbox._modal.style.display="none";
		nova.lightbox._modal.id="lightbox_image";
		nova.lightbox._modal.src=_this.href;
		nova.lightbox._modal.style.zIndex=10000;
		nova.lightbox._modal.style.position="absolute";
		nova.lightbox._modal.modalBack=modal;
		nova.lightbox._modal.onclick=function() {
			nova.lightbox._hide(this.modalBack);
		}
		document.getElementsByTagName("body")[0].appendChild(nova.lightbox._modal);
		
		nova.lightbox._showImg(_this.href);
	},
	/**
	 * @private
	 * Create img after showing the box
	 * @param {String} src link to image
	 */
	_showImg:function(src) {
		preload = new Image();
		
		// once image is preloaded, resize image container
		preload.onload=function(){
			size={width:preload.width, height:preload.height};
			vps=nova.dom.getViewportSize();
			if (size.height>vps.height)
				size.height=vps.height-10;
			if (size.width>vps.width)
				size.width=vps.width-10;

			nova.lightbox._modal.style.top=((vps.height-size.height)/2) + "px";
			nova.lightbox._modal.style.left=((vps.width-size.width)/2) + "px";
			nova.effects.addToQueue(nova.effects.fadeIn,nova.lightbox._modal,{duration:250,scope:'lightbox'});
			nova.effects.queueNext('lightbox');
			preload.onload=function(){}; 
		}
		preload.src = src;
	},
	/**
	 * @private
	 * hide the box and the img
	 * @param {Object} _this object with to to img
	 */
	_hide:function(_this) {
		nova.dom.removeNode(_this,true);
		nova.dom.removeNode(nova.lightbox._modal,true);
		nova.dom.showNotZindexedElements();
	}
};
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
	 * Replace all style by another on object
	 * 
	 * @param {Object} obj your object
	 * @param {Object} style style description
	 */
	setStyle: function (obj,sstyle) {
		for (var i in sstyle)
			obj.style[i]=sstyle[i];
	},
	/**
	 * Set the opacity of obj
	 * @param {Object} obj the obj to set
	 * @param {Object} opacity the opacity value (between 0 and 1)
	 */
	setOpacity : function (obj, valOpacity) {
		if (nova.browser.isIE) {
			obj.style.zoom = "1";
			obj.style.filter="alpha(opacity="+(valOpacity * 100)+")";
		} else
			obj.style.MozOpacity=valOpacity;
		obj.style.opacity=valOpacity;
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
	}
};
/**
 * Nova's DOM namespace
 * @constructor
 */
nova.dom = {
	/**
	 * get Dom elements by anything (name,tagname,id,class,selector,....)
	 * Can have much than one parameters
	 * 
	 * @param {String} mixed Selectors (#myid, div>ul>li, .myclass, ...)
	 * @return {Array || Object} An array with all matching objects or just one objects (if no more)
	 */
	getElementsByAnything:function () {
		var elements = new Array();
		var len=arguments.length;
		for (var ij=0;ij<len;ij++) {
			
			var element = arguments[ij];
			if (element == null) continue;
			var find=false;
			if (typeof element == 'string') {
				var matched = document.getElementById(element);
				if (matched) {
					elements.push(matched);
				} else {
					var allels = (document.all) ? document.all : document.getElementsByTagName('*');
					var regexp = new RegExp('(^| )'+element+'( |$)');
					for (var i=0,len=allels.length;i<len;i++) {
						if (regexp.test(allels[i].className)) {
							elements.push(allels[i]);
							find=true;
						}
					}
				}
				if (!find) {
					var matched = document.getElementsByTagName(element);
					for(var i=0;i<matched.length;i++) {
						elements.push(matched[i]);
						find=true;
					}
				}
				if (!find) {
					var allels = (document.all) ? document.all : document.getElementsByTagName('*');
					for (var i=0,len=allels.length;i<len;i++) {
						if (allels[i].getAttribute(element)) { 
							elements.push(allels[i]);
							find=true;
						}
					}
				}
				if (!find) {
					var allels = (document.all) ? document.all : document.getElementsByTagName('*');
					for (var i=0,len=allels.length;i<len;i++) { 
						if (allels[i].attributes) {
							for (var j=0,lenn=allels[i].attributes.length;j<lenn;j++) { 
								if (allels[i].attributes[j].specified) { 
									if (allels[i].attributes[j].nodeValue == element) { 
										elements.push(allels[i]);
										find=true;
									}
								}
							}
						}
					}
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
			eval('iVal += Obj.offset' + Prop.substring(0,1).toUpperCase() + Prop.substring(1,Prop.length) + ';');
			Obj = Obj.offsetParent;
		}
		return iVal;
	},
	/**
	 * Get the mouse position from the event
	 * 
	 * @param {Object} e An Event object
	 * @return {Object} x and y proprerties
	 */
	getMousePos:function(e) {
		if (!e) var e = window.event;
		if (e.pageX || e.pageY)
			return {x:e.pageX,y:e.pageY};
		else if (e.clientX || e.clientY)
			return {x:(e.clientX + document.body.scrollLeft),y:(e.clientY + document.body.scrollTop)};
	},
	/**
	 * Hide Some elements wich not affected by Zindex (in IE)
	 * 
	 */
	hideNotZindexedElements:function() {
		var objs = document.getElementsByTagName("select");
		for (i = 0; i != objs.length; i++) {
			objs[i].oldVisibility=objs[i].style.visibility;
			objs[i].style.visibility = "hidden";
		}
		var objs = document.getElementsByTagName("object");
		for (i = 0; i != objs.length; i++) {
			objs[i].oldVisibility=objs[i].style.visibility;
			objs[i].style.visibility = "hidden";
		}
		var objs = document.getElementsByTagName("embed");
		for (i = 0; i != objs.length; i++) {
			objs[i].oldVisibility=objs[i].style.visibility;
			objs[i].style.visibility = "hidden";
		}
	},
	/**
	 * Show Some elements wich not affected by Zindex (in IE)
	 * 
	 */
	showNotZindexedElements:function() {
		var objs = document.getElementsByTagName("select");
		for (i = 0; i != objs.length; i++) {
			if (nova.variable.isSet(objs[i].oldVisibility)) {
				objs[i].style.visibility = objs[i].oldVisibility;
				delete objs[i].oldVisibility;
			}
		}
		var objs = document.getElementsByTagName("object");
		for (i = 0; i != objs.length; i++) {
			if (nova.variable.isSet(objs[i].oldVisibility)) {
				objs[i].style.visibility = objs[i].oldVisibility;
				delete objs[i].oldVisibility;
			}
		}
		var objs = document.getElementsByTagName("embed");
		for (i = 0; i != objs.length; i++) {
			if (nova.variable.isSet(objs[i].oldVisibility)) {
				objs[i].style.visibility = objs[i].oldVisibility;
				delete objs[i].oldVisibility;
			}
		}
	},	
	/**
	 * Move a node in other node
	 * 
	 * @param {Object} node the node you want to move
	 * @param {Object} newParent the parent of your node
	 * @return {Object} the node
	 */
	moveNodeTo:function(node,newParent) {
		var n=this.removeNode(node,false);
		newParent.appendChild(n);
		return n;
	},
	/**
	 * Completly remove a node from DOM
	 * 
	 * @param {Object} node the node to remove
	 * @param {Bool} completlyRemove if true, destroy de reference
	 * @return {Object || null} the removed node or null
	 */
	removeNode : function(node,completlyRemove){
		if(node && node.parentNode){
			var n= node.parentNode.removeChild(node);
			if (completlyRemove)
				delete n;
			else
				return n;
			return null;
		}
	},
	
	/**
	 * Return an obejct with the viewport size
	 * 
	 * @return {Object} like {width:xxx, height:yyy}
	 */
	getViewportSize:function () {
		if( typeof( window.innerWidth ) == 'number' )
			return {width : window.innerWidth,height : window.innerHeight };
		else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) )
			return {width : document.documentElement.clientWidth,height : document.documentElement.clientHeight };
		else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) )
			return {width : document.body.clientWidth,height : document.body.clientHeight };
	},
	/**
	* Get the position of the document scroolbar
	* @return {Object} like {left:xxx, top:yyy}
	*/
	getDocumentScrollPosition : function () {
		return {left:document.documentElement.scrollLeft,top:document.documentElement.scrollTop};
	},
	/**
	 * Get the previous node in the DOM tree
	 * @param {Object} obj start object
	 * @return {null|DomObject}
	 */
	getPreviousNode : function (obj) {
		if (obj.previousSibling == null) return null;
		var prev=obj.previousSibling;
		while (prev.nodeType!=1 && prev.previousSibling != null)
			prev=prev.previousSibling;
		if (prev.nodeType!=1) return null;			
		return prev;
	},
	/**
	 * Get the next node in the DOM tree
	 * @param {Object} obj start object
	 * @return {null|DomObject}
	 */
	getNextNode : function (obj) {
		if (obj.nextSibling == null) return null;
		var next=obj.nextSibling;
		while (next.nodeType!=1 && next.nextSibling != null)
			next=next.nextSibling;
		if (next.nodeType!=1) return null;
		return next;
	},
	/**
	 * get the parent of an object
	 * @param {Object} el starting object
	 * @param {String} pTagName filter parent tag
	 * @return {Object}
	 */
	getParentNode : function (obj, tag) {
		if (obj == null) return null;
		else if (obj.nodeType == 1 && (obj.tagName.toLowerCase() == tag.toLowerCase() || tag == ""))
			return obj;
		else
			return nova.dom.getParentNode(obj.parentNode, tag);
	},
	
	/**
	 * Place an object on viewport's center
	 * 
	 * @param {Object} obj you dom object
	 */
	centerObjectOnViewport : function (obj) {
		obj.style.position="absolute";
		vpSize=nova.dom.getViewportSize();
		obj.style.zoom = "1";
		objSize= {width:obj.offsetWidth,height:obj.offsetHeight};
		docScrollPos=nova.dom.getDocumentScrollPosition();
		obj.style.left=(docScrollPos.left+vpSize.width-(vpSize.width/2)-(objSize.width/2))+"px";
		obj.style.top=(docScrollPos.top+vpSize.height-(vpSize.height/2)-(objSize.height/2))+"px";

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
		}
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
		}
	}
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
	}
};
/**
 * Nova's Drang'n Drop namespace
 * @constructor
 */
nova.dnd = {
	/*The object you drag*/ 
	_objDnd:null,
	_objParams: {},
	_dropZone:[],
	_nodeUnderMouse:null,
	/**
	 * Initialize dnd on objects
	 * @param {array} objects an array with object you want to drag
	 * @param {string} constraint (optional) "x" or "y" to disallow move on the specified axis
	 */
	connectDragObject:function(objects,constraint) {
		for(var i in objects) {
			if (objects[i] != null && objects[i].nodeType != null) {
				nova.connect(objects[i],"mousedown",this.dragStart);
				nova.connect(objects[i],"mouseup",this.dragEnd);
				nova.connect(objects[i],"mousemove",this.dragMove);
				
				this._objParams.constraint=(constraint!=null)?constraint.toLowerCase():"";
				
				objects[i].dnd=this;
				nova.html.addClass(objects[i],"drag");
				
				objects[i].initStyle= {position:objects[i].style.position,
										zIndex:objects[i].style.zIndex,
										height:objects[i].style.height,
										width:objects[i].style.width
										};
			}
		}
	},
	/**
	 * initialize dnd drop zone
	 * @param {Object} objects an array with object you want to drag in
	 */
	connectDropObject:function(objects) {
		for(var i in objects) {
			if (objects[i] != null && objects[i].nodeType != null) {
				objects[i].dnd=this;
				nova.html.addClass(objects[i],"drop");
				this._dropZone.push(objects[i]);
			}
		}
	},
	/**
	 * When you click down an object
	 * 
	 * @param {Object} e the Events object fired by browser
	 */
	dragStart:function(e) {
		this.dnd._objDnd=this;

		this.dnd._objParams.mousePos = nova.dom.getMousePos(e);
		this.dnd._objParams.objectPos = {x:nova.dom.getDomOffset(this,"left"),
										y:nova.dom.getDomOffset(this,"top"),
										h:nova.dom.getDomOffset(this,"height"),
										w:nova.dom.getDomOffset(this,"width")
										};
		
		this.dnd._objParams.style= {position:this.style.position,
									zIndex:this.style.zIndex,
									height:this.style.height,
									width:this.style.width
									};
		
		this.style.position="absolute";
		this.style.zIndex=200;
		this.style.height=this.dnd._objParams.objectPos.h+"px";
		this.style.width=this.dnd._objParams.objectPos.w+"px";
		
		document.dnd=this.dnd;
		nova.connect(document,"mousemove",this.dnd.dragMove);
		nova.connect(document,"mouseup",this.dnd.dragEnd);
		
	},
	/**
	 * When you click up an object
	 * 
	 * @param {Object} e the Events object fired by browser
	 */
	dragEnd:function(e) {
		var node=this.dnd._getNodeUnderMouse(e);
		this.dnd._objDnd.style.height=this.initStyle.height;
		this.dnd._objDnd.style.width=this.initStyle.width;
		
		if (node==false)
			this.dnd._objDnd.style.position=this.initStyle.position;
		else {
			//this.dnd._objDnd.style.position="relative";
			//this.dnd._objDnd.style.top=nova.dom.getDomOffset(this.dnd._objDnd,"top")-nova.dom.getDomOffset(node,"top");
			//this.dnd._objDnd.style.left=nova.dom.getDomOffset(this.dnd._objDnd,"left")-nova.dom.getDomOffset(node,"left");
			var n=nova.dom.moveNodeTo(this,node);
			nova.html.removeClass(node,"dropOk");
		}
		this.dnd._objDnd.style.zIndex=this.initStyle.zIndex;
		
		this.dnd._objDnd=null;
		this.dnd._objParams={constraint:this.dnd._objParams.constraint};
		
		nova.disconnect(document,"mousemove",this.dnd.dragMove);
		nova.disconnect(document,"mouseup",this.dnd.dragEnd);
		document.dnd=null;
	},
	/**
	 * When you move an object after a click down
	 * 
	 * @param {Object} e the Events object fired by browser
	 */
	dragMove:function(e) {
		if (this.dnd._objDnd==null)
			return false;
		
		var mouse=nova.dom.getMousePos(e);
		var delta = {x:(this.dnd._objParams.mousePos.x - this.dnd._objParams.objectPos.x),y:(this.dnd._objParams.mousePos.y - this.dnd._objParams.objectPos.y)};
		if (this.dnd._objParams.constraint!="x")
			this.dnd._objDnd.style.left = mouse.x - delta.x+"px";
		if (this.dnd._objParams.constraint!="y")
			this.dnd._objDnd.style.top = mouse.y - delta.y+"px";

		var node=this.dnd._getNodeUnderMouse(e);
		
		if (this.dnd._nodeUnderMouse!=null && this.dnd._nodeUnderMouse!=false && node!=this.dnd._nodeUnderMouse)
			nova.html.removeClass(this.dnd._nodeUnderMouse,"dropOk");
		
		if (node!==false && node!=this.dnd._nodeUnderMouse)
			nova.html.addClass(node,"dropOk");
			
		this.dnd._nodeUnderMouse=node;
	},
	/**
	 * Get the element under the mouse
	 * 
	 * @param {Object} e the events fired by browser
	 * @return {Object || false} object under mouse (false if no dropzone was under mouse)
	 * @private
	 */
	_getNodeUnderMouse: function(e){
		var mouse=nova.dom.getMousePos(e);
		for (var i = 0; i < this._dropZone.length; i++) {
				var objPos={top:nova.dom.getDomOffset(this._dropZone[i],"top"),
							left:nova.dom.getDomOffset(this._dropZone[i],"left"),
							width:nova.dom.getDomOffset(this._dropZone[i],"width"),
							height:nova.dom.getDomOffset(this._dropZone[i],"height")
							}
				
				if (mouse.x >= objPos.left && mouse.x <= (objPos.left+objPos.width) &&
					mouse.y >= objPos.top && mouse.y <= (objPos.top+objPos.height)) { return this._dropZone[i]; }
		}
		return false;
	}
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
	/**
	 * Update an HTML object with a result of an XHR request
	 * 
	 * <code>
	 *  args {
	 * 		file:"page.htm",
	 * 		method:"POST" || "GET",
	 * 		queryString:"var1=a&var2=b",
	 * 		formNode:document.getElementById("test"),
	 * 		onError:function () {}
	 * }
	 * </code>
	 *
	 * @param {Object} an HTML object to update
	 * @param {Object} args see exemple
	 * @return {Bool} false if browser doesn't support XHR 
	 */
	update:function(obj,args) {
		args.update=obj;
		args.onLoad =function () {
			arguments[1].update.innerHTML =arguments[0];
		};
		return nova.io.send(args);
	}
};
/**
 * Nova's tooltip object
 * @constructor
 */
nova.tooltip = {
	/**
	 * Add a tooltip on obj
	 * 
	 * props exemple :
	 * {
	 * content:"hello",
	 * className : "myCSSStyle",
	 * offsetX:2,
	 * offsetY:5
	 * }
	 * 
	 * @param {Object} obj the obj to add tooltip
	 * @param {Object} props all props (see exemple)
	 */
	connect : function(obj,props) {
	    
	    obj.tooltips=document.createElement('div');
		obj.tooltips.props=props;
		if (nova.variable.isSet(props.className))
			nova.html.setClass(obj.tooltips,props.className);			
		nova.html.setStyle(obj.tooltips,{position: 'absolute',display: 'none'})
	    
		if (nova.variable.isSet(props.content)) {
			var tip = document.createElement('div');
			nova.html.setClass(tip,'content');
			tip.innerHTML = props.content
		}
	    obj.tooltips.appendChild(tip);
	    document.body.appendChild(obj.tooltips);
		nova.connect(obj,"mousemove",nova.tooltip._show);
		nova.connect(obj,"mouseout",nova.tooltip._hide);
	    	
	},
	/**
	 * Disconnect a tooltip from obj
	 * @param {Object} obj the obj to disconnect tooltip's
	 */
	disconnect : function(obj) {
		nova.dom.removeNode(obj.tooltips);
		delete obj.tooltips;
		nova.disconnect(obj,"mousemove",nova.tooltip._show);
		nova.disconnect(obj,"mouseout",nova.tooltip._hide);
	},
	/**
	 * Show a tooltip
	 * @private
	 * @param {Object} evt
	 */
	_show : function(evt) {
		nova.tooltip._positionTip(evt, this.tooltips);
		if (this.tooltips.style.display=="none"){
			nova.effects.fadeIn(this.tooltips,{duration:250});
		}
	},
	/**
	 * Hide a tooltip
	 * @private
	 */
	_hide : function() {
		nova.effects.fadeOut(this.tooltips,{duration:250});
	},
	/**
	 * Put the tooltips in the good place !
	 * @private
	 * @param {Object} event
	 * @param {Object} obj
	 */
	_positionTip: function(event,obj){
	    var offsets = {x: obj.props.offsetX,y: obj.props.offsetY};
	    var mouse = nova.dom.getMousePos(event);
	    var page = nova.dom.getViewportSize();
	    var tip = {x: mouse.x + obj.props.offsetX + obj.offsetWidth,
	    			y : mouse.y + obj.props.offsetY + obj.offsetHeight
				};
	
	    // inverse x or y to keep tooltip within viewport
	    if(tip.x>page.x) {offsets.x = 0-(obj.offsetWidth  + obj.props.offsetX); }
	    if(tip.y>page.y) {offsets.y = 0-(obj.offsetHeight + obj.props.offsetY); }
	
	    nova.html.setStyle(obj,{ left: (mouse.x + offsets.x) + 'px',
	      						top: (mouse.y + offsets.y) + 'px'}
						);
  }
}

/**
 * Nova's shortcut object
 * @constructor
 */
nova.shortcut = {
	/**
	 * Add a new key shortcut
	 * Parameter are like that :
	 * {'type':'keydown','propagate':false,'target':document,'callback':function() {}}
	 * parameter type : the event witch lauche the shortcut function
	 * parameter propagate : if true, events wont be stoped after your function and an other function can trappe him
	 * parameter target : the object wich have the shortcut (default : document, if target is a string, we try to found the object with nova.dom.getElementsByAnything)
	 * parameter callback : the function the shortcut will launch 
	 * 
	 * @param {String} shortcut the key shortcut (like CTRL + F1)
	 * @param {Object} opt shortcut parameter (see exemple)
	 */
	add : function (shortcut,opt) {
		//Provide a set of default options
		var default_options = {
			'type':'keydown',
			'propagate':false,
			'target':document,
			'callback':function() {}
		};
		
		if(!opt) opt = default_options;
		else {
			for(var dfo in default_options) {
				if(typeof opt[dfo] == 'undefined') opt[dfo] = default_options[dfo];
			}
		}
	
		var ele = opt.target
		if(typeof opt.target == 'string') ele = nova.dom.getElementsByAnything(opt.target);
		if (!nova.variable.isSet(ele.shortcut))
			ele.shortcut=[];
			
		ele.shortcut[shortcut.toLowerCase()]=opt;	
		nova.connect(ele,opt['type'],this._onCallShorcut);
		
	},
	/**
	 * Remove a shortcut
	 * Parameter are like that :
	 * {'type':'keydown','target':document,'callback':function() {}}
	 * parameter type : the event witch lauche the shortcut function
	 * parameter target : the object wich have the shortcut (default : document, if target is a string, we try to found the object with nova.dom.getElementsByAnything) 
	 * 
	 * @param {String} shortcut the key shortcut (like CTRL + F1)
	 * @param {Object} opt shortcut parameter (see exemple)
	 */
	remove:function(shortcut,opt) {
		var default_options = {
			'type':'keydown',
			'target':document
		};
		
		if(!opt) opt = default_options;
		else {
			for(var dfo in default_options) {
				if(typeof opt[dfo] == 'undefined') opt[dfo] = default_options[dfo];
			}
		}

		var ele = opt.target

		nova.disconnect(ele,opt['type'],this._onCallShorcut);		
		if(typeof opt.target == 'string') ele = nova.dom.getElementsByAnything(opt.target);
		delete ele.shortcut[shortcut.toLowerCase()];
	},
	/**
	 * Launched when a shortcut is fired
	 * 
	 * @param {Object} e the events
	 * @private
	 */
	_onCallShorcut:function(e) {
		e = e || window.event;

		//Find Which key is pressed
		if (e.keyCode) code = e.keyCode;
		else if (e.which) code = e.which;
		var character = String.fromCharCode(code).toLowerCase();

		//Key Pressed - counts the number of valid keypresses - if it is same as the number of keys, the shortcut function is invoked
		var kp = 0;
		
		//Work around for stupid Shift key bug created by using lowercase - as a result the shift+num combination was broken
		var shift_nums = {
			"`":"~",
			"1":"!",
			"2":"@",
			"3":"#",
			"4":"$",
			"5":"%",
			"6":"^",
			"7":"&",
			"8":"*",
			"9":"(",
			"0":")",
			"-":"_",
			"=":"+",
			";":":",
			"'":"\"",
			",":"<",
			".":">",
			"/":"?",
			"\\":"|"
		}
		//Special Keys - and their codes
		var special_keys = {
			'esc':27,
			'escape':27,
			'tab':9,
			'space':32,
			'return':13,
			'enter':13,
			'backspace':8,

			'scrolllock':145,
			'scroll_lock':145,
			'scroll':145,
			'capslock':20,
			'caps_lock':20,
			'caps':20,
			'numlock':144,
			'num_lock':144,
			'num':144,
			
			'pause':19,
			'break':19,
			
			'insert':45,
			'home':36,
			'delete':46,
			'end':35,
			
			'pageup':33,
			'page_up':33,
			'pu':33,

			'pagedown':34,
			'page_down':34,
			'pd':34,

			'left':37,
			'up':38,
			'right':39,
			'down':40,

			'f1':112,
			'f2':113,
			'f3':114,
			'f4':115,
			'f5':116,
			'f6':117,
			'f7':118,
			'f8':119,
			'f9':120,
			'f10':121,
			'f11':122,
			'f12':123
		}
		var allKeys = this.shortcut;

		for(var oneKey in allKeys) {
			keys=oneKey.split("+");
			kp=0;
			for(var i=0; k=keys[i],i<keys.length; i++) {

				//Modifiers
				if(k == 'ctrl' || k == 'control') {
					if(e.ctrlKey) kp++;
	
				} else if(k ==  'shift') {
					if(e.shiftKey) kp++;
	
				} else if(k == 'alt') {
						if(e.altKey) kp++;
	
				} else if(k.length > 1) { //If it is a special key
					if(special_keys[k] == code) kp++;
	
				} else { //The special keys did not match
					if(character == k) kp++;
					else {
						if(shift_nums[character] && e.shiftKey) { //Stupid Shift key bug created by using lowercase
							character = shift_nums[character]; 
							if(character == k) kp++;
						}
					}
				}
			}
	
			if(kp == keys.length) {
				
				allKeys[oneKey].callback(e);
	
				if(!allKeys[oneKey].propagate) { //Stop the event
					//e.cancelBubble is supported by IE - this will kill the bubbling process.
					e.cancelBubble = true;
					e.returnValue = false;
					//e.stopPropagation works only in Firefox.
					if (e.stopPropagation) {
						e.stopPropagation();
						e.preventDefault();
					}
					return false;
				}
			}
		}
		
	}
};
/**
 * Nova's tabel namespace
 * @constructor
 */
nova.table= {
	/**
	 * @constructor
	 */
	sortable : {
		/**
		 * Make a TABLE sortable
		 * props exemple :
		 * props = {sortedAscClassName:"ascSorted",sortedDescClassName:"descSorted", ignoreSortOnClass:"plip"}
		 * 
		 * @param {Object} obj the table to make sortable
		 * @param {Object} props properties (see exemple)
		 */
		init : function (obj,props) {
			if (typeof props!="object")
				props={sortedAscClassName:"asc",sortedDescClassName:"desc",ignoreSortOnClass:"unsorted"},
			
			nova.table.sortable.SORT_COLUMN_INDEX=null;
			
			obj.props=props;
			
	 		if (!obj.tagName || obj.tagName.toLowerCase()!="table")
				return nova.debug.raiseError("you can sort only table element");
				
			nova.table.sortable._makeSortable(obj);
 		},
		/**
		 * @private
		 * connect events on header
		 * @param {Object} table table dom object
		 */
		_makeSortable : function (table) {
		    if (table.rows && table.rows.length > 0) {
		        var firstRow = table.rows[0];
		    }
		    if (!firstRow) return;
 
		    // We have a first row: assume it's the header, and make its contents clickable links
		    for (var i=0;i<firstRow.cells.length;i++) {
		        var cell = firstRow.cells[i];
				nova.connect(cell,"click",nova.table.sortable._resortTable);
		    }
		},
		/**
		 * @private
		 * get text content of a node
		 * @param {Object} el dom element
		 * @return {String}
		 */
		_getInnerText : function (el) {
			if (typeof el == "string") return el;
			if (typeof el == "undefined") { return el };
			if (el.innerText) return el.innerText;	//Not needed but it is faster
			var str = "";
			var cs = el.childNodes;
			var l = cs.length;
			for (var i = 0; i < l; i++) {
				switch (cs[i].nodeType) {
					case 1: //ELEMENT_NODE
						str += nova.table.sortable._getInnerText(cs[i]);
						break;
					case 3:	//TEXT_NODE
						str += cs[i].nodeValue;
						break;
				}
			}
			return str;
		},
 		/**
 		 * @private
 		 * sort the array
 		 * @param {Object} evt events object
 		 */
		_resortTable: function (evt) {
		    // get the span
			var td=this;
		    var column = td.cellIndex;
			var table;
		    var tTable = table = nova.dom.getParentNode(td,'table');
			var startline=1;
			var tbody=table.getElementsByTagName("tbody");
			if (tbody.length>1) {
				startline = 0;
				table = tbody[0];
			}
		    // Work out a type for the column
		    if (table.rows.length <= 1) return;
		    var itm =  nova.table.sortable._getInnerText(table.rows[1].cells[column]);
		    sortfn =  nova.table.sortable._sort_caseinsensitive;
		    if (itm.match(/^\d\d[\/-]\d\d[\/-]\d\d\d\d$/)) sortfn =  nova.table.sortable._sort_date;
		    if (itm.match(/^\d\d[\/-]\d\d[\/-]\d\d$/)) sortfn =  nova.table.sortable._sort_date;
		    if (itm.match(/^[£$]/)) sortfn =  nova.table.sortable._sort_currency;
		    if (itm.match(/^[\d\.]+$/)) sortfn =  nova.table.sortable._sort_numeric;
		    nova.table.sortable.SORT_COLUMN_INDEX = column;
		    var firstRow = new Array();
		    var newRows = new Array();
		    for (i=0;i<table.rows[0].length;i++) { firstRow[i] = table.rows[0][i]; }
		    for (j=startline;j<table.rows.length;j++) { newRows[j-startline] = table.rows[j]; }
		 
		    newRows.sort(sortfn);
		 
 			var firstRow = tTable.rows[0];
			var cell=null;
		    for (var i=0;i<firstRow.cells.length;i++) {
		        cell = firstRow.cells[i];
				nova.html.removeClass(cell,tTable.props.sortedAscClassName);
				nova.html.removeClass(cell,tTable.props.sortedDescClassName);
		    }		 
		 
		    if (td.getAttribute("sortdir") == 'down') {
		        newRows.reverse();
		        td.setAttribute('sortdir','up');
				nova.html.removeClass(td,tTable.props.sortedAscClassName);
				nova.html.addClass(td,tTable.props.sortedDescClassName);
		    } else {
		        td.setAttribute('sortdir','down');
				nova.html.removeClass(td,tTable.props.sortedDescClassName);
				nova.html.addClass(td,tTable.props.sortedAscClassName);
		    }
		 
		    // We appendChild rows that already exist to the tbody, so it moves them rather than creating new ones
		    // don't do sortbottom rows
		    for (i=0;i<newRows.length;i++) { 
				if (!nova.html.hasClass(newRows[i],tTable.props.ignoreSortOnClass))
					table.tBodies[0].appendChild(newRows[i]);
			}
		    // do sortbottom rows only
		    for (i=0;i<newRows.length;i++) { 
				if (nova.html.hasClass(newRows[i],tTable.props.ignoreSortOnClass)) 
					table.tBodies[0].appendChild(newRows[i]);
			}			
		},
 		/**
 		 * @private
 		 * sort method
 		 * @param {Object} a
 		 * @param {Object} b
 		 * @return {Bool}
 		 */
		_sort_date : function (a,b) {
		    // y2k notes: two digit years less than 50 are treated as 20XX, greater than 50 are treated as 19XX
		    var aa = nova.table.sortable._getInnerText(a.cells[nova.table.sortable.SORT_COLUMN_INDEX]);
		    var bb = nova.table.sortable._getInnerText(b.cells[nova.table.sortable.SORT_COLUMN_INDEX]);
		    if (aa.length == 10) {
		        var dt1 = aa.substr(6,4)+aa.substr(3,2)+aa.substr(0,2);
		    } else {
		        var yr = aa.substr(6,2);
		        if (parseInt(yr) < 50) { yr = '20'+yr; } else { yr = '19'+yr; }
		        var dt1 = yr+aa.substr(3,2)+aa.substr(0,2);
		    }
		    if (bb.length == 10) {
		        var dt2 = bb.substr(6,4)+bb.substr(3,2)+bb.substr(0,2);
		    } else {
		        var yr = bb.substr(6,2);
		        if (parseInt(yr) < 50) { yr = '20'+yr; } else { yr = '19'+yr; }
		        var dt2 = yr+bb.substr(3,2)+bb.substr(0,2);
		    }
		    if (dt1==dt2) return 0;
		    if (dt1<dt2) return -1;
		    return 1;
		},
 		/**
 		 * @private
 		 * sort method
 		 * @param {Object} a
 		 * @param {Object} b
 		 * @return {Bool}
 		 */
		_sort_currency : function(a,b) { 
		    var aa = nova.table.sortable._getInnerText(a.cells[nova.table.sortable.SORT_COLUMN_INDEX]).replace(/[^0-9.]/g,'');
		    var bb = nova.table.sortable._getInnerText(b.cells[nova.table.sortable.SORT_COLUMN_INDEX]).replace(/[^0-9.]/g,'');
		    return parseFloat(aa) - parseFloat(bb);
		},
 		/**
 		 * @private
 		 * sort method
 		 * @param {Object} a
 		 * @param {Object} b
 		 * @return {Bool}
 		 */
		_sort_numeric : function(a,b) { 
		 
		    var aa = parseFloat(nova.table.sortable._getInnerText(a.cells[nova.table.sortable.SORT_COLUMN_INDEX]));
		    if (isNaN(aa)) aa = 0;
		    var bb = parseFloat(nova.table.sortable._getInnerText(b.cells[nova.table.sortable.SORT_COLUMN_INDEX])); 
		    if (isNaN(bb)) bb = 0;
		    return aa-bb;
		},
		/**
 		 * @private
 		 * sort method
 		 * @param {Object} a
 		 * @param {Object} b
 		 * @return {Bool}
 		 */
		_sort_caseinsensitive : function (a,b) {
		    var aa = nova.table.sortable._getInnerText(a.cells[nova.table.sortable.SORT_COLUMN_INDEX]).toLowerCase();
		    var bb = nova.table.sortable._getInnerText(b.cells[nova.table.sortable.SORT_COLUMN_INDEX]).toLowerCase();
		    if (aa==bb) return 0;
		    if (aa<bb) return -1;
		    return 1;
		},
		/**
 		 * @private
 		 * sort method
 		 * @param {Object} a
 		 * @param {Object} b
 		 * @return {Bool}
 		 */
		_sort_default : function (a,b) {
		    var aa = ts_getInnerText(a.cells[nova.table.sortable.SORT_COLUMN_INDEX]);
		    var bb = ts_getInnerText(b.cells[nova.table.sortable.SORT_COLUMN_INDEX]);
		    if (aa==bb) return 0;
		    if (aa<bb) return -1;
		    return 1;
		}
	}
};
nova.toc = {
	_state : 'block',
	/**
	 * Create a toc for the actual page
	 * @param {String} title the title of the toc
	 * @param {String} ignore the object which have className==ignore are skiped
	 */
	init : function (title, ignore) {
    	var toc = document.createElement('div');
    	toc.id = 'toc';		
    	var tocTitle = toc.appendChild(document.createElement('div'));
		nova.html.addClass(tocTitle,'title');
	    tocTitle.onclick = nova.toc._toggleToc;
	    tocTitle.innerHTML = title;
	    var tocContent = toc.appendChild(document.createElement('div'));
		nova.html.addClass(tocContent,'content');
	    var tocElemnts = nova.dom.getElementsByAnything('h1','h2','h3','h4');
	    if (tocElemnts.length < 2) return;
	
	    for (var i=0;i<tocElemnts.length;i++){
	        if (nova.html.hasClass(tocElemnts[i],ignore)) continue;
			var tmp = document.createElement('a');
	        tmp.innerHTML = tocElemnts[i].innerHTML;
	        tmp.href = '#link' + i;
	        nova.html.addClass(tmp,'indent'+tocElemnts[i].nodeName.toLowerCase());
	        tocContent.appendChild(tmp);			
	        var tmp2 = document.createElement('a');
	        tmp2.name = tmp2.id = 'link' + i;
	        tocElemnts[i].parentNode.insertBefore(tmp2,tocElemnts[i]);
	    }
	    document.body.insertBefore(toc,document.body.childNodes[0]);
	},
	/**
	 * @private
	 * toggle the toc
	 */
	_toggleToc : function () {
	    nova.toc._state = (nova.toc._state == 'none') ? 'block' : 'none';
	    document.getElementById('toc').lastChild.style.display = nova.toc._state;
	} 
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
	 *  Verifier certaines chose avant la validation :
	 * Le parametre de la fonction (3eme arguments) est le contenu du champs désigné
	 *  nova.form.validation.connect(document.getElementById('forms'), 'beforevalidate',function() { if (arguments[0].length==3) return true; else return false;});
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
			
			var oldState=_this.inErrors['isNum'];
			
			_this.inErrors['isNum']=false;
			_this.className=_this.className.replace(/ *isnum/,'');
			if (isNaN(_this.value)) {
				_this.className+=' isnum';
				_this.inErrors['isNum']=true;
			}	
			if (_this.inErrors['isNum'] != oldState && nova.variable.isSet(_this.checkErrorCallback) && nova.variable.isFunction(_this.checkErrorCallback))
				_this.checkErrorCallback.apply(_this,["isNum",_this.inErrors['isNum']]);			
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
			var oldState=_this.inErrors['isInt'];
			_this.inErrors['isInt']=false;
			_this.className=_this.className.replace(/ *isint/,'');
			var matc=_this.value.match(/^[0-9]+$/);
			if ((_this.value!="") && (matc==null)) {
				_this.className+=' isint';
				_this.inErrors['isInt']=true;
			}
			if (_this.inErrors['isInt'] != oldState && nova.variable.isSet(_this.checkErrorCallback) && nova.variable.isFunction(_this.checkErrorCallback))
				_this.checkErrorCallback.apply(_this,["isInt",_this.inErrors['isInt']]);
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
			var oldState=_this.inErrors['isMail'];	
			_this.inErrors['isMail']=false;
			_this.className=_this.className.replace(/ *ismail/,'');
			var matc=_this.value.match(/^.+\@.+\..+$/);
			if ((_this.value!="") && (matc==null)) {
				_this.className+=' ismail';
				_this.inErrors['isMail']=true;
			}
			if (_this.inErrors['isMail'] != oldState && nova.variable.isSet(_this.checkErrorCallback) && nova.variable.isFunction(_this.checkErrorCallback))
				_this.checkErrorCallback.apply(_this,["isMail",_this.inErrors['isMail']]);
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
			var oldState=_this.inErrors['isAlpha'];	
			_this.inErrors['isAlpha']=false;
			_this.className=_this.className.replace(/ *isalpha/,'');
			var matc=_this.value.match(/^[a-z]+$/i);
			if ((_this.value!="") && (matc==null)) {
				_this.className+=' isalpha';
				_this.inErrors['isAlpha']=true;
			}
			if (_this.inErrors['isAlpha'] != oldState && nova.variable.isSet(_this.checkErrorCallback) && nova.variable.isFunction(_this.checkErrorCallback))
				_this.checkErrorCallback.apply(_this,["isAlpha",_this.inErrors['isAlpha']]);
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
			var oldState=_this.inErrors['isAlphanum'];	
			_this.inErrors['isAlphanum']=false;
			_this.className=_this.className.replace(/ *isalphanum/,'');
			var matc=_this.value.match(/^[a-z0-9]+$/i);
			if ((_this.value!="") && (matc==null)) {
				_this.className+=' isalphanum';
				_this.inErrors['isAlphanum']=true;
			}
			if (_this.inErrors['isAlphanum'] != oldState && nova.variable.isSet(_this.checkErrorCallback) && nova.variable.isFunction(_this.checkErrorCallback))
				_this.checkErrorCallback.apply(_this,["isAlphanum",_this.inErrors['isAlphanum']]);
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
			var oldState=_this.inErrors['matchRegexp'];	
			_this.inErrors['matchRegexp']=false;
			_this.className=_this.className.replace(/ *matchregexp/,'');
			var matc=_this.value.match(_this.matchregexp);
			if ((_this.value!="") && (matc==null)) {
				_this.className+=' matchregexp';
				_this.inErrors['matchRegexp']=true;
			}
			if (_this.inErrors['matchRegexp'] != oldState && nova.variable.isSet(_this.checkErrorCallback) && nova.variable.isFunction(_this.checkErrorCallback))
				_this.checkErrorCallback.apply(_this,["matchRegexp",_this.inErrors['matchRegexp']]);
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
			var oldState=_this.inErrors['mendatory'];
			_this.inErrors['mendatory']=false;
			if (_this.value=='') {
				_this.className+=' mendatory';
				_this.inErrors['mendatory']=true;
			} else 
				_this.className=_this.className.replace(/ *mendatory/,'');
			if (_this.inErrors['mendatory'] != oldState && nova.variable.isSet(_this.checkErrorCallback) && nova.variable.isFunction(_this.checkErrorCallback))
				_this.checkErrorCallback.apply(_this,["mendatory",_this.inErrors['mendatory']]);
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
				_this.className=_this.className.replace(/ *copyof/,'');
				_this.parentPointer.disconnect(_this.copyof,"copyOfUpdate",_this);
				return;
			}	
			var oldState=_this.inErrors['copyOf'];
			_this.inErrors['copyOf']=false;
			_this.className=_this.className.replace(/ *copyof/,'');
			if ((_this.value!=_this.copyof.value) || (_this.value=='')) {
				_this.className+=' copyof';
				_this.inErrors['copyOf']=true;
			}
			if (_this.inErrors['copyOf'] != oldState && nova.variable.isSet(_this.checkErrorCallback) && nova.variable.isFunction(_this.checkErrorCallback))
				_this.checkErrorCallback.apply(_this,["copyOf",_this.inErrors['copyOf']]);
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
		 * Check some other thing before validate the forms
		*/
		beforevalidate : function () {
			_this=this;
		
			if ((arguments[0].fromConnect) || (arguments[0].fromRefresh)) {
				_this=arguments[0];
			} else if (arguments[0].fromDisconnect) {
				_this=arguments[0];
				_this.inErrors['beforevalidate']=false;
				return;
			}	
	
			_this.inErrors['beforevalidate']=false;
			if (!_this.beforevalidate(_this.value)) {
				_this.inErrors['beforevalidate']=true;
			}
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
				//if (elm[i]==_this) continue;
				if (typeof elm[i] == "function") continue;
				for (j in elm[i].inErrors) {
					if (typeof elm[i].inErrors[j] == "function") continue;
					if (elm[i].inErrors[j]) {
						_this.inErrors['validate']=true;
						_this.Errors.push(elm[i]);
						break;
		  			}
				}	
			}
			if (_this.inErrors['validate']) {
				if (arguments[0] && arguments[0].preventDefault) {
					arguments[0].preventDefault(); // DOM style
					arguments[0].stopPropagation();
				} else {
					event.returnValue = false;
				    event.cancelBubble = true;
				}
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
			var oldState=_this.inErrors['Constraint'];
			_this.inErrors['Constraint']=false;
			_this.className=_this.className.replace(/ *constraint/,'');
			if (!_this.constraint(_this.value)) {
				_this.className+=' constraint';
				_this.inErrors['Constraint']=true;
			}
			if (_this.inErrors['Constraint'] != oldState && nova.variable.isSet(_this.checkErrorCallback) && nova.variable.isFunction(_this.checkErrorCallback))
				_this.checkErrorCallback.apply(_this,["Constraint",_this.inErrors['Constraint']]);
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
				case 'beforevalidate':
					this.type="submit";
					return this.beforevalidate;					
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
		 * execute a callback function when a field is in error
		 * The callback method got 2 args :
		 *    The verification in progress (ex: isInt, isMail...)
		 *    The status (ex : true is there is an error, false elsewhere)
		 * Note : in the callback method, "this" is the input object
		 * @param {Object} obj the object to add phrase
		 * @param {Object} method the callback to execute when a field is in error
		 */
		onCheckDoCallback:function(obj, method) {
			obj.checkErrorCallback=method;
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
			var typ=this.type.toString();
			var fnStr=fn.toString();
			if ( obj.attachEvent ) {
				obj['e'+typ+fnStr] = fn;
				obj[typ+fnStr] = function(){obj['e'+typ+fnStr]( window.event );};
				obj.attachEvent( 'on'+typ, obj[typ+fnStr] );
			} else
				obj.addEventListener( typ, fn, false );
	 
	 		//colle aussi sur le blur
			if (this.type=="keyup") {
				if ( obj.attachEvent ) {
					obj['e'+'blur'+fnStr] = fn;
					obj['blur'+fnStr] = function(){obj['e'+'blur'+fnStr]( window.event );};
					obj.attachEvent( 'on'+'blur', obj['blur'+fnStr] );
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
			var typ=this.type.toString();
			var fnStr=fn.toString();
			if ( obj.detachEvent ) {
				obj.detachEvent( 'on'+typ, obj[typ+fnStr] );
				obj[typ+fnStr] = null;
			} else
				obj.removeEventListener( typ, fn, false );
			
			//colle aussi sur le blur
			if (this.type=="keyup") {
				if ( obj.detachEvent ) {
					obj['blur'+fnStr] = null;
					obj.detachEvent( 'on'+'blur', obj['blur'+fnStr] );
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
	}
};
nova.prototypes = {
	array : function() {
		/**
		 * like in_array in php
		 * @param {Object} valeur
		 * @return {Integer} -1 if not found, else return key
		 */
		if (!Array.prototype.inArray) {
			Array.prototype.inArray = function(valeur) {
				for (var i in this) { if (this[i] == valeur) return i;}
				return -1;
			}
		}
		/**
		 * insert a value at position
		 * @param {Object} i
		 * @param {Object} value
		 */
		if (!Array.prototype.insert) {
			Array.prototype.insert=function(i,value){
				if(i>=0){
					var a=this.slice(),b=a.splice(i);
					a[i]=value;
					return a.concat(b);
				}
			}
		}
		/**
		 * Clone an array
		 */
		if (!Array.prototype.clone) {
			Array.prototype.clone=function() {
				var dest=[];
		  		for (var props in this)
		    		dest[props] = this[props];
		  		return dest;
			}
		}
	}
	
};
	
for (var i in nova.prototypes)
	nova.prototypes[i]();
