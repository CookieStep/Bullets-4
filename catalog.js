var catalog = {
	getList() {
		var list = [];
		data.catalog.forEach(value => list.push(new (this.converter.get(value))));
		return list;
	},
	getList2() {
		var list = [];
		var id = 0n;
		data.party.forEach(value => {
			var what = this.converter.get(value);
			var hero = new what;
			hero.skill = new what.weapon(hero);
			hero.id = id++;
			list.push(hero);
		});
		return list;
	},
	/**@type {Map<string, typeof Enemy>}*/
	converter: new Map([
		["Chill", Chill],
		["Go-go", GoGo],
		["Underbox", Underbox],
		["Edge lord", Corner],
		["Shooter", Player],
		["Summoner", Summoner]
	]),
	setup() {
		this.active = true;
		onresize();
		this.list = this.getList2();
		this.list.forEach(hero => hero.spawn());
		heros = new Collection(...this.list);
		this.list = this.getList();
		this.list.forEach(enemy => enemy.spawn());
		enemies = new Collection(...this.list);
		this.list = this.getList2().concat(this.getList());
		this.list.forEach(enemy => enemy.prepare());
		this.selected = this.list.length;
		this.mx = 0;
		this.my = 0;
		Music.get("Catalog").play();
		backgroundName = "catalog";
		backgroundColor = "#0a0";
	},
	screen() {game.x = game.scale * 2},
	run() {
		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, game.x2, game.y2);
		var touch;
		touches.forEach(obj => {
			if(!obj.end && !obj.used && !touch) touch = obj;
		});
		var hit;
		if(this.selected != this.list.length) {
			/**@type {Enemy}*/
			var entity = heros.get(BigInt(this.selected));
			if(!entity) entity = enemies.get(BigInt(this.selected - heros.size));
			var {mx, my} = entity;
			mx -= (game.x2)/2;
			my -= (game.y2)/2;
		}else{
			mx = 0;
			my = 0;
		}
		{
			let a = this.mx - mx,
				b = this.my - my;
			let c = max(abs(a), abs(b));
			c /= game.scale/4;
			if(c) {
				if(c < 1) {
					this.mx = mx;
					this.my = my;
				}else{
					this.mx -= a/c;
					this.my -= b/c;
				}
			}
		}
		ctx.translate(-this.mx, -this.my);
		bctx.translate(-this.mx, -this.my);
		main();
		var id = 0;
		heros.forEach(hero => {
			if(!hero.alive) {
				hero.hp = hero.maxHp;
				hero.spawn();
			}else if(touch) {
				if(touch.x > hero.x - this.mx && touch.x < hero.x - this.mx + hero.size && touch.y > hero.y - this.my && touch.y < hero.y - this.my + hero.size) {
					this.selected = id;
					hit = true;
				}
			}
			++id;
		});
		enemies.forEach(enemy => {
			if(!enemy.alive) {
				enemy.hp = enemy.maxHp;
				enemy.spawn();
			}else if(touch) {
				if(touch.x > enemy.x - this.mx && touch.x < enemy.x - this.mx + enemy.size && touch.y > enemy.y - this.my && touch.y < enemy.y - this.my + enemy.size) {
					this.selected = id;
					hit = true;
				}
			}
			++id;
		});
		var del = 0;
		exp.forEach(xp => {
			if(exp.size - del > 50) {
				xp.hp = 0;
				++del;
			}
		});
		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, game.x, game.y2);
		ctx.lineWidth = 5;
		ctx.strokeStyle = "white";
		ctx.strokeRect(game.x, 0, game.x2 - game.x, game.y2);
		ctx.translate(this.mx, this.my);
		bctx.translate(this.mx, this.my);
		ctx.fillStyle = backgroundColor;
		ctx.fillRect(0, 0, game.x, game.y2);
		if(entity) {
			var text = entity.name;
			if(entity.ancestor)
				text += ` (evolves from ${entity.ancestor})`;
			ctx.font = `${game.scale/2}px Sans`
			var width = ctx.measureText(text).width;
			var h = game.scale * 3/4;
			ctx.strokeStyle = "white";
			ctx.beginPath();
			ctx.moveTo(game.x, h);
			ctx.lineTo(game.x + width, h);
			ctx.lineTo(game.x + width + game.scale, 0);
			ctx.lineTo(game.x, 0);
			ctx.closePath();
			ctx.fillStyle = entity.color;
			ctx.fill();
			ctx.stroke();
			ctx.fillStyle = entity.color2 || "black";
			ctx.fillText(text, game.x + game.scale/4, game.scale/2);
			{
				width = 0;
				let amo = 0;
				entity.description.forEach(value => {
					var s = ctx.measureText(value).width;
					if(s > width) width = s; ++amo;
				});
				width += game.scale/5;
				var x = game.x2 - width;
				ctx.fillStyle = "#ccc";
				ctx.fillRect(x - game.scale/4, 0, width + game.scale/4, amo * h + h/4);
				ctx.strokeRect(x - game.scale/4, 0, width + game.scale/4, amo * h + h/4);
				ctx.fillStyle = "black";
				entity.description.forEach((value, i) => {
					i = +i;
					ctx.fillText(value, x, h * (i + 1));
				});
			}
		}
		ctx.strokeStyle = "white";
		ctx.lineWidth = 5;
		ctx.moveTo(game.x, 0);
		ctx.lineTo(game.x, game.y2);
		ctx.stroke();
		var any = (...list) => {
			var any = false;
			list.forEach(v => {
				if(!any && (keys.get(v) == 1 || keys.get(v) == 3)) any = true;
			});
			return any;
		}
		if(any("down", "down2", "right", "right2")) catalog.selected++;
		if(any("up", "up2", "left", "left2")) catalog.selected--;
		["up", "up2", "left", "left2", "right", "right2", "down", "down2"].forEach(key => {
			if(keys.has(key)) keys.set(key, 2);
		});
		this.selected = (this.selected + this.list.length + 1) % (this.list.length + 1);
		var s = game.scale * 2;
		this.list.forEach((enemy, i) => {
			i = +i;
			var y = s * i;
			enemy.mx = game.x/2;
			enemy.y = i * s;
			enemy.y += game.scale/2;
			if(touch) {
				if(touch.x < s && touch.y > y && touch.y < y + s) {
					this.selected = i;
					hit = true;
				}
			}
			if(this.selected == i) {
				ctx.fillStyle = "white";
				ctx.fillRect(0, y, s, s);
			}
			enemy.draw();
		});
		ctx.fillStyle = "white";
		var y = game.y2 - s;
		var end;
		if(touch && touch.x < s && touch.y > y && touch.y < y + s) end = true;
		if(touch && !hit) this.selected = this.list.length;
		ctx.fillRect(0, y, s, s);
		drawShape({x: 0, y: y, size: s, shape: "arrow", color: "red", rotation: PI});
		if(keys.get("back") == 1) {
			keys.set("back", 2);
			end = true;
		}
		if(end) {
			heros.clear();
			particles.clear();
			exp.clear();
			this.active = false;
			Music.get("Catalog").stop();
			mainMenu.setup();
		}
	}
}