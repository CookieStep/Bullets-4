function update(e) {
	if(Date.now() < update.last + (game.tick)) {update.run(); return}
	update.last = Date.now();
	update.run();
	if(mainMenu.active) {
		mainMenu();
	}else if(catalog.active) {
		catalog.run();
	}else{
		runLevel(game.level);
		if(player && player.alive) player.update();
		enemies.remove(enemy => !enemy.alive);
		exp.remove(xp => !xp.alive);
		bullets.remove(bullet => !bullet.alive);
		particles.remove(particle => !particle.alive);
		exp.forEach(xp => {
			xp.update();
			if(player && player.alive && Entity.isTouching(player, xp)) {
				if(player.skill) ++player.skill.sk;
				xp.attack(player);
			}
		});
		enemies.forEach(enemy => {
			enemy.update();
			if(player && player.alive && Entity.isTouching(player, enemy)) {
				player.attack(enemy);
				enemy.attack(player);
			}
			bullets.forEach(bullet => {
				if(enemy.alive && Entity.isTouching(enemy, bullet)) {
					bullet.attack(enemy);
					enemy.attack(bullet);
				}
			})
		});
		bullets.forEach(bullet => {bullet.update()});
		particles.forEach(particle => {particle.update()});
		{let enemiesArray = enemies.asArray();
			for(let a = 0; a < enemiesArray.length; a++) for(let b = a + 1; b < enemiesArray.length; b++) {
				let enemy = enemiesArray[a], enemy2 = enemiesArray[b];
				if(Entity.isTouching(enemy, enemy2)) {
					SFX.get("Wall").play();
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
		if(dialogue.active) dialogue.update();
		ctx.globalCompositeOperation = "destination-out";
		ctx.fillStyle = "#fff5";
		bctx.fillStyle = backgroundColor;
		ctx.fillRect(0, 0, innerWidth, innerHeight);
		bctx.fillRect(0, 0, innerWidth, innerHeight);
		ctx.globalCompositeOperation = "source-over";
		if(++tick % 25 == 0) {
			let imageData = ctx.getImageData(0, 0, innerHeight, innerWidth);
			let {data} = imageData;
			for(let i = 3; i < data.length; i += 3)
				data[i] = floor(data[i]/15) * 15;
			ctx.putImageData(imageData, 0, 0)
		}
		var w = ceil(innerWidth/game.scale) * game.scale,
			h = ceil(innerHeight/game.scale) * game.scale
		var back = backgrounds.get(backgroundName);
		if(back) {
			bctx.drawImage(back, 0, 0)
		}else{
			var backGen = bckdrpGen.get(backgroundName);
			if(backGen) {
				let back = backGen(w, h);
				let canvas = document.createElement("canvas"),
				ctx = canvas.getContext("2d");
				assign(canvas, {
					width: innerWidth,
					height: innerHeight
				});
				//back.update();
				ctx.save();
				ctx.beginPath();
				let path = new Path2D;
				path.addPath(back, Matrix(back.scale, back.scale, (innerWidth - w)/2, (innerHeight - h)/2));
				ctx.strokeStyle = back.stroke;
				ctx.fillStyle = back.fill;
				ctx.fill(path);
				ctx.stroke(path);
				backgrounds.set(backgroundName, canvas);
			}
		}
		particles.forEach(particle => {particle.draw()});
		if(player && player.alive) player.draw();
		enemies.forEach(enemy => enemy.draw());
		bullets.forEach(bullet => {bullet.draw()});
		exp.forEach(xp => {xp.draw()});
		if(dialogue.active) dialogue.draw();
	}
	pen.clearRect(0, 0, innerWidth, innerHeight);
	pen.drawImage(background, 0, 0);
	pen.drawImage(foreground, 0, 0);
}
update.run = () => update.request = requestAnimationFrame(update);
/**@type {Map<string, (1 | 2 | 3)>}*/
var keys = new Map;
onkeydown = (e) => keys.has(e.key)?
	keys.set(e.key, 3): keys.set(e.key, 1);
onkeyup = (e) =>
	keys.delete(e.key);
onload = () => {
	onresize();
	document.body.appendChild(canvas);
	//mainMenu.setup();
	update.run();
}
onresize = () => {
	assign(canvas, {
		width: innerWidth,
		height: innerHeight
	});
	assign(background, {
		width: innerWidth,
		height: innerHeight
	});
	assign(foreground, {
		width: innerWidth,
		height: innerHeight
	});
	assign(game, {
		x: 0,
		y: 0,
		x2: innerWidth,
		y2: innerHeight,
		scale: sqrt((innerWidth * innerHeight * 1600)/921600)
	});
	backgrounds.clear();
	if(mainMenu.active) mainMenu.screen();
	else if(catalog.active) catalog.screen();
}
onblur = () => {
	cancelAnimationFrame(update.request);
	Music.forEach(bgm => bgm.pause());
}
onfocus = () => {
	Music.forEach(bgm => bgm.resume());
	update.run();
}
// var keyBind = {
//     back: 8,
//     down: 83,
//     down2: 40,
//     enter: 13,
//     glide: 16,
//     left: 65,
//     left2: 37,
//     right: 68,
//     right2: 39,
//     select: 32,
//     up: 87,
//     up2: 38
// }