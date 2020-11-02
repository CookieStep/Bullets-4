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
		if(this.currentPhase) this.currentPhase();
	}
	attack(enemy) {
		super.attack(enemy)
		Exp.summon(this);
	}
	die() {
		if(SFX.has(this.deathSFX))
			SFX.get(this.deathSFX).play();
		Exp.summon(this);
	}
	scale = 2;
	spawner = 180;
}
class Boss1 extends Boss{
	shape = "4star";
	color = "#f55";
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
			this.spd = this.nspd;
			if(!player || !player.alive) this.next();
			else{
				this.r = 1;
				this.moveTo(player);
				this.summons = 0;
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
	nspd = this.spd/2;
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