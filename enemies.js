class Enemy extends Entity{
	spawn() {
		var tries = 0, good;
		do{
			this.pickLocation();
			++tries;
			good = Entity.distance(player, this) > game.scale * 5;
		}while(good && tries < 10);
		return good? this: good;
	}
	/**@param {Enemy} what*/
	static summon(what) {
		what = what.spawn();
		if(what) return enemies.push(what);
		else return what;
	}
}
class Chill extends Enemy{
	color = "#fa5";
	shape = "square2";
}
class GoGo extends Enemy{
	tick() {
		var {x, y} = this.velocity;
		if(x || y) this.move(this.rotation);
		else this.move(random(PI * 2));
	}
	get rotation() {return radian(this.velocity)}
	color = "#faa";
	shape = "square2";
	color2 = "red";
	shape2 = "arrow";
}
class Underbox extends GoGo{
	tick() {
		if(this.target) this.move(this.rotation2);
		else{
			var rad = random(PI * 2);
			this.target = {
				x: cos(rad),
				y: sin(rad)
			}
		}
	}
	/**@param {boolean} x Hit the x wall? @param {boolean} y Hit the y wall?*/
	hitWall(x, y) {
		var {target} = this;
		target.x *= (-x) || 1;
		target.y *= (-y) || 1;
	}
	color = "#afa";
	shape = "square";
	color2 = "#0c0";
	shape2 = "arrow2";
	get rotation2() {
		return radian(this.target);
	}
}
class Corner extends Enemy{
	pickLocation() {
		var a = round(random());
		this.a = a;
		this.d = round(random())? -1: 1; 
		super.pickLocation();
		var w = innerWidth - this.size;
		var h = innerHeight - this.size;
		if(a) this.x = round(this.x/w) * w;
		else this.y = round(this.y/h) * h;
	}
	wallBounce = false;
	tick() {
		if(!("n" in this)) this.n = this.a;
		this.move(PI * this.n/2);
	}
	hitWall(x, y) {
		var w = innerWidth - this.size;
		var h = innerHeight - this.size;
		this.velocity = {x: 0, y: 0};
		this.x = round(this.x/w) * w;
		this.y = round(this.y/h) * h;
		this.n = (this.n + 3 * this.d) % 4;
		this.wa = true;
	}
	color = "#ffa";
	color2 = "#fe0";
	shape2 = "4square";
}