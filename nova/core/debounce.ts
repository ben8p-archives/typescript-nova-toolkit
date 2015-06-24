/**
 * Create a function that will only execute after `wait` milliseconds
 * of repeated execution. Useful for delaying some event action slightly to allow
 * for rapidly-firing events such as window.resize, node.mousemove and so on.
 * @param	callback	the method to execute when debounce fires
 * @param	wait		how long (in ms) the debounce will wait before fireing
 * @return				a debounced function
 */
function debounce(callback: Function, wait? : number): Function {
	var timer: any;
	wait = wait || 100;
	return function() {
		if (timer) {clearTimeout(timer); }
		var currentArguments = arguments;

		timer = setTimeout(function() {
			callback.apply(callback, currentArguments);
		}, wait);
	};
};
export = debounce;
