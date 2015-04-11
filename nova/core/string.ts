/**
 * implemation of es6 Object.assign
 *
 * @param	target	the object which will receive new attributes
 * @param	sources	sources which will be combined into target
 * @return			target (modified by reference)
 */

const templateToken = /\$\{([a-z0-9_-]+)\}/gi;



export function template(text:string, content:{ [index:string]: any }):string {
	let substitute = function (placeHolder:string, attribute:string):string {
		return content[attribute] || placeHolder;
	}
	return text.replace(templateToken, substitute);
}
