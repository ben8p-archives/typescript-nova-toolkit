import stringUtil = require('./string');

//compute all month according to locale
// FIXME: can this be better ?
var MONTH_SHORT: string[] = [];
function computeMonthLocale() {
	var count = -1;
	while (++count < 12) {
		var date = new Date(1970, count, 3);
		MONTH_SHORT.push(date.toString().split(' ')[1]);
	}
}
computeMonthLocale();

/** return a predifined format */
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

/** predefined formating for easy use */
export enum FORMAT {DATE_NUMERIC, DATE_LITERAL, TIME_LONG, TIME_SHORT, DATE_NUMERIC_TIME_LONG, DATE_NUMERIC_TIME_SHORT, DATE_LITERAL_TIME_LONG, DATE_LITERAL_TIME_SHORT};
/**
 * create a date + time string representation.
 * Note: YY is deprecated so we do not support it: https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Date/getYear
 * @param	format
 * Possible values are:
 * d	Day of the month, 2 digits with leading zeros
 * m	Numeric representation of a month, with leading zeros
 * Y	A full numeric representation of a year, 4 digits
 * j	Day of the month without leading zeros
 * n	Numeric representation of a month, without leading zeros
 * M	A short textual representation of a month, three letters
 * See http://php.net/manual/en/function.date.php
 */
export function format(date: Date, format: string|FORMAT) {
	if (!date || isNaN(date.getTime())) {
		return '';
	}
	if (typeof format !== 'string') {
		format = getFormatFromEnum(<FORMAT> format);
	}

	return (<string> format).replace(/d/g, stringUtil.pad(date.getDate().toString(), '0', 2))
							.replace(/m/g, stringUtil.pad((date.getMonth() + 1).toString(), '0', 2))
							.replace(/Y/g, stringUtil.pad(date.getFullYear().toString(), '0', 4))
							.replace(/j/g, date.getDate().toString())
							.replace(/n/g, (date.getMonth() + 1).toString())
							.replace(/M/g, MONTH_SHORT[date.getMonth()])
							.replace(/H/g, stringUtil.pad(date.getHours().toString(), '0', 2))
							.replace(/i/g, stringUtil.pad(date.getMinutes().toString(), '0', 2))
							.replace(/s/g, stringUtil.pad(date.getSeconds().toString(), '0', 2))
							.replace(/G/g, date.getHours().toString());
};
