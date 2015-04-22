import has = require('./has');

//regular expresions copied from https://github.com/ded/bowser

function grabInfo(ua: string) {
	/** return the version of the browser */
	var versionIdentifier = getVersion(/version\/(\d+(\.\d+)?)/i);
	if (versionIdentifier === true) {
		versionIdentifier = null;
	}

	function getVersion(regex?: RegExp): string|boolean {
		if (!regex) {
			return versionIdentifier || true;
		}
		var match = ua.match(regex);
		return (match && match.length > 1 && match[1]) || versionIdentifier || true;
	}

	var iosdevice = getVersion(/(ipod|iphone|ipad)/i).toString().toLowerCase();
	var likeAndroid = /like android/i.test(ua);
	var android = !likeAndroid && /android/i.test(ua);

	var tablet = /tablet/i.test(ua);
	var mobile = !tablet && /[^-]mobi/i.test(ua);

	if (/opera|opr/i.test(ua)) {
		has.add('opera', versionIdentifier || getVersion(/(?:opera|opr)[\s\/](\d+(\.\d+)?)/i));
	}
	if (/windows phone/i.test(ua)) {
		has.add('iemobile', getVersion(/iemobile\/(\d+(\.\d+)?)/i));
	}
	if (/msie|trident/i.test(ua)) {
		has.add('ie', getVersion(/(?:msie |rv:)(\d+(\.\d+)?)/i));
	}
	if (/chrome|crios|crmo/i.test(ua)) {
		has.add('chrome', getVersion(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i));
	}
	if (iosdevice) {
		has.add(iosdevice, getVersion());
	}
	if (/sailfish/i.test(ua)) {
		has.add('sailfish', getVersion(/sailfish\s?browser\/(\d+(\.\d+)?)/i));
	}
	if (/seamonkey\//i.test(ua)) {
		has.add('seamonkey', getVersion(/seamonkey\/(\d+(\.\d+)?)/i));
	}
	if (/firefox|iceweasel/i.test(ua)) {
		has.add('firefox', getVersion(/(?:firefox|iceweasel)[ \/](\d+(\.\d+)?)/i));
		if (/\((mobile|tablet);[^\)]*rv:[\d\.]+\)/i.test(ua)) {
			has.add('firefoxos', getVersion());
		}
	}
	if (/silk/i.test(ua)) {
		has.add('silk', getVersion(/silk\/(\d+(\.\d+)?)/i));
	}
	if (/phantom/i.test(ua)) {
		has.add('phantomjs', getVersion(/phantomjs\/(\d+(\.\d+)?)/i));
	}
	if (/blackberry|\bbb\d+/i.test(ua) || /rim\stablet/i.test(ua)) {
		has.add('blackberry', getVersion(/blackberry[\d]+\/(\d+(\.\d+)?)/i));
	}
	if (/(web|hpw)os/i.test(ua)) {
		has.add('webosbrowser', getVersion(/w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i));
	}
	if (/bada/i.test(ua)) {
		has.add('dolfin', getVersion(/dolfin\/(\d+(\.\d+)?)/i));
	}
	if (/tizen/i.test(ua)) {
		has.add('tizenbrowser', getVersion(/(?:tizen\s?)?browser\/(\d+(\.\d+)?)/i));
	}
	if (/safari/i.test(ua)) {
		has.add('safari', getVersion());
	}

	// set webkit or gecko flag for browsers based on these engines
	if (/(apple)?webkit/i.test(ua)) {
		has.add('webkit', true);
	}
	if (!has('opera') && /gecko\//i.test(ua)) {
		has.add('gecko', getVersion(/gecko\/(\d+(\.\d+)?)/i));
	}

	// OS version extraction
	if (iosdevice) {
		has.add('ios', getVersion(/os (\d+([_\s]\d+)*) like mac os x/i).toString().replace(/[_\s]/g, '.'));
	}
	if (android || has('silk')) {
		has.add('android', getVersion(/android[ \/-](\d+(\.\d+)*)/i));
	}
	if (has('iemobile')) {
		has.add('windowsphone', getVersion(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i));
	}
	if (has('webosbrowser')) {
		has.add('webos', getVersion(/(?:web|hpw)os\/(\d+(\.\d+)*)/i));
	}
	if (has('blackberry')) {
		has.add('rim', getVersion(/rim\stablet\sos\s(\d+(\.\d+)*)/i));
	}
	if (has('dolfin')) {
		has.add('bada', getVersion(/bada\/(\d+(\.\d+)*)/i));
	}
	if (has('tizenbrowser')) {
		has.add('tizen', getVersion(/tizen[\/\s](\d+(\.\d+)*)/i));
	}
	// device type extraction
	var androidMajorVersion = android && has('android') !== true && has('android').split('.')[0];
	if (tablet || iosdevice === 'ipad' || (android && (androidMajorVersion === '3' || (androidMajorVersion === '4' && !mobile))) || has('silk')) {
		has.add('tablet', true);
	}
	if (mobile || iosdevice === 'iphone' || iosdevice === 'ipod' || android || has('blackberry') || has('webos') || has('bada')) {
		has.add('mobile', true);
	}
}

interface UserAgentParser {
	(name: string): any;
	process(ua: string): void;
}

grabInfo(navigator.userAgent);
var main = <UserAgentParser> function(key: string): any {
	return has(key);
};
main.process = grabInfo;

export = main;
