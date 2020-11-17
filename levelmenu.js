function levelMenu() {
	main(false);
	heros.forEach(hero => {if(!hero.alive) {hero.hp = hero.maxHp; hero.spawn()}});
	var s = innerHeight/10;
	var level = levelMenu.items2[levelMenu.selected];
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
	if(levelMenu.selected + 1 < levelMenu.items2.length) {
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
	var text = levelMenu.hardcore? "Hardcore": "Softcore";
	ctx.fillStyle = levelMenu.hardcore? "#d95": "#aaf"
	ctx.font = `${s/2}px Sans`;
	var {width} = ctx.measureText(text);
	var x = game.x2 - width;
	ctx.fillText(text, x, game.y2 - s/4);
	if(touch && touch.x > x && touch.x < x + width && touch.y > game.y2 - s * 3/4) {
		levelMenu.hardcore = !levelMenu.hardcore;
		touch.used = true;
	}
	if(level.hasNew) {
		let i = tick % 20;
		i = abs(i - 10)/5 + 3;
		let a = s/i;
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
	if(!data.clearedIds[level.id] && levelMenu.active == 1) {
		let i = tick % 20;
		i = abs(i - 10)/5 + 3;
		let a = s/i;
		ctx.fillStyle = "yellow";
		ctx.font = `${a}px Sans`;
		let text = "New level";
		let w2 = ctx.measureText(text).width;
		let x = (innerWidth - width)/2 - s/2;
		let y2 = y - s * 6/5;
		let y3 = y2 + a/4;
		let x2 = x - w2/2;
		ctx.save();
		ctx.translate(x, y2);
		ctx.rotate(-PI/16);
		ctx.translate(-x, -y2)
		ctx.fillText(text, x2, y3);
		ctx.restore();
	}
	if(switched) levelMenu.create();
	else if((touch && !touch.used) || keys.get("select") == 1) levelMenu.startLevel();
	if(keys.has("select")) keys.set("select", 2);
	if(touch) touch.used = true;
	ctx.fillStyle = level.color;
	ctx.font = `${s/2}px Sans`;
	for(let l = -1; l < level.desc.length; l++) {
		var y = s * (6 + l/2);
		if(l != -1) {
			var text = level.desc[l];
			if(text == "") ctx.fillStyle = level.color2;
			var {width} = ctx.measureText(text);
			ctx.fillText(text, (innerWidth - width)/2, y);
		}else if(levelMenu.active == 1) {
			text = level.difficulty.text;
			ctx.font = `${s/2}px Arial`;
			ctx.fillStyle = level.difficulty.color;
			var {width} = ctx.measureText(text);
			ctx.fillText(text, (innerWidth - width)/2, y);
			ctx.fillStyle = level.color;
			ctx.font = `${s/2}px Sans`;
		}
	}
}
/**@this {levelMenu}*/
levelMenu.setup = function() {
	this.active = 1;
	delete this.options;
	delete this.options2;
	onresize();
	if(!("selected" in this))
		this.selected = 0;
	this.selectedList = [];
	this.partyList = [];
	this.items2 = [];
	for(let level of this.items) {
		if("req" in level) {
			let cont;
			level.req.forEach(id => {
				if(cont || !data.clearedIds[id]) cont = true;
			});
			if(cont) continue;
		}
		this.items2.push(level);
	}
	this.create();
};
/**@this {levelMenu}*/
levelMenu.stop = function() {
	this.active = false;
	this.selected = 0;
	delete this.options;
	delete this.options2;
	mainMenu.setup();
};
levelMenu.screen = function() {game.scale *= 2/3}
/**@this {levelMenu}*/
levelMenu.startLevel = function() {
	if(this.options) {
		let name = this.options2[this.selected];
		if(!this.partyList.includes(name)) {
			this.selectedList.push(this.options[this.selected]);
			this.partyList.push(name);
		}
	}else this.selectedList.push(this.selected);
	if(this.selectedList[0] != 0 && this.active <= data.party.size) {
		if(this.active == 1) this.selected = 0;
		++this.active;
		this.items2 = [];
		this.options = [];
		this.options2 = [];
		let i = 0;
		let items2 = [];
		for(let level of this.items) {
			if("req" in level) {
				let cont;
				level.req.forEach(id => {
					if(cont || !data.clearedIds[id]) cont = true;
				});
				if(cont) continue;
			}
			items2.push(level);
		}
		data.party.forEach(name => {
			let obj = assign({}, items2[this.selectedList[0]]);
			obj.hero = catalog.converter.get(name);
			this.options.push(obj.hero);
			let hero = new obj.hero;
			this.options2.push(hero.name);
			obj.desc = hero.description;
			let weapon = new obj.hero.weapon;
			obj.desc.push("");
			if(this.partyList.includes(hero.name)) {
				obj.desc.push("You've already selected this for your party.");
				obj.desc.push("Select it again to have an empty party slot");
			}else{
				obj.desc.push(`Lives: ${hero.lives}`);
				obj.desc.push(...weapon.desc);
			}
			obj.name = hero.name;
			obj.color = hero.color;
			obj.color2 = hero.color2;
			this.items2[i++] = obj;
		});
		this.create();
	return}
	let items2 = [];
	for(let level of this.items) {
		if("req" in level) {
			let cont;
			level.req.forEach(id => {
				if(cont || !data.clearedIds[id]) cont = true;
			});
			if(cont) continue;
		}
		items2.push(level);
	}
	game.level = this.items.indexOf(items2[this.selectedList[0]]);
	game.hero = this.selectedList[1];
	game.party = [this.selectedList[2], this.selectedList[3]];
	reset();
	keys.clear();
	hardcore = levelMenu.hardcore;
	player = undefined;
	clearBad();
	this.active = 0;
	onresize();
};
/**@this {levelMenu}*/
levelMenu.create = function(clear=true) {
	game.reset();
	enemies.clear();
	npcs.clear();
	particles.clear();
	if(clear) {
		exp.clear();
		bullets.clear();
		heros.clear();
	}
	Music.forEach(bgm => bgm.stop());
	var level = this.items2[this.selected];
	if(!level && this.active) {
		--this.active;
		if(!this.active) this.stop();
		else{
			speedrun = 0;
			scoreAttack = false;
			this.items2 = [];
			for(let level of this.items) {
				if("req" in level) {
					let cont;
					level.req.forEach(id => {
						if(cont || !data.clearedIds[id]) cont = true;
					});
					if(cont) continue;
				}
				this.items2.push(level);
			}
			this.selected = 0;
			this.selectedList = [];
			this.partyList = [];
			delete this.options;
			delete this.options2;
			this.active = 1;
			this.create();
		}
	return}
	level.hasNew = 0;
	game.levelId = level.id;
	if(Music.has(level.music))
		Music.get(level.music).play();
	var can = catalog.getList();
	var has = what => {
		let is = false;
		can.forEach(enemy => {if(enemy instanceof what) is = true});
		return is;
	}
	Hero.summonBulk(this.selectedList[1], this.selectedList[2])
	if(level.hero) {
		let Class = level.hero;
		let hero = new Class().spawn();
		hero.skill = new Class.weapon(hero);
		heros.push(hero);
	}
	if(level.enemies) while(enemies.size < 20) {
		var list = [];
		level.enemies.forEach(enemy => {
			if(has(enemy)) list.push(new enemy);
			else ++level.hasNew;
		});
		Enemy.summonBulk(...list);
		if(!enemies.size) break;
	}
	if(level.boss) level.boss.forEach(boss => boss.summonBulk(new boss));
	backgroundName = level.background.name;
	backgroundColor = level.background.color;
};
{
	let Easy = {
		text: "Easy",
		color: "#afa"
	}
	let Normal = {
		text: "Normal",
		color: "#fa5"
	}
	levelMenu.items = [{
		name: "Tutorial",
		color: "#0cc",
		desc: ["Replay the tutorial", "In case you somehow forgot how to play or something"],
		enemies: [Chill, GoGo],
		music: "Tutorial",
		hero: Player,
		background: {
			name: "tutorial",
			color: "#0005"
		},
		difficulty: Easy,
		id: 0
	}, {
		name: "The Arena",
		color: "#fa5",
		desc: ["This is where your true journey begins."],
		enemies: [Chill, GoGo, Underbox, Corner],
		music: "Level-1",
		background: {
			name: "level-1",
			color: "#0005"
		},
		difficulty: Normal,
		id: 1
	}, {
		name: "The Summoner",
		color: "#f55",
		music: "Boss-1",
		desc: ["Summons things.", "Is also afraid of like... everything."],
		boss: [TheSummoner],
		difficulty: Normal,
		background: {
			name: "level-1",
			color: "#0005"
		},
		req: [1],
		id: 2
	}, {
		name: "The Curve",
		color: "#f5f",
		desc: ["The swim team's bold return.", "I hope your ready."],
		enemies: [Swerve, Looper, Around],
		music: "Level-2",
		background: {
			name: "level-2",
			color: "#0005"
		},
		difficulty: Normal,
		id: 3
	}];
}