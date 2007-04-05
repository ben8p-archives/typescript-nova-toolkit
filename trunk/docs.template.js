onRenderStart = function(library, buffer) {
	buffer.fileSummary = { methods: [], properties: [], constructors: [] };
	buffer.push('<table summary="" border="1" cellpadding="3" cellspacing="0" width="100%"><tbody><tr class="TableHeadingColor" bgcolor="#ccccff"><th colspan="1" align="left"><font size="+2"><b>Details</b></font></th></tr></tbody></table>');
}

recodeString = function(s) {
	s=s.replace(/\</g,'&lt;');
	s=s.replace(/\>/g,'&gt;');
	s=s.replace(/\n+/g,'<br />');
	return s;
}

onDocletStart = function(doclet, buffer) {
	if (doclet.tag("method").length > 0) {
		buffer.fileSummary.methods.push(doclet);
	}
	else if (doclet.isConstructor) {
		buffer.fileSummary.constructors.push(doclet);
	}
	
	var nameLine = "";
	if (doclet.isPrivate) nameLine += "<i>private</i> ";
	nameLine += "<a name=\""+doclet.name+"\"></a><h3>"+doclet.name+"</h3>";
	
	buffer.push(nameLine);
	buffer.push();
	buffer.push("<dl>");
	buffer.push("<dd>"+recodeString(doclet.description)+"</dd>");
	buffer.push("<dd><dl>");
	
	var paramTags = doclet.tag("param");
	if (paramTags.length > 0) makeList("Parameters", paramTags, buffer);
	
	var propTags = doclet.tag("property");
	if (propTags.length > 0) makeList("Properties", propTags, buffer);
	
	
	var returnTags = doclet.tag("return");
	if (returnTags.length > 0) makeList("Returns", returnTags, buffer);
	
	var throwsTags = doclet.tag("throws");
	if (throwsTags.length > 0) makeList("Throws", throwsTags, buffer);


	buffer.push("</dd></dl></dl><hr>");
}

onDocletEnd = function(doclet, buffer) {
}

onRenderEnd = function(library, buffer) {
	buffer.unshift(makeTable("Property", buffer.fileSummary.properties));
	buffer.unshift(makeTable("Method", buffer.fileSummary.methods));
	buffer.unshift(makeTable("Constructor", buffer.fileSummary.constructors));
	
	var librarySummary = "";
	if (library.name) {
		librarySummary += '<h2>'+library.name+'</h2>';
	}
	
	if (library.description) {
		librarySummary += '<dl><dt>'+recodeString(library.description)+'</dt></dl>';
	}
	librarySummary += '<dl><dt>Defined in <a href="'+library.src+'">'+library.src+'</a></dt></dl>';

	buffer.unshift(librarySummary);
}

makeTable = function(title, doclets) {
	if (doclets.length == 0) return "";
	
	var table = '<table summary="" border="1" cellpadding="3" cellspacing="0" width="100%">'+
	'<tbody><tr class="TableHeadingColor" bgcolor="#ccccff">'+
	'<th colspan="2" align="left"><font size="+2"><b>'+title+' Summary</b></font></th></tr>';
	
	for (var i in doclets) {
		doclet = doclets[i];
		
		var returns = [];
		var returnTags = doclet.tag("return");
		for (var r = 0; r < returnTags.length; r++) {
			if (returnTags[r].type) returns.push(returnTags[r].type);
		}
		returns = returns.join(', ');
		
		signature = makeSignature(doclet);
		
		table += '<tr class="TableRowColor" bgcolor="white"><td align="right" valign="top" width="1%"><font size="-1">'+
		'<code>'+returns+'</code></font></td>'+
		'<td><code><b><a href="#'+doclet.name+'">'+doclet.name+'</a></b>('+
		signature+
		')</code>'+
		'<br>'+
		'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+recodeString(doclet.description)+'</td></tr>';
	}
	
	table += '</tbody></table>&nbsp;';
	return table;
}

function makeList(title, tags, buffer) {
	buffer.push("<dt><b>"+title+":</b></dt>");
		for (var i = 0; i < tags.length; i++) {
			tag = tags[i];
			buffer.push("<dd><i>"+tag.type+"</i> <code>"+tag.name+"</code>");
			if (tag.description != "") {
				if (tag.name) buffer.push(" - ");
				buffer.push(tag.description+"</dd>");
			}
		}
}

function makeSignature(doclet) {
	var signature = [];
		var paramTags = doclet.tag("param");
		for (var p = 0; p < paramTags.length; p++) {
			var type = "";
			if (paramTags[p].type) {
				type = "&lt;"+paramTags[p].type+"&gt; ";
			}
			signature.push(type+paramTags[p].name);
		}
		return signature.join(', ');
}