class Hero extends Entity{
	tick() {
		if(this.isMain) {
			this.keys();
			switch(data.touchStyle) {
				case 1: this.touchv1();
				case 2: this.touchv2();
				case 3: this.touchv3();
			}
		}else this.ai();
	}
	keys() {
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
		if(this.skill && (x || y)) this.skill.directional(x, y);
		else if(this.skill && (keys.get("select") == 1 || keys.get("select") == 3)) this.skill.secondary();
		["up", "left", "right", "down"].forEach(key => {
			if(keys.has(key)) this.moved = true;
		});
	}
	ai() {}
	static summon() {
		var Splayer = new Player().spawn();
		Splayer.skill = new Player.weapon(Splayer);
		Splayer.isMain = true;
		player = new Spawner(Splayer, () => player = Splayer);
		return Splayer;
	}
	lives = 3;
	static summonBulk(...arrHeros) {arrHeros.forEach(hero => {
		var nhero = new Player().spawn();
		nhero.skill = new hero.weapon(nhero);
		Spawner.summon(new Spawner(nhero, heros));
	})}
	deathSFX = "Death";
	/**Moves the player to the middle of the screen*/
	pickLocation() {
		this.mx = innerWidth/2;
		this.my = innerHeight/2;
		enemies.forEach(enemy => {
			if(Entity.distance(this, enemy) < 15 * game.scale) {
				var radian = Entity.radianTo(this, enemy);
				enemy.mx = this.mx + cos(radian) * game.scale * 15;
				enemy.my = this.my + sin(radian) * game.scale * 15;
			}
		});
		SFX.get("Spawn").play();
		Particle.summon(new Shockwave(this, 15 * game.scale));
	}
	die() {
		if(game.level > 0 && this.lives > 0 && !hardcore) {
			--this.lives;
			this.hp = this.maxHp;
			this.spawn();
		}
	}
}
class Player extends Hero{
	/**React to pressed keys*/
	touchv1() {
		var {touch, touch2} = this;
		if(touch && touch.end) touch = false;
		if(touch2 && touch2.end) touch2 = false;
		if(!touch && !this.moved) touches.forEach(obj => {
			if(obj != touch2 && !obj.end && Date.now() - game.tick * 5 > obj.start) {
				touch = obj;
			}
		});
		if(!touch2 && !this.skl) touches.forEach(obj => {
			if(obj != touch && !obj.end && Date.now() - game.tick * 5 > obj.start) {
				touch2 = obj;
			}
		});
		if(touch && !this.moved) {
			this.moveTo(touch);
			this.touch = touch;
			touch.used = true;
		}
		if(touch2 && !this.skl) {
			if(this.skill) this.skill.directional(touch2.x - this.mx, touch2.y - this.my);
			this.touch2 = touch2;
			touch2.used = true;
		}
	}
	touchv2() {
		var {touch, touch2} = this;
		if(touch && touch.end) touch = false;
		if(touch2 && touch2.end) touch2 = false;
		if(!touch && !this.moved) touches.forEach(obj => {
			if(obj.sx < innerWidth/2 && obj != touch2 && !obj.end && Date.now() - game.tick * 5 > obj.start) {
				touch = obj;
			}
		});
		if(!touch2 && !this.skl) touches.forEach(obj => {
			if(obj.sx > innerWidth/2 && obj != touch && !obj.end && Date.now() - game.tick * 5 > obj.start) {
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
			ctx.stroke();
		}
		if(touch2 && !this.skl) {
			this.touch2 = touch2;
			if(this.skill) this.skill.directional(touch2.x - touch2.sx, touch2.y - touch2.sy);
			else return;
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
			ctx.stroke();
		}
	}
	touchv3() {
		var {touch, touch2} = this;
		if(touch && touch.end) touch = false;
		if(!touch && !this.moved) touches.forEach(obj => {
			if(obj.sx < innerWidth/2 && obj != touch2 && !obj.end && Date.now() - game.tick * 5 > obj.start) {
				touch = obj;
			}
		});
		if(!touch2 && !this.skl) touches.forEach(obj => {
			if(obj.sx > innerWidth/2 && obj != touch && !obj.end && Date.now() - game.tick * 5 > obj.start) {
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
			ctx.stroke();
		}
		if(touch2 && !this.skl) {
			if(!touch2.end) {
				this.touch2 = touch2;
				return;
			}else delete this.touch2;
			if(this.skill) this.skill.directional(touch2.x - touch2.sx, touch2.y - touch2.sy);
			else return;
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
			ctx.stroke();
		}
	}
	ai() {
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
			var x = enemy.mx - this.mx + dis * 5 * enemy.velocity.x;
			var y = enemy.my - this.my + dis * 5 * enemy.velocity.y;
			if(dis < 2.5) {
				this.runFrom(enemy);
				this.skill.secondary();
			}else if(dis < 5) this.runFrom(enemy);
			if(dis < 10) this.skill.directional(x, y);
			else if(xp) colXp = true;
			else this.moveTo(player)
		}else if(xp) colXp = true;
		if(colXp) this.moveTo(xp);
	}
	static weapon = Gun;
	/**@type {Skill}*/
	skill;
	get rotation() {return radian(this.velocity)}
	spawner = 120;
	color = "#55f";
	shape = "square3";
	color2 = "#f55";
}
class Summoner extends Hero{
	
}