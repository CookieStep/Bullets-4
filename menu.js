function mainMenu() {
	main(false);
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
	var touch;
	touches.forEach(obj => {
		if(!obj.end && !obj.used && !touch) touch = obj;
	});
	for(let part of mainMenu.items) {
		let {text, base, color, edge} = part;
		let outline = selected == i? "white": color;
		ctx.fillStyle = "white";
		let width = ctx.measureText(text).width;
		let x = (game.x - width)/2;
		let y = h * i * spa;
		y += h * 3.5;
		h *= 4/3;
		drawShape({shape: base.shapeFill, x, y, size: width, sizeY: h, strokeAlpha: 0, color});
		drawShape({shape: edge.shapeFill, x: x - h, y, size: h, strokeAlpha: 0, color});
		drawShape({shape: edge.shapeFill, x: x + width, y, size: h, strokeAlpha: 0, color, rotation: PI});
		drawShape({shape: base.shape, x, y, size: width, sizeY: h, fillAlpha: 0, color: outline});
		drawShape({shape: edge.shape, x: x - h, y, size: h, fillAlpha: 0, color: outline});
		drawShape({shape: edge.shape, x: x + width, y, size: h, fillAlpha: 0, color: outline, rotation: PI});
		ctx.fillText(text, x, y + (h * 3/4));
		if(touch) {
			if(touch.x > x - h && touch.x < x + width + h && touch.y > y && touch.y < y + h) {
				selected = i;
			}
		}
		h *= 3/4;
		i++;
	}
	if(touch || keys.get(" ") == 1) {
		keys.set(" ", 2);
		if(selected in mainMenu.items && mainMenu.items[selected].select) mainMenu.items[selected].select();
	}
}
mainMenu.selected = -1;
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
	},
	select() {
		mainMenu.stop();
		game.level = 0;
		onresize();
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
		mainMenu.stop();
		catalog.setup();
	}
}]
mainMenu.setup = function() {
	player = undefined;
	game.level = -1;
	enemies.clear();
	this.active = true;
	onresize();
	while(enemies.size < 20) Enemy.summonBulk(...catalog.getList());
	Music.get("MainMenu").play();
	backgroundName = undefined;
	backgroundColor = "#000";
}
mainMenu.stop = function() {
	this.active = false;
	enemies.clear();
	Music.get("MainMenu").stop();
}
mainMenu.screen = function() {
	game.x = innerWidth/2;
}