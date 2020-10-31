class Exp extends Entity{
	constructor(parent, rad) {
		super(parent);
		this.rad = rad;
	}
	r = random(PI);
	rspd = random(PI/16, PI/-16);
	spd = 0.075;
	deathSFX = "Xp";
	tick() {
		if(player && player.alive && Entity.distance(this, player) < 5 * game.scale)
			this.moveTo(player);
		this.r += this.rspd;
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
	color = "#ff5";
	get rotation() {return this.r}
}