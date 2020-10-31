class Enemy extends Entity{
	spawn(sound=true) {
		var tries = 0, good;
		do{
			this.pickLocation();
			++tries;
			good = !(player && player.alive) || Entity.distance(player, this) > game.scale * 5;
		}while(good && tries < 10);
		if(good && sound) SFX.get("Spawn").play();
		return good? this: good;
	}
	die() {
		super.die();
		Exp.summon(this);
		data.catalog.add(this.name);
	}
	deathSFX = "Hit";
	/**@param {Enemy} enemy*/
	static summon(enemy) {
		enemy = enemy.spawn();
		if(enemy) Particle.summon(new Spawner(enemy, enemies));
		return enemy;
	}
	/**@param {Enemy[]} enemies*/
	static summonBulk(...enemyArray) {
		enemyArray.forEach(enemy => {
			enemy = enemy.spawn(false);
			if(enemy) enemies.push(enemy);
			return enemy;
		});
	}
}
class Chill extends Enemy{
	name = "Chill";
	description = ["Does nothing.", `"He's pretty chill"`];
	color = "#fa5";
	shape = "square2";
}
class GoGo extends Enemy{
	name = "Go-go";
	description = ["Litterally just moves.", `"Doesn't care where it's going`, `As long as it's going somewhere!"`]
	tick() {
		var {x, y} = this.velocity;
		if(x || y) this.move(this.rotation);
		else this.move(random(PI * 2));
	}
	prepare() {this.velocity = {y: -1, x: 0}}
	get rotation() {return radian(this.velocity)}
	color = "#faa";
	shape = "square2";
	color2 = "red";
	shape2 = "arrow";
}
class Underbox extends GoGo{
	name = "Underbox";
	ancestor = "Go-go";
	description = ["Picks a direction", "Does not sway from it's decision.", `"Filled with DETERMINATION"`];
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
	prepare() {this.target = {y: -1, x: 0}}
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
	get rotation2() {return radian(this.target)}
}
class Corner extends Enemy{
	name = "Edge lord";
	description = ["Goes from corner to corner", `"Is always on edge."`];
	pickLocation() {
		var {
			x: gx=0,
			y: gy=0,
			x2=innerWidth,
			y2=innerHeight
		} = game;
		super.pickLocation();
		var a = round(random());
		if(a) this.x = constrain(this.x, x2, gx);
		else this.y = constrain(this.y, y2, gy);
		this.a = a;
		this.pickDir();
	}
	tick() {
		var {
			x: gx=0,
			y: gy=0,
			x2=innerWidth,
			y2=innerHeight
		} = game;
		var {a, velocity} = this;
		this.move(radian(this.velocity));
		if(a) this.x = constrain(this.x, x2, gx);
		else this.y = constrain(this.y, y2, gy);
		if(a) velocity.x = 0;
		else velocity.y = 0;
		if(this.last) --this.last;
	}
	pickDir() {
		var {
			x: gx=0,
			y: gy=0,
			x2=innerWidth,
			y2=innerHeight
		} = game;
		var x = constrain(this.x, x2, gx) - gx,
			y = constrain(this.y, y2, gy) - gy;
		this.velocity = {y: y? -1: 1, x: x? -1: 1};
		this.last = 10;
	}
	/**@param {boolean} x Hit the x wall? @param {boolean} y Hit the y wall?*/
	hitWall(x, y) {
		var {a} = this;
		if((a && y) || (!a && x)) {
			this.a = !a;
			this.pickDir();
		}
	}
	wallSFX = false;
	color = "#ffa";
	color2 = "#ec0";
	shape2 = "4square";
}