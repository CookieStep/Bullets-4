var catalog = {
	getList() {
		return [new Chill, new GoGo, new Underbox, new Corner, new Switch, new Ghost];
	},
	setup() {
		this.active = true;
		onresize();
		this.list = this.getList();
		this.list.forEach(enemy => enemy.spawn());
		this.enemies = new Collection(...this.list);
		this.list = this.getList();
		this.list.forEach(enemy => enemy.prepare());
		this.selected = this.list.length;
		this.mx = 0;
		this.my = 0;
	},
	screen() {game.x = game.scale * 2},
	run() {
		var {enemies} = this;
		ctx.fillStyle = "#0005";
		ctx.fillRect(0, 0, game.x2, game.y2);
		enemies.forEach(enemy => {enemy.update()});
		{let enemiesArray = enemies.asArray();
			for(let a = 0; a < enemiesArray.length; a++) for(let b = a + 1; b < enemiesArray.length; b++) {
				let enemy = enemiesArray[a], enemy2 = enemiesArray[b];
				if(Entity.isTouching(enemy, enemy2)) {
					let s = (enemy.size + enemy2.size)/2,
						x = enemy.mx - enemy2.mx,
						y = enemy.my - enemy2.my;
					x /= 10;
					y /= 10;
					if(x < s) {
						enemy.velocity.x = x;
						enemy2.velocity.x = -x;
					}
					if(y < s) {
						enemy.velocity.y = y;
						enemy2.velocity.y = -y;
					}
				}
			}
		}
		if(this.selected != this.list.length) {
			/**@type {Enemy}*/
			var enemy = this.enemies.get(BigInt(this.selected));
			var {mx, my} = enemy;
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
			c /= game.scale/2;
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
		ctx.fillStyle = "#0005";
		ctx.fillRect(0, 0, game.x2, game.y2);
		ctx.lineWidth = 5;
		ctx.strokeStyle = "white";
		ctx.strokeRect(game.x, 0, game.x2 - game.x, game.y2);
		enemies.forEach(enemy => enemy.draw());
		ctx.translate(this.mx, this.my);
		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, game.x, game.y2);
		if(enemy) {
			var text = enemy.name;
			if(enemy.ancestor)
				text += ` (evolves from ${enemy.ancestor})`;
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
			ctx.fillStyle = enemy.color;
			ctx.fill();
			ctx.stroke();
			ctx.fillStyle = enemy.color2 || "black";
			ctx.fillText(text, game.x + game.scale/4, game.scale/2);
			if(true) {
				width = 0;
				let amo = 0;
				enemy.description.forEach(value => {
					var s = ctx.measureText(value).width;
					if(s > width) width = s; ++amo;
				});
				width += game.scale/5;
				var x = game.x2 - width;
				ctx.fillStyle = "#ccc";
				ctx.fillRect(x - game.scale/4, 0, width + game.scale/4, amo * h + h/4);
				ctx.strokeRect(x - game.scale/4, 0, width + game.scale/4, amo * h + h/4);
				ctx.fillStyle = "black";
				enemy.description.forEach((value, i) => {
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
		if(keys.get("ArrowDown") == 1 || keys.get("ArrowLeft") == 1) this.selected++;
		if(keys.get("ArrowUp") == 1 || keys.get("ArrowRight") == 1) this.selected--;
		if(keys.has("ArrowDown")) keys.set("ArrowDown", 2);
		if(keys.has("ArrowUp")) keys.set("ArrowUp", 2);
		if(keys.has("ArrowLeft")) keys.set("ArrowLeft", 2);
		if(keys.has("ArrowRight")) keys.set("ArrowRight", 2);
		this.selected = (this.selected + this.list.length + 1) % (this.list.length + 1);
		this.list.forEach((enemy, i) => {
			i = +i;
			enemy.mx = game.x/2;
			enemy.y = i * game.scale * 2;
			enemy.y += game.scale/2;
			if(this.selected == i) {
				ctx.fillStyle = "white";
				ctx.fillRect(0, game.scale * 2 * i, game.scale * 2, game.scale * 2);
			}
			enemy.draw();
		});
	}
}