class Bullet extends Entity{
	/**@param {Entity} parent @param {number} rad*/
	scale = 1/4;
	spd = 0.05;
	knockback = 2;
	constructor(parent, rad) {
		super(parent);
		this.color = parent.color2;
		this.rad = rad;
	}
	pickLocation() {
		var {parent} = this;
		this.mx = parent.mx;
		this.my = parent.my;
	}
	get fillAlpha() {
		return this.parent.fillAlpha;
	}
	time = 100;
	get alive() {return this.time > 0}
	/**@param {Entity} attacker*/
	attack(attacker) {
		this.time -= attacker.atk * 25;
	}
	tick() {
		if(this.time-- == 100) this.move(this.rad);
		else this.move(radian(this.velocity));
	}
	shape = "square3";
}