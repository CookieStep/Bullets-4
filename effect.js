class Particle{
	/**@param {Entity} parent*/
	constructor(parent) {this.parent = parent}
	x = 0; y = 0;
	id = -1n;
	color = "white";
	shape = "square";
	get size() {return game.scale * this.scale}
	scale = 1;
	static summon(particle) {
		var id = particles.push(particle);
		particle.id = id;
		return particle;
	}
	update() {
		this.tick();
	}
	draw() {Entity.prototype.draw.call(this)}
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
}
class Shockwave extends Particle{
	constructor(parent, size) {
		super(parent);
		this.mx = parent.mx;
		if(typeof this.mx != "number") this.mx = parent.x;
		this.my = parent.my;
		if(typeof this.my != "number") this.my = parent.y;
		this.Msize = size;
		this.px = this.mx;
		this.py = this.my;
		this.scale = 0;
	}
	get alive() {return this.size < this.Msize}
	tick() {
		this.scale += this.Msize/(game.scale * 50);
		this.mx = this.px;
		this.my = this.py;
	}
	get fillAlpha() {return 0}
	shape = "circle";
	get undoStrokeScale() {
		return this.scale;
	}
	color = "white";
}
class Spawner extends Particle{
	constructor(parent, collection) {
		super(parent);
		parent.update();
		this.scale = this.parent.scale * 2;
		if(parent.spawner) this.hue = parent.spawner;
		this.collection = collection;
	}
	tick() {
		var {parent} = this;
		this.mx = parent.mx;
		this.my = parent.my;
		if(this.time-- == 0) {
			if(this.collection.push) {
				var id = this.collection.push(parent);
				parent.id = id;
			}else this.collection(parent);
		}
		this.color = `hsl(${this.hue}, 100%, ${50 + abs(25 - (this.time % 50)) * 2}%)`;
	}
	draw() {
		var {parent} = this;
		super.draw();
		parent.draw();
	}
	get alive() {return this.time >= 0}
	hue = 0;
	time = 100;
	scale = 2;
	shape = "4star";
	get rotation() {return this.time * PI/25}
}