function update(e) {
	if(Date.now() < update.last + (game.tick)) {update.run(); return}
	update.last = Date.now();
	if(mainMenu.active) mainMenu.run();
	else if(keybindMenu.active) keybindMenu();
	else if(options.active) options.run();
	else if(catalog.active) catalog.run();
	else if(levelMenu.active) levelMenu();
	else main();
	pen.clearRect(0, 0, innerWidth, innerHeight);
	pen.drawImage(background, 0, 0);
	pen.drawImage(foreground, 0, 0);
	Music.forEach(bgm => bgm.resume());
	saveData();
	update.run();
}
function reset() {
	onresize();
    game.reset();
    Music.forEach(bgm => bgm.stop());
    enemies.clear();
    bullets.clear();
    exp.clear();
    particles.clear();
	npcs.clear();
}
update.run = () => update.request = requestAnimationFrame(update);
/**@type {Map<string, (1 | 2 | 3)>}*/
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
	else if(levelMenu.active) levelMenu.screen();
	else if(catalog.active) catalog.screen();
	else if(options.active) options.screen();
}
onblur = () => {
	cancelAnimationFrame(update.request);
	delete update.request;
	keys.clear();
	Music.forEach(bgm => bgm.pause());
}
onfocus = () => {
	Music.forEach(bgm => bgm.resume());
	if(!update.request) update.run();
}
var keys = new Map;
onkeydown = e => {
	var key = data.keyBind[e.code];
	if(keys.has(key)) keys.set(key, 3);
	else keys.set(key, 1);
	if(keybindMenu.active && keybindMenu.selected) {
		keybindMenu.pressed = e.code;
	}
}
onkeyup = e => {
	var key = data.keyBind[e.code];
	keys.delete(key);
}