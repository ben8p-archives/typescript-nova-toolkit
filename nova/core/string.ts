const templateToken = /\$\{([a-z0-9_-]+)\}/gi;


/**
 * replace token ${} in a string
 *
 * @param	text	the string to update
 * @param	content	an objet representing {placeholder:value}
 * @return			the new string
 */
export function template(text:string, content:{ [index:string]: any }):string {
	let substitute = function (placeHolder:string, attribute:string):string {
		return content[attribute] || placeHolder;
	}
	return text.replace(templateToken, substitute);
}
