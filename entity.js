class Entity{
	/**@param {Entity} parent*/
	constructor(parent) {
		this.parent = parent;
	}
	velocity = {x: 0, y: 0};
	friction = 0.9;
	x = 0; y = 0;
	color = "white";
	shape = "square";
	get size() {
		return game.scale * this.scale;
	}
	scale = 1;
	spd = 0.01;
	/**Bounce off walls?*/
	wallBounce = true;
	/**The actual Hp value*/
	hp = 1;
	/**Max hp this can have*/
	maxHp = 1;
	/**Damage dealt on contact*/
	atk = 1;
	/**@param {Entity} attacker*/
	attack(attacker) {
		this.hp -= attacker.atk;
	}
	get alive() {return this.hp > 0}
	update() {
		if(this.skill) this.skill.update();
		this.tick();
		this.forces();
		this.screenlock();
	}
	/**Move to spawn*/
	pickLocation() {
		this.x = random(innerWidth - this.size);
		this.y = random(innerHeight - this.size);
	}
	spawn() {
		this.pickLocation();
		return this;
	}
	screenlock() {
		var x = false, y = false;
		var {wallBounce} = this
		if(this.x < 0) {
			x = true;
			this.x = 0;
			if(wallBounce) this.velocity.x = abs(this.velocity.x);
		}
		if(this.y < 0) {
			y = true;
			this.y = 0;
			if(wallBounce) this.velocity.y = abs(this.velocity.y);
		}
		if(this.x + this.size > innerWidth) {
			x = true;
			this.x = innerWidth - this.size;
			if(wallBounce) this.velocity.x = -abs(this.velocity.x);
		}
		if(this.y + this.size > innerHeight) {
			y = true;
			this.y = innerHeight - this.size;
			if(wallBounce) this.velocity.y = -abs(this.velocity.y);
		}
		if(x || y) this.hitWall(x, y);
	}
	tick() {}
	/**@param {boolean} x Hit the x wall? @param {boolean} y Hit the y wall?*/
	hitWall(x, y) {}
	forces() {
		this.x += this.velocity.x;
		this.y += this.velocity.y;
		this.velocity.x *= sqrt(this.friction);
		this.velocity.y *= sqrt(this.friction);
	}
	draw() {
		var {
			x, y,
			size,
			color,
			shape,
			rotation,
			fillAlpha,
			strokeAlpha,
			shape2,
			color2,
			rotation2,
			fillAlpha2,
			strokeAlpha2,
		} = this;
		drawShape({shape, x, y, size, color, rotation, strokeAlpha, fillAlpha});
		if(shape2) {
			var test = (what, type, fallback) => typeof what == type? what: fallback;
			drawShape({
				shape: shape2,
				x, y, size,
				color: test(color2, "string", color),
				rotation: test(rotation2, "number", rotation),
				fillAlpha: test(fillAlpha2, "number", fillAlpha),
				strokeAlpha: test(strokeAlpha2, "number", strokeAlpha)
			});
		}
	}
	move(radian) {
		this.velocity.x += cos(radian) * this.spd * this.size;
		this.velocity.y += sin(radian) * this.spd * this.size;
	}
	/**Rotation of shape*/
	get rotation() {return 0}
	/**Rotation of shape2
	 * @type {number}*/
	get rotation2() {return undefined}
	/**transparency of shape's fill*/
	get fillAlpha() {return this.hp/this.maxHp}
	/**transparency of shape2's fill*/
	get fillAlpha2() {return this.fillAlpha}
	/**transparency of shape's outline*/
	get strokeAlpha() {return 1}
	/**transparency of shape2's outline*/
	get strokeAlpha2() {return this.fillAlpha}
	get mx() {return this.x + this.size/2}
	get my() {return this.y + this.size/2}
	set mx(mx) {this.x = mx - this.size/2}
	set my(my) {this.y = my - this.size/2}
	/**Distance between a and b
	 * @param {Entity} a @param {Entity} b*/
	static distance(a, b) {
		var dis = {x: a.x - b.x, y: a.y - b.y};
		return sqrt((dis.y * dis.y) + (dis.x * dis.x));
	}
	/**Is a touching b?
	 * @param {Entity} a @param {Entity} b*/
	static isTouching = (a, b) =>
		abs(a.mx - b.mx) < (a.size + b.size)/2 && abs(a.my - b.my) < (a.size + b.size)/2;
	/**Radian from a to b
	 * @param {Entity} a @param {Entity} b*/
	static radianTo = (a, b) => radian(a.x - b.x, a.y - b.y);
}