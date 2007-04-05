/**
 * @library
 * A tool for automatically publishing code documentation from
 * embedded JavaScript comments.
 *
 * @VERSION 0.1
 * @svn-id $Id: jsdoc.js 168 2007-03-28 09:42:16Z micmath $
 * @copyright (c) 2007 Michael Mathews
 * @license GNU Lesser General Public License
 */

/**
 * The base container for all objects in this library.
 *
 * @private
 * @namespace
 */
JSDoc = {
	regex: {
		// These are here to make it possible for the calling
		// script to modify them before the call to JSDoc.parse.
		block:      /\/\*\*([^*][\S\s]*?)\*\/\s*([^\/\n\r]*)/g, // comment and codeline. Codeline ends at / so we don't slurp up the next comment
		tagStart:   /^\s*@/m,
		tag:        /(\S+)\s*([\S\s]*\S)?/, // either a short or long tag
		summaryTag: /(?:\{(.+?)\})?\s*(?:(\S+)\s*-\s*)?([\S\s]*\S)/, // syntax: [{type}] [name -] description
		longTag:    /(?:\{(.+?)\})?\s*(?:(\S+)(?:\s+-\s*)?([\S\s]*))?/, // syntax: [{type}] name[ - ][description]
		shortTag:   /(?:\{(.+?)\})?\s*([\S\s]*)/ // syntax: [{type}] [description]
	},
	
	/**
	 * Get the doclet with the given name.
	 *
	 * @method
	 * @param {String} nodeName The full name of the doclet you want. Like: "A.B.c"
	 * @return {JSDoc.Doclet}
	 */
	doclet: function(nodeName) {
		var cursor = JSDoc.doclets;
		var names = nodeName.split(".");
		for (var i = 0; i < names.length; i++) {
			cursor = cursor.children["doc$"+names[i]];
		}
		if (cursor == null) return null;
		return cursor.doclet;
	},
	
	/**
	 * Reset the JSDoc object to it's initial (pre-parse) state.
	 *
	 * @private
	 * @method
	 */
	init: function() {
		JSDoc.doclets = { library: null, children: {} };
		JSDoc.printBuffer = [];
	}	
};
JSDoc.init();

/**
 * Get the contents of the given URL.
 *
 * @private
 * @method
 * @param {String} URL you wish to read, can be local (relative to the main script).
 */
