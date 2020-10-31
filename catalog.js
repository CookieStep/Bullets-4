var catalog = {
	getList() {
		var list = [];
		data.catalog.forEach(value => list.push(new (this.converter.get(value))));
		return list;
	},
	/**@type {Map<string, typeof Enemy>}*/
	converter: new Map([
		["Chill", Chill],
		["Go-go", GoGo],
		["Underbox", Underbox],
		["Edge lord", Corner]
	]),
	setup() {
		this.active = true;
		onresize();
		this.list = this.getList();
		this.list.forEach(enemy => enemy.spawn());
		enemies = new Collection(...this.list);
		this.list = this.getList();
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
		if(this.selected != this.list.length) {
			/**@type {Enemy}*/
			var enemy = enemies.get(BigInt(this.selected));
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
		bctx.translate(-this.mx, -this.my);
		main();
		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, game.x, game.y2);
		ctx.lineWidth = 5;
		ctx.strokeStyle = "white";
		ctx.strokeRect(game.x, 0, game.x2 - game.x, game.y2);
		ctx.translate(this.mx, this.my);
		bctx.translate(this.mx, this.my);
		ctx.fillStyle = backgroundColor;
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
			{
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
		var touch;
		touches.forEach(obj => {
			if(!obj.end && !obj.used && !touch) touch = obj;
		});
		var hit;
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
		if(touch) {
			if(touch.x < s && touch.y > y && touch.y < y + s) {
				end = true;
			}
		}
		if(touch && !hit) this.selected = this.list.length;
		ctx.fillRect(0, y, s, s);
		drawShape({x: 0, y: y, size: s, shape: "arrow", color: "red", rotation: PI});
		if(keys.get("Backspace") == 1) {
			keys.set("Backspace", 2);
			end = true;
		}
		if(end) {
			this.active = false;
			Music.get("Catalog").stop();
			mainMenu.setup();
		}
	}
}