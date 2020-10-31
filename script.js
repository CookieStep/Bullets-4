function update(e) {
	if(Date.now() < update.last + (game.tick)) {update.run(); return}
	update.last = Date.now();
	if(mainMenu.active) mainMenu();
	else if(catalog.active) catalog.run();
	else main();
	pen.clearRect(0, 0, innerWidth, innerHeight);
	pen.drawImage(background, 0, 0);
	pen.drawImage(foreground, 0, 0);
	update.run();
	saveData();
}
update.run = () => update.request = requestAnimationFrame(update);
/**@type {Map<string, (1 | 2 | 3)>}*/
var keys = new Map;
onkeydown = (e) => keys.has(e.key)?
	keys.set(e.key, 3): keys.set(e.key, 1);
onkeyup = (e) =>
	keys.delete(e.key);
onload = () => {
	onresize();
	document.body.appendChild(canvas);
	loadData();
	if(!data.firstRun) mainMenu.setup();
	update.run();
}
onresize = () => {
	assign(canvas, {
		width: innerWidth,
		height: innerHeight
	});
	assign(background, {
		width: innerWidth,
		height: innerHeight
	});
	assign(foreground, {
		width: innerWidth,
		height: innerHeight
	});
	assign(game, {
		x: 0,
		y: 0,
		x2: innerWidth,
		y2: innerHeight,
		scale: sqrt((innerWidth * innerHeight * 1600)/921600)
	});
	backgrounds.clear();
	if(mainMenu.active) mainMenu.screen();
	else if(catalog.active) catalog.screen();
}
onblur = () => {
	cancelAnimationFrame(update.request);
	Music.forEach(bgm => bgm.pause());
}
onfocus = () => {
	Music.forEach(bgm => bgm.resume());
	update.run();
}
// var keyBind = {
//     back: 8,
//     down: 83,
//     down2: 40,
//     enter: 13,
//     glide: 16,
//     left: 65,
//     left2: 37,
//     right: 68,
//     right2: 39,
//     select: 32,
//     up: 87,
//     up2: 38
// }