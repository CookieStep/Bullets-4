class Boss extends Enemy{
	phase = 0;
	/**@type {((this: this) => void)[]}*/
	phases = [];
	time = 0;
	get currentPhase() {return this.phases[this.phase]}
	time = 0;
	next() {++this.phase; this.time = 0}
	setPhase(num) {this.phase = num; this.time = 0}
	tick() {
		++this.time;
		if(this.currentPhase)
			this.currentPhase();
	}
	attack(enemy) {
		super.attack(enemy);
		Exp.summon(this);
	}
	die() {
		if(SFX.has(this.deathSFX))
			SFX.get(this.deathSFX).play();
		Exp.summon(this);
		data.party.add(this.name);
		game.boss.splice(game.boss.indexOf(this));
	}
	static summon(boss, x, y) {
		boss = boss.spawn(true, x, y);
		if(boss) {
			Particle.summon(new Spawner(boss, enemies));
			game.boss.push(boss);
		}
		return boss;
	}
	goTo = (x, y, s) => (this.moveTo(x, y) < s) && this.next()
	scale = 2;
	spawner = 240;
	contactSFX = false;
	knockRes = 0.25;
	knockback = 2;
	spd = 0.0075;
}
class TheSummoner extends Boss{
	name = "Summoner";
	phases = [
		() => (this.summons = 0, this.shape2 = "arrow", this.next()),
		() => this.goTo(game.x2/2, game.y2/2, game.scale/5),
		() => {if(this.moveTo(game.x2/2, game.y2/2) < game.scale/5) this.summon(GoGo, 5)},
		() => {
			var {player} = this;
			if(this.time < 250 && player && player.alive) this.runFrom(player);
			else this.next();
		},
		() => (this.summons = 0, this.shape2 = "arrow2", this.next()),
		() => this.goTo(game.x2/6, game.y2/4, game.scale/5),
		() => {if(this.moveTo(game.x2/6, game.y2/4) < game.scale/5) this.summon(Underbox, 5)},
		() => {
			var {player} = this;
			if(this.time < 250 && player && player.alive) this.runFrom(player);
			else this.next();
		},
		() => (this.summons = 0, this.shape2 = "", this.next()),
		() => this.goTo(game.x2 * 5/6 - this.size/2, game.y2 * 3/4 - this.size/2, game.scale/5),
		() => {if(this.moveTo(game.x2 * 5/6 - this.size/2, game.y2 * 3/4 - this.size/2) < game.scale/5) this.summon(Chill, 5)},
		() => {
			var {player} = this;
			if(this.time < 250 && player && player.alive) this.runFrom(player);
			else this.next();
		},
		() => this.setPhase(0)
	];
	wallSFX = false;
	summon(what, amount=1) {
		if(this.summons < amount) {
			var rad = this.summons * PI * 2/amount;
			var dis = game.scale * 3;
			var enemy = Enemy.summon(new what, this.mx + cos(rad) * dis, this.my + sin(rad) * dis, true)
			if(enemy) {
				enemy.color = this.color;
				enemy.color2 = this.color2;
				++this.summons;
			}
			return enemy
		}else this.next();
	}
	shape = "bullet";
	color = "#555";
	color2 = "#aaa";
	get rotation() {return -PI/2}
	hp = 20;
	maxHp = 20;
}
class SpinSaw extends Boss{
	shape = "4star";
	color = "#f55";
	nspd = this.spd;
	phases = [
		() => (this.moveTo(this.size/2, this.size/2) < game.scale/5) && this.next(),
		() => {
			this.r = 1;
			this.spd = this.nspd * 5;
			this.next();
		},
		() => (this.moveTo(game.x2 - this.size/2, this.size/2) < game.scale/5) && this.next(),
		() => (this.moveTo(game.x2 - this.size/2, game.y2 - this.size/2) < game.scale/5) && this.next(),
		() => (this.moveTo(this.size/2, game.y2 - this.size/2) < game.scale/5) && this.next(),
		() => (this.moveTo(this.size/2, this.size/2) < game.scale/5) && this.next(),
		() => {
			var {player} = this;
			this.spd = this.nspd;
			if(!player || !player.alive) this.next();
			else{
				this.moveTo(player);
				if(this.time > 200) {
					this.r = 0;
					this.next();
				}
			}
		},
		() => (this.moveTo(this.size/2, game.y2 - this.size/2) < game.scale/5) && (this.spd += this.nspd) && this.next(),
		() => (this.moveTo(this.size/2, this.size/2) < game.scale/5) && (this.spd += this.nspd) && this.next(),
		() => (this.moveTo(game.m2 - this.size/2, game.m2 - this.size/2) < game.scale/5) && (this.spd += this.nspd) && this.next(),
		() => (this.moveTo(game.x2 - this.size/2, this.size/2) < game.scale/5) && this.next(),
		() => {
			var {player} = this;
			this.spd = this.nspd;
			this.summons = 0;
			if(!player || !player.alive) this.next();
			else{
				this.r = 1;
				this.moveTo(player);
				if(this.time > 200) this.next();
			}
		},
		() => {
			this.r = 0;
			if(this.summons < 5) {
				if(Enemy.summon(new GoGo)) ++this.summons;
			}else this.next();
		},
		() => {if(this.time > 500) this.setPhase(0)}
	];
	onWall = NULL;
	hp = 20;
	maxHp = 20;
	get rotation() {
		switch(this.r) {
			case 0: return 0;
			case 1: return this.time * PI/10;
		}
	}
}