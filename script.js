function update(e) {
	player.update();
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, innerWidth, innerHeight);
	player.draw();
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