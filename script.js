function update(e) {
	if(Date.now() < update.last + (1000/40)) {
		update.request = requestAnimationFrame(update);
		return;
	}
	player.update();
	ctx.fillStyle = "#0005";
	ctx.fillRect(0, 0, innerWidth, innerHeight);
	player.draw();
	update.last = Date.now();
	update.request = requestAnimationFrame(update);
}
/**@type {Map<string, number>}*/
var keys = new Map;
onkeydown = (e) => keys.has(e.key)?
	keys.set(e.key, 3): keys.set(e.key, 1);
onkeyup = (e) =>
	keys.delete(e.key);
onload = () => {
	onresize();
	document.body.appendChild(canvas);
	player = new Player;
	update();
}
onresize = () => assign(canvas, {
	width: innerWidth,
	height: innerHeight
});