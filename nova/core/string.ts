const TEMPLATE_TOKEN = /\$\{([a-z0-9_-]+)\}/gi;
const ESCAPE_CODE_POINTS: {[index: number]: any} = {
	0: false, // nul; most browsers truncate because they use c strings under the covers.
	10: '\n', // new line
	13: '\r', // carriage return
	34: '"', // double quote
	38: '&', // ampersant
	39: '\'', // single quote
	60: '<', // less than
	62: '>', // greater than
	92: '\\', // Backslash
	8232: true, // line separator
	8233: true // paragraph separator
};
const ESCAPED_REGEXP = /&#[0-9]+;/g;
const ESCAPED_NOISE = /&|#|;/g;
const CAMEL_CASE_REGEXP = /^.|-.| ./g;
/**
 * replace token ${} in a string
 * @param	text	the string to update
 * @param	content	an objet representing {placeholder:value}
 * @return			the new string
 */
export function interpolate(text: string, content: {[index: string]: any}): string {
	let substitute = function (placeHolder: string, attribute: string): string {
		return content[attribute] || placeHolder;
	};
	return text.replace(TEMPLATE_TOKEN, substitute);
}

/** escape a string */
export function escape(value: string): string {
	if (!value) {
		return value;
	}
	var out: string[] = [],
		charCode: number,
		shouldEscape: boolean,
		j = value.length;
	for (let i = 0; i < j; ++i) {
		charCode = value.charCodeAt(i);
		shouldEscape = ESCAPE_CODE_POINTS[charCode];
		if (shouldEscape === undefined) {
			// undefined or null are OK.
			out.push(value.charAt(i));
		} else if (shouldEscape) {
			out.push('&#', charCode.toString(), ';');
		} //else we remove the char
	}
	return out.join('');
}

/** unescape a string */
export function unescape(value: string): string {
	if (!value) {
		return value;
	}
	var itm: string[] = value.match(ESCAPED_REGEXP) || [],
		len = itm.length;
	for (let i = 0; i < len; i++) {
		let newValue = ESCAPE_CODE_POINTS[+itm[i].replace(ESCAPED_NOISE, '')];
		if (typeof newValue === 'string') {
			value = value.replace(itm[i], newValue);
		}
	}
	return value;
}
/** convert to camel case */
export function toCamelCase(value: string, capitalizeFirstChar?: boolean): string {
	return value.replace(CAMEL_CASE_REGEXP, function(letter: string, index: number): string {
		return index === 0 ? (capitalizeFirstChar ? letter.toUpperCase() : letter.toLowerCase()) : letter.substring(1).toUpperCase();
	});
}
/** escape a string to be used in a regexp */
export function escapeForRegExp(value: string) {
	return value
		.replace(/\\/g, '\\\\') // the order here is very important!!
		.replace(/\//g, '\\/') // the order here is very important!!
		.replace(/\+/g, '\\+')
		.replace(/\[/g, '\\[')
		.replace(/\]/g, '\\]')
		.replace(/\./g, '\\.')
		.replace(/\(/g, '\\(')
		.replace(/\)/g, '\\)')
		.replace(/\*/g, '\\*')
		.replace(/\?/g, '\\?')
		.replace(/\|/g, '\\|')
		.replace(/\$/g, '\\$')
		.replace(/\{/g, '\\{')
		.replace(/\}/g, '\\}')
		.replace(/\^/g, '\\^');
}

/** repeat a string multiple times */
export function repeat(value: string, count: number): string {
	if (value === null || value.length === 0 || count === 0) {
		return '';
	}
	if (count < 0) {
		throw new RangeError('repeat count must be non-negative');
	} else if (count === Infinity) {
		throw new RangeError('repeat count must be less than infinity');
	}
	count = Math.floor(count);

	// Ensuring count is a 31-bit integer allows us to heavily optimize the
	// main part. But anyway, most current (august 2014) browsers can't handle
	// strings 1 << 28 chars or longer, so:
	if (value.length * count >= 1 << 28) {
		throw new RangeError('repeat count must not overflow maximum string size');
	}
	var repeatedString = '';
	for (; ; ) {
		if ((count & 1) === 1) {
			repeatedString += value;
		}
		count >>>= 1;
		if (count === 0) {
			break;
		}
		value += value;
	}
	return repeatedString;
}

/** pad a string (left or right padding) */
export function pad(value: string, padChar: string, size: number, padRight?: boolean): string {
	var count = Math.ceil((size - value.length) / padChar.length);
	if (count <= 0) {
		return value;
	}
	var pad = repeat(padChar, count);
	return padRight ? value + pad : pad + value;
}
