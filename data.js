Set.prototype.toArray = function() {
	var ill = this.values();
	var arr = [];
	do {
		var {value, done} = ill.next();
		if(!done) arr.push(value);
	}while(!done);
	return arr;
}
var data;
function loadData() {
	data = baseData;
	if(localStorage.saveData) {
		assign(data, JSON.parse(localStorage.saveData));
	}else{
		localStorage.saveData = "{}";
	}
	dataParser.forEach((value, key) => value(data[key]));
}
function saveData() {
	data._catalog = data.catalog.toArray();
	dataStringfy.forEach((value, key) => value(data[key]));
	localStorage.saveData = JSON.stringify(data);
}
var baseData = {
	catalog: new Set,
	firstRun: true
}
/**@type {Map<string, (value) => void>}*/
var dataParser = new Map;
/**@type {Map<string, (value) => void>}*/
var dataStringfy = new Map;
dataParser.set("_catalog", value => {
	if(value) data.catalog = new Set(value);
	else data.catalog = new Set;
});
dataStringfy.set("catalog", value => {
	if(value) data._catalog = value.toArray();
})