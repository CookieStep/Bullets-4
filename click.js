onmousedown = touch => {
	var {
		pageX: x,
		pageY: y
    } = touch;
    var id = -1;
	touches.set(id, {
		x, y, id,
		start: Date.now(),
		sx: x, sy: y,
		move: {x: 0, y: 0}
	});
}
onmousemove = touch => {
    if(!touches.has(-1)) return;
	var {
		pageX: x,
		pageY: y
	} = touch;
    var id = -1;
	let obj = touches.get(id);
	obj.x = x; obj.y = y;
	touches.set(id, obj);
}
onmouseup = touch => {
    if(!touches.has(-1)) return;
	var {
		pageX: x,
		pageY: y
	} = touch;
    var id = -1;
	var obj = touches.get(id);
	obj.end = Date.now();
	touches.set(id, obj);
}