class Skill{
	/**@param {Entity} user*/
	constructor(user) {
		this.user = user;
	}
	update() {}
	/**Arrow Keys
	 * @param {number} x @param {number} y*/
	directional(x, y) {}
}
class Gun extends Skill{
	/**Arrow Keys
	 * @param {number} x @param {number} y*/
	directional(x, y) {
		if(this.lastShot) return;
		this.lastShot = 10;
		var bullet = new Bullet(this.user, radian(x, y)).spawn();
		bullet.x += player.size * x/2;
		bullet.y += player.size * y/2;
		bullets.push(bullet);
	}
	update() {
		if(this.lastShot) this.lastShot--;
	}
	lastShot = 0;
}