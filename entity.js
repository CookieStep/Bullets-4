class Entity{
	/**@param {Entity} parent*/
	constructor(parent) {this.parent = parent}
	/**The class this one "evolves from" or extends*/
	ancestor;
	name = "Entity";
	description = ["This is like,", "where you should write a description."];
	velocity = {x: 0, y: 0};
	knockback = 1;
	knockRes = 1;
	friction = 0.9;
	x = 0; y = 0;
	id = -1n;
	wallSFX = true;
	color = "white";
	shape = "square";
	color2 = "black";
	shape2 = "";
	get size() {return game.scale * this.scale}
	scale = 1;
	spd = 0.015;
	/**when hit wall?*/
	onWall = BOUNCE;
	/**The actual Hp value*/
	hp = 1;
	/**Max hp this can have*/
	maxHp = 1;
	/**Damage dealt on contact*/
	atk = 1;
	/**@param {Entity} attacker*/
	attack(attacker) {
		this.hp -= attacker.atk;
		if(!this.alive) this.die();
	}
	die() {
		if(SFX.has(this.deathSFX)) SFX.get(this.deathSFX).play();
	}
	/**Plays when this entity dies
	 * @type {string}*/
	deathSFX;
	get alive() {return this.hp > 0}
	update(focus) {
		if(this.skill) this.skill.update();
		this.tick();
		this.forces();
		this.screenlock(focus);
	}
	/**Move to spawn*/
	pickLocation() {
		var {
			x=0,
			y=0,
			x2=innerWidth,
			y2=innerHeight
		} = game;
		this.x = random(x2 - this.size, x);
		this.y = random(y2 - this.size, y);
	}
	spawn() {
		this.pickLocation();
		return this;
	}
	static wall(num, ver, d) {
		switch(ver) {
			case(BOUNCE): return d * abs(num);
			case(NULL): return 0;
			default: return num;
		}
	}
	/**@param {boolean} focus Is this screen important? (used for audio, mainly)*/
	screenlock(focus) {
		var {
			x=0,
			y=0,
			x2=innerWidth,
			y2=innerHeight
		} = game;
		var wallX = false, wallY = false;
		var {onWall, velocity} = this;
		if(this.x < x) {
			wallX = true;
			this.x = x;
			velocity.x = Entity.wall(velocity.x, onWall, 1);
		}
		if(this.y < y) {
			wallY = true;
			this.y = y;
			velocity.y = Entity.wall(velocity.y, onWall, 1);
		}
		if(this.x + this.size > x2) {
			wallX = true;
			this.x = x2 - this.size;
			velocity.x = Entity.wall(velocity.x, onWall, -1);
		}
		if(this.y + this.size > y2) {
			wallY = true;
			this.y = y2 - this.size;
			velocity.y = Entity.wall(velocity.y, onWall, -1);
		}
		if(wallX || wallY) {
			if(this.wallSFX && focus) SFX.get("Wall").play();
			this.hitWall(wallX, wallY);
		}
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
	moveTo(x, y) {
		if(typeof x == "number") {
			this.move(radian(x - this.mx, y - this.my));
			return Entity.distance(this, {x, y});
		}else if("mx" in x) this.move(radian(x.mx - this.mx, x.my - this.my));
		else if("x" in x) this.move(radian(x.x - this.mx, x.y - this.my));
		return Entity.distance(this, x);
	}
	prepare() {}
	draw() {
		var {
			x, y,
			size,
			color,
			shape,
			rotation,
			fillAlpha,
			strokeAlpha,
			undoStrokeScale,
			shape2,
			color2,
			rotation2,
			fillAlpha2,
			strokeAlpha2,
			undoStrokeScale2
		} = this;
		drawShape({shape, x, y, size, color, rotation, strokeAlpha, fillAlpha, undoStrokeScale});
		if(shape2) {
			var test = (what, type, fallback) => typeof what == type? what: fallback;
			drawShape({
				shape: shape2,
				x, y, size,
				color: test(color2, "string", color),
				rotation: test(rotation2, "number", rotation),
				fillAlpha: test(fillAlpha2, "number", fillAlpha),
				strokeAlpha: test(strokeAlpha2, "number", strokeAlpha),
				undoStrokeScale: undoStrokeScale2
			});
		}
		if(this.skill) this.skill.draw();
	}
	/**@param {number} radian @param {Entity[]} tests*/
	move(radian, ...tests) {
		this.velocity.x += cos(radian) * this.spd * this.size;
		this.velocity.y += sin(radian) * this.spd * this.size;
		if(tests.length) {
			var a = false;
			tests.forEach(test => {
				if(Entity.isTouching(this, test)) a = true;
			});
			return a;
		}
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
		var x = a.mx == undefined? a.x: a.mx;
		var y = a.my == undefined? a.y: a.my;
		var x2 = b.mx == undefined? b.x: b.mx;
		var y2 = b.my == undefined? b.y: b.my;
		var dis = {x: x - x2, y: y - y2};
		return sqrt((dis.y * dis.y) + (dis.x * dis.x));
	}
	/**Is a touching b?
	 * @param {Entity} a @param {Entity} b*/
	static isTouching = (a, b) =>
		abs(a.mx - b.mx) < (a.size + b.size)/2 && abs(a.my - b.my) < (a.size + b.size)/2;
	/**Radian from a to b
	 * @param {Entity} a @param {Entity} b*/
	static radianTo = (a, b) => radian(b.x - a.x, b.y - a.y);
	/** @param {Entity} a @param {Entity} b*/
	static collide = (a, b, focus) => {
		if(focus) SFX.get("Wall").play();
		let s = (a.size + b.size)/2,
			x = a.mx - b.mx,
			y = a.my - b.my;
		x /= 10;
		y /= 10;
		if(x < s) {
			a.velocity.x = (x * b.knockback) * a.knockRes;
			b.velocity.x = (-x * a.knockback) * b.knockRes;
		}
		if(y < s) {
			a.velocity.y = (y * b.knockback) * a.knockRes;
			b.velocity.y = (-y * a.knockback) * b.knockRes;
		}
	}
}
const
	BOUNCE = Symbol("Bounce"),
	NULL = Symbol("Null"),
	NOTHING = Symbol("Nothing");