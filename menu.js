function mainMenu() {
	/*Background*/{
		enemies.forEach(enemy => {
			enemy.update();
		});
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
		ctx.fillStyle = "#0005";
		ctx.fillRect(game.x, 0, game.x2, game.y2);
		enemies.forEach(enemy => enemy.draw());
	}
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, game.x, game.y2);
	ctx.lineWidth = 5;
	ctx.strokeStyle = "white";
	ctx.moveTo(game.x, 0);
	ctx.lineTo(game.x, game.y2);
	ctx.stroke();
	if(keys.get("ArrowDown") == 1 || keys.get("ArrowLeft") == 1) mainMenu.selected++;
	if(keys.get("ArrowUp") == 1 || keys.get("ArrowRight") == 1) mainMenu.selected--;
	if(keys.has("ArrowDown")) keys.set("ArrowDown", 2);
	if(keys.has("ArrowUp")) keys.set("ArrowUp", 2);
	if(keys.has("ArrowLeft")) keys.set("ArrowLeft", 2);
	if(keys.has("ArrowRight")) keys.set("ArrowRight", 2);
	mainMenu.selected = (mainMenu.selected + mainMenu.items.length + 1) % (mainMenu.items.length + 1);
	var {selected} = mainMenu;
	var h = innerHeight/6;
	ctx.font = `${round(h)}px Sans`;
	ctx.fillStyle = "white";
	var text = "Bullets 4";
	var {width} = ctx.measureText(text);
	var x = (game.x - width)/2;
	var color = ctx.createLinearGradient(x, 0, x + width, 0);
	color.addColorStop(0, "white");
	color.addColorStop(1, "red");
	ctx.fillStyle = color;
	ctx.fillText(text, x, h);
	let i = 0;
	h *= 4/8;
	ctx.font = `${h}px Sans`;
	var spa = 2.25
	for(let part of mainMenu.items) {
		let {text, base, color, edge} = part;
		let outline = selected == i? "white": color;
		ctx.fillStyle = "white";
		let width = ctx.measureText(text).width;
		let x = (game.x - width)/2;
		let y = h * i * spa;
		y += h * 3.5;
		h *= 4/3;
		drawShape({shape: base.shapeFill, x, y: y - (h * 3/4), size: width, sizeY: h, strokeAlpha: 0, color});
		drawShape({shape: edge.shapeFill, x: x - h, y: y - (h * 3/4), size: h, strokeAlpha: 0, color});
		drawShape({shape: edge.shapeFill, x: x + width, y: y - (h * 3/4), size: h, strokeAlpha: 0, color, rotation: PI});
		drawShape({shape: base.shape, x, y: y - (h * 3/4), size: width, sizeY: h, fillAlpha: 0, color: outline});
		drawShape({shape: edge.shape, x: x - h, y: y - (h * 3/4), size: h, fillAlpha: 0, color: outline});
		drawShape({shape: edge.shape, x: x + width, y: y - (h * 3/4), size: h, fillAlpha: 0, color: outline, rotation: PI});
		ctx.fillText(text, x, y);
		h *= 3/4;
		i++;
	}
	if(keys.get(" ") == 1) {
		keys.set(" ", 2);
		if(selected in mainMenu.items && mainMenu.items[selected].select) mainMenu.items[selected].select();
	}
}
mainMenu.selected = 0;
mainMenu.items = [{
	text: "Story mode",
	color: "#fa5",
	base: {
		shape: "squareBase",
		shapeFill: "square"
	},
	edge: {
		shape: "trapEdge",
		shapeFill: "trapEdgeFill"
	}
}, {
	text: " Challenges ",
	color: "#f55",
	base: {
		shape: "squareBase",
		shapeFill: "square"
	},
	edge: {
		shape: "triEdge",
		shapeFill: "triEdgeFill"
	}
}, {
	text: "Catalog",
	color: "#ad2",
	base: {
		shape: "squareBase",
		shapeFill: "square"
	},
	edge: {
		shape: "circleEdge",
		shapeFill: "circleEdgeFill"
	},
	select() {
		mainMenu.active = false;
		catalog.setup();
	}
}]
mainMenu.setup = function() {
	player = undefined;
	enemies.clear();
	this.active = true;
	onresize();
	for(let i = 0; i < 5; i++) Enemy.summonBulk(...catalog.getList());
}
mainMenu.screen = function() {
	game.x = innerWidth/2;
}