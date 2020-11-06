class Skill{
	/**@param {Entity} user*/
	constructor(user) {this.user = user}
	update() {}
	/**Arrow Keys
	 * @param {number} x @param {number} y*/
	directional(x, y) {}
	secondary() {}
	draw() {
		var a = floor(this.sk/this.rsk);
		if(a <= 0) return;
		var {user} = this;
		var m = user.size * 1.5;
		var s = user.size/3;
		var ri = PI * 2 / a;
		var x = user.mx - s/2;
		var y = user.my - s/2;
		for(let i = 0; i < a; i++) {
			var rad = ri * i + tick/(a * 2 + 3);
			drawShape({
				x: x + cos(rad) * m, y: y + sin(rad) * m,
				size: s, color: this.color, shape: this.shape,
				fillAlpha: 0, rotation: rad
			});
			drawShape({
				x: x + cos(rad) * m, y: y + sin(rad) * m,
				size: s, color: this.color2, shape: this.shape2,
				fillAlpha: 0, rotation: rad
			});
		}
	}
}
class Gun extends Skill{
	/**Arrow Keys
	 * @param {number} x @param {number} y*/
	directional(x, y) {
		if(this.sk < this.rsk) return;
		if(this.lastShot) return;
		var {user} = this;
		this.sk -= this.rsk;
		({x, y} = point(radian(x, y)));
		this.lastShot = 10;
		var bullet = new this.projectile(this.user, radian(x, y));
		bullet.mx = user.mx;
		bullet.my = user.my;
		bullet.x += user.size * x/2;
		bullet.y += user.size * y/2;
		bullets.push(bullet);
		SFX.get(this.sound).play();
	}
	secondary() {
		if(this.sk < this.rsk) return;
		if(this.lastShot) return;
		var {user} = this;
		this.sk -= this.rsk2;
		this.lastShot = 40;
		for(let i = 0; i < 8; i++) {
			let rad = PI/4 * i;
			let bullet = new this.projectile(this.user, rad);
			bullet.mx = user.mx;
			bullet.my = user.my;
			let x = cos(rad);
			let y = sin(rad);
			bullet.x += user.size * x/2;
			bullet.y += user.size * y/2;
			SFX.get(this.sound).play();
			bullets.push(bullet);
		}
	}
	update() {
		if(this.lastShot) this.lastShot--;
		var a = 20 - floor(this.sk/this.rsk);
		if(a > 0) this.sk += a/320;
		this.color = this.user.color2;
	}
	get desc() {return [
		`Shoot cost: ${this.rsk}`,
		`Burst shot cost: ${this.rsk2}`
	]}
	sound = "Shoot";
	sk = 20;
	rsk = 10;
	rsk2 = 60;
	lastShot = 0;
	projectile = Bullet;
	shape = "square3";
	color = "white";
}
class Minion extends Gun{
	projectile = MinionProjectileGoGo;
	list = [MinionProjectileGoGo, MinionProjectileUnderbox, MinionProjectileChill];
	sel = 0;
	secondary() {
		++this.sel;
		this.sel %= this.list.length;
		this.select();
	}
	select(num=-1) {
		if(num != -1) this.sel = num;
		this.projectile = this.list[this.sel];
		let summon = new this.projectile(this.user);
		this.shape = summon.shape;
		this.user.shape2 = summon.shape2;
	}
	get desc() {return [
		`Summon cost: ${this.rsk}`,
		`Press "${keybindMenu.get("secondary")}" to switch summon`
	]}
	sound = "Spawn";
	sk = 80;
	rsk = 20;
	shape = "square2";
}
class MinionProjectileGoGo extends GoGo{
	constructor(parent, rad) {
		super(parent);
		this.velocity = point(rad);
		this.color = parent.color;
		this.color2 = parent.color2;
	}
	spd = 0.03;
	die() {}
	scale = 1/2;
}
class MinionProjectileUnderbox extends Underbox{
	constructor(parent, rad) {
		super(parent);
		this.target = point(rad);
		this.color = parent.color;
		this.color2 = parent.color2;
	}
	spd = 0.03;
	die() {}
	scale = 1/2;
}
class MinionProjectileChill extends Chill{
	constructor(parent) {
		super(parent);
		this.color = parent.color;
		this.color2 = parent.color2;
	}
	die() {}
	scale = 1/2;
}