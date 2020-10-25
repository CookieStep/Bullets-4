//This function doesn't typescript properly due to a type parameter
//For typescript, see collection.ts
class Collection{
	constructor(...items) {
		this.map = new Map;
		this.empty = [];
		this.push(...items);
	}
	push(...items) {
		var {map, empty} = this;
		var ids = [];
		items.forEach(value => {
			if(empty.length) var id = empty.pop();
			else id = BigInt(map.size);
			map.set(id, value);
			ids.push(id);
		});
		if(ids.length < 2) return ids[0];
		else return ids;
	}
	delete(...ids) {
		var {map, empty} = this;
		var done;
		ids.forEach(id => {done = map.delete(id); if(done) empty.push(id)});
		if(ids.length == 1) return done;
	}
	forEach(callbackfn) {
		var {map} = this;
		var collection = this;
		map.forEach((value, key) => {callbackfn(value, key, collection)});
	}
	filter(callbackfn) {
		var {map} = this;
		var nCol = new Collection;
		var collection = this;
		map.forEach((value, key) => {if(callbackfn(value, key, collection)) nCol.set(key, value)});
		nCol.scan();
		return nCol;
	}
	remove(callbackfn) {
		var {map} = this;
		var collection = this;
		var removed = [];
		map.forEach((value, key) => {
			if(callbackfn(value, key, collection)) removed.push(collection.delete(key));
		});
		if(removed.length < 2) return removed[0];
		else return removed;
	}
	asArray() {
		var array = [];
		this.map.forEach(value => array.push(value));
		return array;
	}
	scan() {
		var max = 0n;
		var empty = [];
		this.map.forEach((value, key) => {if(key > max) max = key});
		for(let i = 0n; i <= max; i++) if(!this.map.has(i)) empty.push(i);
		this.empty = empty;
		return empty;
	}
	clear() {this.empty = []; this.map.clear()}
	get(id) {return this.map.get(id)}
	has(id) {return this.map.has(id)}
	set(id, value) {this.map.set(id, value); return this}
}