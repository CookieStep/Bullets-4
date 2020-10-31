class Player extends Entity{
	tick() {
		this.keys();
		this.touchv2();
	}
	// die() {
	//	if(!hardcore) {
	//		this.spawn();
	//		this.hp = this.maxHp;
	//	}
	// }
	deathSFX = "Death";
	/**Moves the player to the middle of the screen*/
	pickLocation() {
		this.x = (innerWidth - this.size)/2;
		this.y = (innerHeight - this.size)/2;
		enemies.forEach(enemy => {
			if(Entity.distance(this, enemy) < 5 * game.scale) {
				var radian = Entity.radianTo(this, enemy);
				enemy.x += cos(radian) * enemy.size * 5;
				enemy.y += sin(radian) * enemy.size * 5;
			}
		});
		SFX.get("Spawn").play();
		Particle.summon(new Shockwave(this, 15 * game.scale));
	}
	/**React to pressed keys*/
	keys() {
		//wasd
		this.velocity.x += this.size * this.spd * (keys.has("d") - keys.has("a"));
		this.velocity.y += this.size * this.spd * (keys.has("s") - keys.has("w"));
		//Arrow keys
		var [x, y] = [0, 0];
		if(keys.has("ArrowRight")) x++;
		if(keys.has("ArrowLeft")) x--;
		if(keys.has("ArrowDown")) y++;
		if(keys.has("ArrowUp")) y--;
		if(this.skill && (x || y)) this.skill.directional(x, y);
	}
	touchv1() {
		var {touch, touch2} = this;
		if(touch && touch.end) touch = false;
		if(touch2 && touch2.end) touch2 = false;
		if(!touch) touches.forEach(obj => {
			if(obj != touch2 && !obj.end && Date.now() - game.tick * 5 > obj.start) {
				touch = obj;
			}
		});
		if(!touch2) touches.forEach(obj => {
			if(obj != touch && !obj.end && Date.now() - game.tick * 5 > obj.start) {
				touch2 = obj;
			}
		});
		if(touch) {
			this.moveTo(touch);
			this.touch = touch;
		}
		if(touch2) {
			if(this.skill) this.skill.directional(touch2.x - this.mx, touch2.y - this.my);
			this.touch2 = touch2;
		}
	}
	touchv2() {
		var {touch, touch2} = this;
		if(touch && touch.end) touch = false;
		if(touch2 && touch2.end) touch2 = false;
		if(!touch) touches.forEach(obj => {
			if(obj.sx < innerWidth/2 && obj != touch2 && !obj.end && Date.now() - game.tick * 5 > obj.start) {
				touch = obj;
			}
		});
		if(!touch2) touches.forEach(obj => {
			if(obj.sx > innerWidth/2 && obj != touch && !obj.end && Date.now() - game.tick * 5 > obj.start) {
				touch2 = obj;
			}
		});
		if(touch) {
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
		if(touch2) {
			if(this.skill) this.skill.directional(touch2.x - touch2.sx, touch2.y - touch2.sy);
			this.touch2 = touch2;
			if(!this.skill) return;
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
	/**@type {Skill}*/
	skill;
	get rotation() {return radian(this.velocity)}
	color = "#55f";
	shape = "square3";
	color2 = "#f55";
}
