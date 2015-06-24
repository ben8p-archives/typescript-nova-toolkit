import stringUtil = require('./string');

/** short name of months */
var MONTH_SHORT: string[] = [];
(function() {
	//trick to get all months short names according to browser locale
	// FIXME: can this be better ?
	var count = -1;
	while (++count < 12) {
		let date = new Date(1970, count, 3);
		MONTH_SHORT.push(date.toString().split(' ')[1]);
	}
})();

/** internal method to return a string representing the format according to the enum value */
function getFormatFromEnum(value: FORMAT): string {
	switch (value) {
		case FORMAT.DATE_NUMERIC:
			return 'd-m-Y';
		case FORMAT.DATE_LITERAL:
			return 'd M Y';
		case FORMAT.TIME_LONG:
			return 'H:i:s';
		case FORMAT.TIME_SHORT:
			return 'H:i';
		case FORMAT.DATE_NUMERIC_TIME_LONG:
			return 'd-m-Y H:i:s';
		case FORMAT.DATE_NUMERIC_TIME_SHORT:
			return 'd-m-Y H:i';
		case FORMAT.DATE_LITERAL_TIME_LONG:
			return 'd M Y H:i:s';
		case FORMAT.DATE_LITERAL_TIME_SHORT:
			return 'd M Y H:i';
		default:
			return '';
	}
}

/** list of all predefined format (for easy use) */
export enum FORMAT {DATE_NUMERIC, DATE_LITERAL, TIME_LONG, TIME_SHORT, DATE_NUMERIC_TIME_LONG, DATE_NUMERIC_TIME_SHORT, DATE_LITERAL_TIME_LONG, DATE_LITERAL_TIME_SHORT};

/** list of supported token for date parsing */
const tokens = /d|G|H|i|j|m|M|n|s|Y/g;
/** list of formatters, 1 per token */
const formatters = {
	/** replace d by day of the week (2 dijits) */
	d: function(date: Date) {
		return stringUtil.pad(date.getDate().toString(), '0', 2);
	},
	/** replace G by hours */
	G: function(date: Date) {
		return date.getHours().toString();
	},
	/** replace H by hours (2 dijits) */
	H: function(date: Date) {
		return stringUtil.pad(date.getHours().toString(), '0', 2);
	},
	/** replace i by minutes (2 dijits) */
	i: function(date: Date) {
		return stringUtil.pad(date.getMinutes().toString(), '0', 2);
	},
	/** replace j by day of the week (1 dijits) */
	j: function(date: Date) {
		return date.getDate().toString();
	},
	/** replace m by month number (2 dijits) */
	m: function(date: Date) {
		return stringUtil.pad((date.getMonth() + 1).toString(), '0', 2);
	},
	/** replace M by literal month (short) */
	M: function(date: Date) {
		return MONTH_SHORT[date.getMonth()];
	},
	/** replace n by month (1 dijit) */
	n: function(date: Date) {
		return (date.getMonth() + 1).toString();
	},
	/** replace s by seconds (2 dijits) */
	s: function(date: Date) {
		return stringUtil.pad(date.getSeconds().toString(), '0', 2);
	},
	/** replace Y by year (4 dijits) */
	Y: function(date: Date) {
		return stringUtil.pad(date.getFullYear().toString(), '0', 4);
	}
};

/**
 * create a date + time string representation, based on PHP standards (See http://php.net/manual/en/function.date.php)
 * Note: YY is deprecated so we do not support it: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getYear
 * @param	date	date to convert into string
 * @param	format	a string or one of the predefined format. See the php doc for more details (supported tokens are d|D|H|i|j|m|M|n|s|Y)
 * @return			the formatted date
 */
export function format(date: Date, format: string|FORMAT): string {
	if (!date || isNaN(date.getTime())) {
		return '';
	}
	if (typeof format !== 'string') {
		format = getFormatFromEnum(<FORMAT> format);
	}

	return (<string> format).replace(tokens, function(match) {
		return formatters[match](date);
	});
};
