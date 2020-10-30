class Exp extends Entity{
	constructor(parent, rad) {
		super(parent);
		this.rad = rad;
	}
	spd = 0.05;
	tick() {
		if(player && player.alive) {
			if(Entity.distance(this, player) < 5 * game.scale) {
				this.moveTo(player);
			}
		}
	}
	pickLocation() {
		var {parent} = this;
		this.mx = parent.mx;
		this.my = parent.my;
		this.velocity = point(this.rad, this.spd * this.size * 10);
	}
	scale = 1/4;
	static summon(dead) {
		var r = PI/5;
		var s = random(PI);
		for(let i = 0; i < 10; i++)
			exp.push(new Exp(dead, r * i + s).spawn());
	}
}