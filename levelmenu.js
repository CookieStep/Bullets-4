function levelMenu() {
	main(false);
	var s = innerHeight/10;
	var level = levelMenu.items[levelMenu.selected];
	var text = level.name;
	ctx.font = `${s}px Sans`;
	var {width} = ctx.measureText(text);
	var y = s * 4.5;
	ctx.fillStyle = level.color;
	ctx.fillText(text, (innerWidth - width)/2, y);
	var switched;
	var touch;
	var any = (...list) => {
		var any = false;
		list.forEach(v => {
			if(!any && (keys.get(v) == 1 || keys.get(v) == 3)) any = true;
		});
		return any;
	}
	touches.forEach(obj => {
		if(!obj.end && (!obj.used || Date.now() - obj.start > 500) && !touch) touch = obj;
	});
	{
		let x = (innerWidth - width)/2 - s * 5/4;
		let y2 = y - s * 4/5;
		drawShape({x, y: y2, shape: "arrow", color: (levelMenu.selected > 0) ?level.color: "red", size: s, rotation: PI});
		if(any("left", "left2")) {
			--levelMenu.selected;
			switched = true
		}
		if(touch && touch.x > x && touch.x < x + s && touch.y > y2 && touch.y < y2 + s) {
			--levelMenu.selected;
			touch.used = true;
			switched = true;
		}
	}
	if(levelMenu.selected + 1 < levelMenu.items.length && levelMenu.selected < data.level) {
		let x = (innerWidth + width)/2 + s/4;
		let y2 = y - s * 4/5;
		drawShape({x, y: y2, shape: "arrow", color: level.color, size: s});
		if(any("right", "right2")) {
			++levelMenu.selected;
			switched = true
		}
		if(touch && touch.x > x && touch.x < x + s && touch.y > y2 && touch.y < y2 + s) {
			++levelMenu.selected;
			touch.used = true;
			switched = true;
		}
	}
	["up", "up2", "left", "left2", "right", "right2", "down", "down2"].forEach(key => {
		if(keys.has(key)) keys.set(key, 2);
	});
	if(level.hasNew) {
		let i = tick % 20;
		i = abs(i - 10)/5 + 3;
		let a = s/i
		ctx.fillStyle = "yellow";
		ctx.font = `${a}px Sans`
		let text = level.hasNew - 1? "New enemies!" :"New enemy!";
		let w2 = ctx.measureText(text).width;
		let x = (innerWidth + width)/2 + s/2;
		let y2 = y - s * 6/5;
		let y3 = y2 + a/4;
		let x2 = x - w2/2;
		ctx.save();
		ctx.translate(x, y2);
		ctx.rotate(PI/16);
		ctx.translate(-x, -y2)
		ctx.fillText(text, x2, y3);
		ctx.restore();
	}
	if(switched) levelMenu.create();
	else if((touch && !touch.used) || keys.get("select") == 1) levelMenu.startLevel();
	ctx.fillStyle = level.color;
	ctx.font = `${s/2}px Sans`;
	for(let l = 0; l < level.desc.length; l++) {
		var text = level.desc[l];
		var y = s * (5.5 + l/2);
		var {width} = ctx.measureText(text);
		ctx.fillText(text, (innerWidth - width)/2, y);
	}
}
levelMenu.setup = function() {
	onresize();
	this.active = true;
	if(!("selected" in this))
		this.selected = 0;
	levelMenu.create();
}
levelMenu.stop = function() {
	this.active = false;
	this.selected = 0;
	mainMenu.setup();
}
levelMenu.startLevel = function() {
	game.level = levelMenu.selected;
	reset();
	player = undefined;
	clearBad();
	levelMenu.active = false;
}
levelMenu.create = function() {
	game.reset();
	enemies.clear();
	npcs.clear();
	particles.clear();
	Music.forEach(bgm => bgm.stop());
	var level = this.items[this.selected];
	if(!level) {
		this.stop();
	return}
	level.hasNew = 0;
	if(Music.has(level.music))
		Music.get(level.music).play();
	var can = catalog.getList();
	var has = what => {
		let is = false;
		can.forEach(enemy => {if(enemy instanceof what) is = true});
		return is;
	}
	if(level.enemies) while(enemies.size < 20) {
		var list = [];
		level.enemies.forEach(enemy => {
			if(has(enemy)) list.push(new enemy);
			else ++level.hasNew;
		});
		Enemy.summonBulk(...list);
	}
	if(level.boss) level.boss.forEach(boss => boss.summonBulk(new boss));
	backgroundName = level.background.name;
	backgroundColor = level.background.color;
}
levelMenu.items = [{
	name: "Tutorial",
	color: "#0cc",
	desc: ["Replay the tutorial", "In case you somehow forgot how to play or something"],
	enemies: [Chill, GoGo],
	music: "Tutorial",
	background: {
		name: "tutorial",
		color: "#0005"
	}
}, {
	name: "Level 1",
	color: "#fa5",
	desc: ["This is where your true journey begins."],
	enemies: [Chill, GoGo, Underbox, Corner],
	music: "Level-1",
	background: {
		name: "level-1",
		color: "#0005"
	}
}, {
	name: "Boss 1",
	color: "#f55",
	music: "Boss-1",
	desc: ["The first battle."],
	boss: [TheSummoner],
	background: {
		name: "level-1",
		color: "#0005"
	}
}]