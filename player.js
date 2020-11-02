class Player extends Entity{
	tick() {
		this.keys();
		switch(data.touchStyle) {
			case 1: this.touchv1();
			case 2: this.touchv2();
			case 3: this.touchv3();
		}
	}
	deathSFX = "Death";
	/**Moves the player to the middle of the screen*/
	pickLocation() {
		this.mx = innerWidth/2;
		this.my = innerHeight/2;
		enemies.forEach(enemy => {
			if(Entity.distance(this, enemy) < 5 * game.scale) {
				var radian = Entity.radianTo(this, enemy);
				enemy.x += cos(radian) * enemy.size * 5;
				enemy.y += sin(radian) * enemy.size * 5;
			}
		});
		SFX.get("Spawn").play();
		Particle.summon(new Shockwave(this, 10 * game.scale));
	}
	/**React to pressed keys*/
	keys() {
		//wasd
		this.velocity.x += this.size * this.spd * (keys.has("right") - keys.has("left"));
		this.velocity.y += this.size * this.spd * (keys.has("down") - keys.has("up"));
		//Arrow keys
		var [x, y] = [0, 0];
		if(keys.has("right2")) x++;
		if(keys.has("left2")) x--;
		if(keys.has("down2")) y++;
		if(keys.has("up2")) y--;
		this.skl = Boolean(x || y);
		if(this.skill && (x || y)) this.skill.directional(x, y);
		["up", "left", "right", "down"].forEach(key => {
			if(keys.has(key)) this.moved = true;
		});
	}
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
	die() {
		if(game.level > 0 && game.lives > 0 && !hardcore) {
			--game.lives;
			this.hp = this.maxHp;
			this.spawn();
		}
	}
	static summon() {
		player = new Player().spawn();
		player.skill = new Player.weapon(player);
		return player;
	}
	static weapon = Gun;
	/**@type {Skill}*/
	skill;
	get rotation() {return radian(this.velocity)}
	color = "#55f";
	shape = "square3";
	color2 = "#f55";
}
