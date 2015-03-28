var emptyObject = {};

export function mixin (destination:Object, source:Object) {
	//from dojo toolkit
	var name:string;

	for(name in source) {
		var s:any = source[name];
		if(!(name in destination) || (destination[name] !== s && (!(name in emptyObject) || emptyObject[name] !== s))){
			destination[name] = s;
			if(s instanceof Function) {
				destination[name].functionName = name;
			}
		}
	}

}
