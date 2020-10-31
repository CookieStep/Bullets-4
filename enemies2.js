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