JSDoc.read = function() {
	if (typeof window != "undefined") {
		if (window.ActiveXObject) {  // call ActiveX first in IE7 due to read permissions for local files
			var xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		else if (window.XMLHttpRequest) {
			var xmlHttp = new XMLHttpRequest;
		}
		else throw "Unsupported environment.";
		
		return function (url) {
			xmlHttp.open("GET", url, false);
			xmlHttp.send(null);
			
			/**@returns {Object} An object containing the content.*/
			return { url: url, content: xmlHttp.responseText };
		}
	}
	else if (typeof readFile != "undefined") { // running Rhino?
		return function(path) {
			return { url: path, content: readFile(path) };
		}
	}
	else if (typeof File != "undefined") { // running Spidermonkey?
		throw "Unsupported environment.";
	}
	else throw "Unsupported environment.";
	/** @exception "Unsupported environment." */
}();

/**
 * Extract JSDoc comments from source code. Found comments are turned into
 * JSDoc.Doclets and added to the parse tree that JSDoc.render will use.
 *
 * @method
 * @param {String|String[]} srcFiles - A URI string or an array of URI strings.
 * @throws "No content found in srcFile:"
 */
JSDoc.parse = function(srcFiles) {
	JSDoc.init();
	JSDoc.Tree.init();

	if (typeof srcFiles == "string") srcFiles = [srcFiles];
	JSDoc.doclets.library = new JSDoc.Doclet("@library", srcFiles[0]);

	for (var i = 0; i < srcFiles.length; i++) {
		var content = JSDoc.read(srcFiles[i]).content;
		if (content == "") throw 'No content found in srcFile: "'+srcFiles[i]+'.';
		
		while((blocks = JSDoc.regex.block.exec(content)) && blocks != null) {
			var newDoclet = new JSDoc.Doclet(JSDoc.util.clean(blocks[1]), srcFiles[i], blocks[2]);
			JSDoc.Tree.add(newDoclet);
		}
	}
};
JSDoc.parse.currentScope = null;

/**
 * Various utilty functions used by the JSDoc object.
 *
 * @private
 */
JSDoc.util = {
	indent: /^\s*\*+/gm,
	codeStructure: {
		functionDeclaration: /^function\s+([a-z_$][a-z0-9_.]*)\s*\(/i,
		objectAssignment:    /^(?:var\s+)?([a-z_$][a-z0-9_.]*)\s*=/i,
		propertyAssignment:  /^([a-z_$][a-z0-9_$.]*)\s*:/i
	},
	findNameInCode: function(codeLine, scope) {
		if (scope == null) scope = JSDoc.parse.currentScope;
		codeLine = codeLine.replace(/this\./, scope+"."); // within a constructor, what is "this"?
		for (r in JSDoc.util.codeStructure) {
			var nameMatch = codeLine.match(JSDoc.util.codeStructure[r]);
			if (nameMatch) {
				name = nameMatch[1].replace(/\.prototype/, ""); // prototype is not part of the run-time name
				name = name.replace(/\.__proto__/, ""); // __proto__ is not part of the run-time name
				if (r == "propertyAssignment") {
					name = scope+"."+name; // for property assignments, prepend scope
				}
				return name;
			}
		}
	},
	fileName: function(path) {
		var nameStart = Math.max(path.lastIndexOf("/")+1, path.lastIndexOf("\\")+1, 0);
		return path.substring(nameStart);
	},
	clean: function(text) {
		return text.replace(JSDoc.util.indent, "\n");
	}
};

// override these in your template
onRenderStart = function(library, buffer) {};
onDocletStart = function(doclet, buffer) {};
onDocletEnd = function(doclet, buffer) {};
onRenderEnd = function(library, buffer) {};
	
/**
 * Format the data tree into readable output.
 * Adds formatted output to the JSDoc.printBuffer.
 *
 * @method
 * @param {String} templateFile - Relative path to the template file.
 * @param {JSDoc.Doclet} node - Provided by the recursive call-back.
 * @throws "No content in that templateFile."
 */
JSDoc.render = function(templateFile, node) {
	if (node == null) node = JSDoc.doclets;
	
	if (templateFile != null) {
		try { var templateSrc = JSDoc.read(templateFile); }
		catch (e) { throw "Can't read that templateFile."; }

		try { eval(templateSrc.content); }
		catch (e) { throw "Can't eval that templateFile."; }
	}

	onRenderStart(JSDoc.doclets.library, JSDoc.printBuffer);
	JSDoc.Tree.walk(node);
	onRenderEnd(JSDoc.doclets.library, JSDoc.printBuffer);
}

/**
 * A unit of documentation about a code object.
 *
 * @private
 * @constructor
 * @param commentText
 * @param srcFile
 * @property {string} name
 * @property {string} description
 * @property {string} src
 * @property {string} codeLine
 * @property {JSDoc.Doclet.Tag[]} tag
 * @property {boolean} isLibrary
 * @property {boolean} isConstructor
 * @property {boolean} isPrivate
 * @property {boolean} isIgnored
 * @property {boolean} isDeprecated
 */
JSDoc.Doclet = function(commentText, srcFile, codeLine) {
	this.name = null;
	this.description = "";
	this.src = srcFile;
	this.codeLine = codeLine;
	
	this.isLibrary = false;
	this.isConstructor = false;
	this.isPrivate = false;
	this.isIgnored = false;
	this.isDeprecated = false;
	this.isFragment = false;
	
	this.tags = []; // access a tag by its position
	this.tagHash = {}; // access a tag by its name
	
	// if doclet starts with text that isn't tagged, then tag that text as a @summary
	if (commentText.match(/^\s*[^@\s]/)) commentText = "@summary "+commentText;
	
	var parts = commentText.split(JSDoc.regex.tagStart);
	for (var i = 0; i < parts.length; i++) {
		var tag = new JSDoc.Doclet.Tag(parts[i]);
		if (!tag.title) continue;
		tag.title = tag.title.toLowerCase();
		
		this.tags.push(tag);
		
		if (this.tagHash["tag$"+tag.title] == null) this.tagHash["tag$"+tag.title] = new Array();
		this.tagHash["tag$"+tag.title].push(tag);
		
		switch (tag.title) {
			case "summary":
				if (this.name == "" || this.name == null) this.name = tag.name;
				this.description = tag.description;
				// no name given so try to find the name in the code line
				if ((this.name == "" || this.name == null) && this.description != "" && this.codeLine)
					this.name = JSDoc.util.findNameInCode(this.codeLine);
			break;
			case "private":
				this.isPrivate = true;
			break;
			case "constructor": case "class":
				this.isConstructor = true; // changes scope too
			case "namespace": case "scope":
				if (tag.description) {
					JSDoc.parse.currentScope = tag.description;
					if (this.codeLine) this.name = JSDoc.util.findNameInCode(this.codeLine);
				}
				else JSDoc.parse.currentScope = this.name;
			break;
			case "memberof": case "methodof":
				if (tag.description && this.codeLine)
					this.name = JSDoc.util.findNameInCode(this.codeLine, tag.description);
				else if (this.name) this.name = tag.description+"."+this.name;
			break;
			case "name":
				this.name = tag.description;
			break;
			case "library":
				this.isLibrary = true;
				this.name = JSDoc.util.fileName(srcFile);
				this.description = tag.description;
			break;
		}
	}
	if (this.name == null) this.isFragment = true;
}

/**
 * Add additional tags (or params) to an already existing doclet.
 * This would happen if a doclet were split across several comments.
 *
 * @private
 * @method
 * @param {JSDoc.Doclet} doclet The object to add to the existing one.
 */
JSDoc.Doclet.prototype.append = function(doclet) {
	for (p in  doclet.tagHash) {
		if (this.tagHash[p] == null) this.tagHash[p] = [];
		this.tagHash[p] = this.tagHash[p].concat(doclet.tagHash[p]);
	}
	this.tags = this.tags.concat(doclet.tags);
}


/**
 * Get the tags that have a given title from this doclet.
 *
 * @method
 * @param {String} whichTag The title of the tag you want
 * @return {Array} All JSDoc.Tag objects with the given title, or an empty array. 
 */
JSDoc.Doclet.prototype.tag = function(whichTag) {
	var tag = this.tagHash["tag$"+whichTag.toLowerCase()]
	return (tag == null)? [] : tag;
}

/**
 * An object representing a doclet's tag.
 *
 * @private
 * @constructor
 * @param {String} text The raw content of the documentation comment.
 */
JSDoc.Doclet.Tag = function(text) {	
	var tagParts = text.match(JSDoc.regex.tag);
	if (tagParts) {
		this.title = tagParts[1].toLowerCase();
		this.description  = (tagParts[2]? tagParts[2] : "")
		
		// implement synonyms here
		if (this.title == "argument") this.title = "param";
		else if (this.title == "returns") this.title = "return";
		else if (this.title == "alias") this.title = "name";
		else if (this.title == "exception")	this.title = "throws";
		else if (this.title == "class")	this.title = "constructor";
		else if (this.title == "projectdescription" || this.title == "fileoverview")
			this.title = "library";
		
		var parts = null;
		if (this.title == "summary") {
			parts = this.description.match(JSDoc.regex.summaryTag);
			if (parts) {
				this.type = (parts[1]? parts[1] : "");
				this.name = (parts[2]? parts[2] : "");
				if (this.name != "") this.name = this.name.replace(/\s*-\s*$/, ""); // name is set off from description by a dash
				this.description = (parts[3]? parts[3] : "");
			}
		}
		else if (this.title == "param" || this.title == "property") { // use long tags
			parts = this.description.match(JSDoc.regex.longTag);
			if (parts) {
				this.type = (parts[1]? parts[1] : "");
				this.name = (parts[2]? parts[2] : "");
				this.description = (parts[3]? parts[3] : "");
			}
		}
		else { // use short tags
			parts = this.description.match(JSDoc.regex.shortTag);
			if (parts) {
				this.type = (parts[1]? parts[1] : "");
				this.name = "",
				this.description = (parts[2]? parts[2] : "");
			}
		}
	}
}

/**
 * Organize doclets into a hierarchical structure.
 *
 * @private
 * @constructor
 */
JSDoc.Tree = {
	init: function() {
		/**
		 * JSDoc.Tree.cursor - Where in the data the walk currently is.
		 *
		 * @private
		 * @property
		 */
		JSDoc.Tree.cursor = {};
	}
};

/**
 * Add a new Doclet to the tree
 *
 * @private
 * @method
 * @param {JSDoc.Doclet} newDoclet
 */
JSDoc.Tree.add = function(newDoclet) {
	if (newDoclet.isLibrary) {
		JSDoc.doclets.library = newDoclet;
	}
	else if (newDoclet.isFragment) {
		if (JSDoc.Tree.cursor.doclet != null)
			JSDoc.Tree.cursor.doclet.append(newDoclet);
	}
	else {
		var path = JSDoc.doclets.children;
		var name = newDoclet.name.split(".");
		var fullName = [];
		for (var i = 0; i < name.length; i++) {
			fullName.push(name[i]);
			if (path["doc$"+name[i]] == null) {
				if (i < name.length-1) { // an "implied object," create a placeholder to hold newDoclet
					var placeholder = new JSDoc.Doclet("");
					placeholder.name = fullName.join(".");
					placeholder.description = "";
					path["doc$"+name[i]] = { doclet: placeholder, children:{} };
				}
				else {
					JSDoc.Tree.cursor = path["doc$"+name[i]] = { doclet: newDoclet, children:{} };
				}
			}
			path = path["doc$"+name[i]].children;
		}
	}
}

/**
 * Used by render to work recursively down every node in the doclet tree.
 *
 * @private
 * @method
 */
JSDoc.Tree.walk = function(node) {
	for (child in node.children) {
		var doclet = node.children[child].doclet;
		
		onDocletStart(doclet, JSDoc.printBuffer);
		JSDoc.Tree.walk(node.children[child]);
		onDocletEnd(doclet, JSDoc.printBuffer);
	}
}

/**
 * Wrap up the entire process into one function call. This is called 
 * automatically when running with Rhino on the command line.
 *
 * @private
 * @method
 * @param {String[]} arguments Passed through from the command line.
 */ 
JSDoc.main = function(arguments) {
	var template = arguments[0];
	var srcFiles = new Array(); //there may be multiple source files
	for (var i = 1; i < arguments.length; i++) {
		srcFiles.push(arguments[i]);
	}
		
	JSDoc.parse(srcFiles);
	JSDoc.render(template);
	print(JSDoc.printBuffer.join("\n"));
}

if (typeof arguments != "undefined") { // running under Rhino?
	//TODO: check for missing required args here
	if (arguments.length < 2) print("ARGUMENTS: jsdoc.js template.js sourceCode.js ...");
	else JSDoc.main(arguments);
}