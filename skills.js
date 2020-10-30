class Skill{
	/**@param {Entity} user*/
	constructor(user) {this.user = user}
	update() {}
	/**Arrow Keys
	 * @param {number} x @param {number} y*/
	directional(x, y) {}
}
class Gun extends Skill{
	/**Arrow Keys
	 * @param {number} x @param {number} y*/
	directional(x, y) {
		if(this.sk < this.rsk) return;
		if(this.lastShot) return;
		this.sk -= this.rsk;
		({x, y} = point(radian(x, y)));
		this.lastShot = 10;
		var bullet = new Bullet(this.user, radian(x, y)).spawn();
		bullet.x += player.size * x/2;
		bullet.y += player.size * y/2;
		bullets.push(bullet);
	}
	update() {
		if(this.lastShot) this.lastShot--;
		var a = 20 - floor(this.sk/this.rsk);
		if(a > 0) {
			this.sk += a/320;
		}
	}
	draw() {
		var {user} = this;
		var m = user.size * 1.5;
		var s = user.size/3;
		var a = floor(this.sk/this.rsk);
		var ri = PI * 2 / a;
		var x = user.mx - s/2;
		var y = user.my - s/2;
		for(let i = 0; i < a; i++) {
			var rad = ri * i + tick/(a * 2 + 3);
			drawShape({
				x: x + cos(rad) * m, y: y + sin(rad) * m,
				size: s, color: "white", shape: "square3",
				fillAlpha: 0, rotation: rad
			});
		}
	}
	sk = 0;
	rsk = 10;
	lastShot = 0;
}