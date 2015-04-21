/**
 * Create a function that will only execute once per `wait` periods.
 * from last execution when called repeatedly. Useful for preventing excessive
 * calculations in rapidly firing events, such as window.resize, node.mousemove
 * and so on.
 */
function throttle(callback: Function, wait? : number): Function {
	var canRun: boolean = true,
		lastIgnoredCall: any = null,
		tailTimeoutHandle: number = null;
	wait = wait || 100;
	return function() {
		if (!canRun) {
			lastIgnoredCall = {
				callback: callback,
				arguments: arguments
			};
			return;
		}
		clearTimeout(tailTimeoutHandle);
		lastIgnoredCall = null;
		canRun = false;
		callback.apply(callback, arguments);
		setTimeout(function() {
			canRun = true;
			//if no more calls are coming after the normal delay, we
			//execute the tail call but we do not reset "canRun" so next call can directly be executed
			//note: if a callback is also a tail then it will run in timeout. In case of domEvent, the event you will get has already bubbled to the top and can't be stopped
			tailTimeoutHandle = setTimeout(function() {
				if (lastIgnoredCall) {
					lastIgnoredCall.callback.apply(lastIgnoredCall.callback, lastIgnoredCall.arguments);
				}
			}, wait);
		}, wait);
	};
};
export = throttle;
