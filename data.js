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
	data = {...baseData};
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
var keyBind = () => ({
	Backspace: "back",
	KeyS: "down",
	ArrowDown: "down2",
	Enter: "enter",
	KeyA: "left",
	ArrowLeft: "left2",
	KeyD: "right",
	ArrowRight: "right2",
	Space: "select",
	KeyW: "up",
	ArrowUp: "up2",
	ShiftRight: "secondary"
});
var baseData = {
	catalog: new Set,
	party: new Set,
	firstRun: true,
	touchStyle: 2,
	level: 1,
	keyBind: keyBind(),
	clearedIds: {0: true}
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
});
dataParser.set("_party", value => {
	if(value) data.party = new Set(value);
	else data.party = new Set;
});
dataStringfy.set("party", value => {
	if(value) data._party = value.toArray();
});