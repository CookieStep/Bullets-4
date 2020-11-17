class Hero extends Entity{
	tick(focus) {
		if(this.isMain) {
			this.keys(focus);
			this.touchv2(focus);
		}else this.ai(focus);
	}
	prepare() {this.skill.sk = 0}
	keys(focus) {
		//wasd
		this.velocity.x += this.size * this.spd * (keys.has("right") - keys.has("left"));
		this.velocity.y += this.size * this.spd * (keys.has("down") - keys.has("up"));
		//arrow keys
		var [x, y] = [0, 0];
		if(keys.has("right2")) x++;
		if(keys.has("left2")) x--;
		if(keys.has("down2")) y++;
		if(keys.has("up2")) y--;
		this.skl = Boolean(x || y);
		if(this.skill && (x || y)) this.skill.directional(x, y, focus);
		else if(this.skill && (keys.get("secondary") == 1 || keys.get("secondary") == 3)) this.skill.secondary(focus);
		if(keys.has("secondary")) keys.set("secondary", 2);
		["up", "left", "right", "down"].forEach(key => {
			if(keys.has(key)) this.moved = true;
		});
	}
	/**React to pressed keys*/
	touchv2(focus) {
		var {touch, touch2} = this;
		if(touch && touch.end) touch = false;
		if(!touch && !this.moved) touches.forEach(obj => {
			if(obj.sx < innerWidth/2 && obj != touch2 && !obj.end && Date.now() - game.tick * 5 > obj.start) {
				touch = obj;
			}
		});
		if(!touch2 && !this.skl) touches.forEach(obj => {
			if(obj.sx > innerWidth/2 && obj != touch && !obj.end) {
				touch2 = obj;
			}
		});
		if(touch && !this.moved) {
			this.move(radian(touch.x - touch.sx, touch.y - touch.sy));
			this.touch = touch;
			drawShape({
				x: touch.sx - game.scale/4,
				y: touch.sy - game.scale/4,
				size: game.scale/2,
				color: this.color,
				shape: "circle"
			});
			ctx.lineWidth = game.scale/4;
			ctx.beginPath();
			ctx.strokeStyle = this.color;
			ctx.moveTo(touch.sx, touch.sy);
			ctx.lineTo(touch.x, touch.y);
			ctx.moveTo(this.mx, this.my);
			ctx.lineTo(this.mx + touch.x - touch.sx, this.my + touch.y - touch.sy);
			ctx.stroke();
		}
		if(touch2 && !this.skl) {
			this.touch2 = touch2;
			if(this.skill && touch2.end) {
				if(Date.now() - game.tick * 5 > touch2.start)
					this.skill.directional(touch2.x - touch2.sx, touch2.y - touch2.sy, focus);
				else this.skill.secondary(focus);
			}
			if(touch2.end) delete this.touch2;
			drawShape({
				x: touch2.sx - game.scale/4,
				y: touch2.sy - game.scale/4,
				size: game.scale/2,
				color: this.color2,
				shape: "circle"
			});
			ctx.lineWidth = game.scale/4;
			ctx.beginPath();
			ctx.strokeStyle = this.color2;
			ctx.moveTo(touch2.sx, touch2.sy);
			ctx.lineTo(touch2.x, touch2.y);
			ctx.moveTo(this.mx, this.my);
			ctx.lineTo(this.mx + touch2.x - touch2.sx, this.my + touch2.y - touch2.sy);
			ctx.stroke();
		}
	}
	ai() {}
	static summon(what) {
		var Splayer = new what().spawn();
		if(!player || !player.skill || !player.lives)
			Splayer.skill = new what.weapon(Splayer);
		else{
			Splayer.skill = player.skill;
			Splayer.skill.user = Splayer;
		}
		if(player && player.lives)
			Splayer.lives = player.lives;
		player = new Spawner(Splayer, () => player = Splayer);
		Splayer.isMain = true;
		player.lives = Splayer.lives;
		return Splayer;
	}
	lives = 3;
	static summonBulk(...arrHeros) {
		var i = 0;
		var r = PI * 2/arrHeros.length;
		var s = game.scale * 2;
		var id = heros.push(undefined);
		heros.delete(id);
		arrHeros.forEach(hero => {if(hero) {
			var nhero = new hero().spawn();
			nhero.x += cos(i * r) * s;
			nhero.x += sin(i++ * r) * s;
			nhero.skill = new hero.weapon(nhero);
			nhero.id = id++;
			nhero.spawn();
			Spawner.summon(new Spawner(nhero, heros));
		}});
	}
	deathSFX = "Death";
	/**Moves the player to the middle of the screen*/
	pickLocation() {
		data.party.add(this.name);
		this.mx = innerWidth/2;
		this.my = innerHeight/2;
		var i = Number(this.id) + 1;
		var r = PI * 2/3;
		var s = game.scale * 2;
		this.x += cos(i * r) * s;
		this.y += sin(i * r) * s;
		SFX.get("Spawn").play();
		Particle.summon(new Shockwave(this, 15 * game.scale));
		enemies.forEach(enemy => {
			if(enemy.alive && Entity.distance(this, enemy) < 10 * game.scale) {
				var radian = Entity.radianTo(this, enemy);
				enemy.mx = this.mx + cos(radian) * game.scale * 10;
				enemy.my = this.my + sin(radian) * game.scale * 10;
			}
		});
	}
	die(focus) {
		if(game.level > 0 && this.lives >= 1 && !hardcore) {
			--this.lives;
			this.hp = this.maxHp;
			this.spawn();
		}else if(focus && SFX.has(this.deathSFX))
			SFX.get(this.deathSFX).play();
	}
}
class Player extends Hero{
	spd = 0.02;
	name = "Shooter";
	description = ["The basic player.", `"Has the gun, Does the shoot"`];
	ai(focus) {
		/**@type {Enemy[]}*/
		var arr = enemies.asArray();
		var arr2 = exp.asArray();
		arr.sort((enemy, enemy2) => Entity.distance(this, enemy) - Entity.distance(this, enemy2));
		arr2.sort((xp, xp2) => Entity.distance(this, xp) - Entity.distance(this, xp2));
		var [enemy] = arr;
		var [xp] = arr2;
		if(xp && Entity.distance(this, xp) > 10 * game.scale) xp = undefined;
		var colXp = false;
		if(enemy) {
			var dis = Entity.distance(this, enemy)/game.scale;
			if(dis < 2.5) {
				this.runFrom(enemy);
				this.skill.secondary(focus);
			}else if(dis < 5) this.runFrom(enemy);
			if(dis < 10) this.shoot(enemy, focus);
			else if(xp) colXp = true;
		}else if(xp) colXp = true;
		if(colXp) this.moveTo(xp);
	}
	shoot(enemy, focus) {
		var start = {x: this.mx, y: this.my};
		var spd = game.scale/6;
		var target = {x: enemy.mx, y: enemy.my};
		var velocity = enemy.velocity;
		for(var i = 1; i < 250; i++) {
			var tx = target.x + velocity.x * i;
			var ty = target.y + velocity.y * i;
			if(distance(tx, ty, start.x, start.y) < spd * i) break;
		}
		if(i < 250) {
			var x = tx - start.x;
			var y = ty - start.y;
			this.skill.directional(x, y, focus);
		}
	}
	static weapon = Gun;
	/**@type {Skill}*/
	skill;
	lives = 5;
	get rotation() {return radian(this.velocity)}
	spawner = 120;
	color = "#55f";
	shape = "square3";
	color2 = "#f55";
	shape2 = "square3";
	get size2() {return this.size/2}
}
class Summoner extends Player{
	ai(focus) {
		/**@type {Enemy[]}*/
		var arr = enemies.asArray();
		var arr2 = exp.asArray();
		arr.sort((enemy, enemy2) => Entity.distance(this, enemy) - Entity.distance(this, enemy2));
		arr2.sort((xp, xp2) => Entity.distance(this, xp) - Entity.distance(this, xp2));
		var [enemy] = arr;
		var [xp] = arr2;
		if(xp && Entity.distance(this, xp) > 10 * game.scale) xp = undefined;
		var colXp = false;
		if(enemy) {
			var dis = Entity.distance(this, enemy)/game.scale;
			var x = enemy.mx - this.mx + dis * enemy.velocity.x/0.075;
			var y = enemy.my - this.my + dis * enemy.velocity.y/0.075;
			if(dis < 5) {
				this.skill.select(2);
				this.skill.directional(x, y, focus);
				this.runFrom(enemy);
			}else if(dis < 10) {
				this.skill.select(0);
				this.skill.directional(x, y, focus);
				this.runFrom(enemy);
			}else if(dis < 15) {
				this.skill.select(1);
				this.skill.directional(x, y, focus);
			}else if(xp) colXp = true;
		}else if(xp) colXp = true;
		if(colXp) this.moveTo(xp);
	}
	spd = 0.015;
	lives = 3;
	name = "Summoner";
	description = ["Can summon things", `"Scared of everything."`];
	static weapon = Minion;
	shape = "bullet";
	color = "#aaa";
	shape2 = "arrow";
	color2 = "#fff";
	get rotation() {return -PI/2}
	get size2() {return this.size}
}