class Exp extends Entity{
	constructor(parent, xp, rad) {
		super(parent);
		this.xp = xp/10;
		this.rad = rad;
	}
	r = random(PI);
	rspd = random(PI/16, PI/-16);
	spd = 0.05;
	deathSFX = "Xp";
	tick() {
		var {player} = this;
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
	static summon(dead, xp) {
		var r = PI/5;
		var s = random(PI);
		for(let i = 0; i < 10; i++)
			exp.push(new Exp(dead, xp, r * i + s).spawn());
	}
	color = "#ff5";
	get rotation() {return this.r}
}