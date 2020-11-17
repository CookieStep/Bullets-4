class Switch extends Underbox{
	name = "Switch";
	ancestor = "Underbox";
	description = ["Underbox. but can switch direction", `"Optimistic, determined, yet indecisive."`];
	tick() {
		if(!this.last) {
			this.last = floor(random(120, 30)) + 1;
			delete this.target;
		}else --this.last;
		this.color = `hsl(${300 - this.last/2}, 100%, 50%)`;
		super.tick();
	}
	prepare() {
		super.prepare();
		this.color = "#a0f";
	}
	shape2 = "arrow3";
	color2 = "#ff0";
}
class Ghost extends Chill{
	name = "Ghost";
	ancestor = "Chill";
	description = ["Invisible when far away", `"You can hide, but you can't run!"`];
	tick() {
		if(player && player.alive) {
			var dis = Entity.distance(this, player);
			if(dis < this.size * 10) this.dis = dis/(10 * this.size);
			else this.dis = 1;
			if(this.fade > -1) this.fade -= 25;
			if(this.fade < -1) this.fade = -1;
		}else{
			if(this.fade == -1) this.fade = 0;
			this.fade++;
			this.fade %= 1000;
		}
		if(abs(this.velocity.x) > this.size/100 || abs(this.velocity.y) > this.size/100) this.fade = 0;
	}
	prepare() {
		this.fade = 250;
	}
	fade = -1;
	color = "#ccc";
	get fillAlpha() {
		if(this.fade == -1) var alpha = 1 - this.dis;
		else alpha = abs(500 - this.fade)/500;
		return alpha * this.hp/this.maxHp;
	}
	get strokeAlpha() {return this.fillAlpha}
}
class Looper extends Enemy{
	name = "Looper";
	description = ["Always going around in a circle", `"Bring back the swim team!"`];
	constructor(parent) {
		super(parent);
		this.i = round(random());
		this.rot = this.i? 1: -1;
	}
	tick() {
		this.time++;
		this.move(this.rotation + PI/(this.i + 1));
	}
	get rotation() {
		return this.time * PI/20 * this.rot;
	}
	get rotation2() {
		return this.rotation + PI/2;
	}
	shape = "corner3";
	color = "#a5f";
	shape2 = "arrowloop";
	color2 = "#f0f";
	time = 0; xp = 15;
}
class Swerve extends Enemy{
	name = "Swerve";
	description = ["Does a weird curve like motion...", "You'd have to see it to understand", `"The original swim team."`];
	time = 0;
	constructor(parent) {
		super(parent);
		this.time = floor(random(0, 360 * 5));
		this.spd *= 1.5;
	}
	tick() {
		this.time += 2;
		this.move(this.rotation);
	}
	prepare() {
		this.time = 0;
	}
	get rotation() {
		return radian(this.velocity) + this.time * PI/180;
	}
	wallSFX = false;
	shape = "square";
	color = "#0fa";
	shape2 = "4square";
	xp = 25;
}
class Around extends Enemy{
	name = "Around";
	description = ["Loops around the middle of the screen", `"BEEP BEEP, OUT OF THE WAY!"`];
	time = 0;
	constructor() {
		super();
		this.spd *= 1.5;
		this.setup();
	}
	setup() {
		this.d = random(game.scale * 3, game.m2/2);
		this.d2 = this.d/(this.size * 5);
		this.time = random(0, this.d2 * 360);
		var p = point(this.time *  PI/(50 * this.d2), this.d);
		p.x += (game.x2 - game.x)/2 + game.x;
		p.y += (game.y2 - game.y)/2 + game.y;
		this.p = p;
	}
	pickLocation() {
		super.pickLocation();
		this.setup();
	}
	tick() {
		++this.time;
		var p = point(this.time *  PI/(50 * this.d2), this.d);
		p.x += (game.x2 - game.x)/2 + game.x;
		p.y += (game.y2 - game.y)/2 + game.y;
		this.p = p;
		this.moveTo(p.x, p.y);
	}
	prepare() {
		this.up = true;
	}
	shape = "bullet";
	color = "#aaf";
	shape2 = "arrow2";
	color2 = "#fff";
	xp = 30;
	get rotation() {
		if(this.up) return -PI/2;
		else return radian(this.velocity);
	}
	get rotation2() {
		if(this.up) return -PI/2;
		return radian(this.p.x - this.mx, this.p.y - this.my);
	}
}