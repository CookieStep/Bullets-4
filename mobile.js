/**@type {Map<string, {
		x: number, y: number, id: number,
		start: number,
		sx: number, sy: number,
		move: {x: number, y: number},
		used?: boolean,
		end?: number
	}>}*/
var touches = new Map;
/**@param {{changedTouches: Touch[]}} e*/
var touchstart = (e) => e.changedTouches.forEach(touch => {
	var {
		identifier: id,
		pageX: x,
		pageY: y
	} = touch;
	touches.set(id, {
		x, y, id,
		start: Date.now(),
		sx: x, sy: y,
		move: {x: 0, y: 0}
	});
}),
/**@param {{changedTouches: Touch[]}} e*/
touchmove = (e) => e.changedTouches.forEach(touch => {
	var {
		identifier: id,
		pageX: x,
		pageY: y
	} = touch;
	let obj = touches.get(id);
	obj.x = x; obj.y = y;
	touches.set(id, obj);
}),
/**@param {{changedTouches: Touch[]}} e*/
touchend = (e) => e.changedTouches.forEach(touch => {
	var {
		identifier: id,
		pageX: x,
		pageY: y
	} = touch;
	var obj = touches.get(id);
	obj.end = Date.now();
	touches.set(id, obj);
}),
touchcancel = (e) => e.changedTouches.forEach(touch => touches.delete(touch.identifier));
//fix
ontouchstart = (e) => {
	touchstart({changedTouches: [...e.changedTouches]});
	canvas.requestFullscreen();
}
ontouchmove = (e) => {
	touchmove({changedTouches: [...e.changedTouches]});
}
ontouchend = (e) => {
	e.preventDefault();
	touchend({changedTouches: [...e.changedTouches]});
}
ontouchcancel = (e) => {
	touchcancel({changedTouches: [...e.changedTouches]});
}