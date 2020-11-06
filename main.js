function main(focus=true) {
	runLevel(game.level);
	if(dialogue.active) dialogue.update();
	if(player && player.alive) player.update();
	enemies.remove(enemy => !enemy.alive);
	exp.remove(xp => !xp.alive);
	bullets.remove(bullet => !bullet.alive);
	heros.remove(hero => !hero.alive);
	npcs.remove(npc => !npc.alive);
	particles.remove(particle => !particle.alive);
	exp.forEach(xp => {
		var add = () => {
			let amo = heros.size;
			if(player && player.alive) ++amo;
			if(player && player.alive && player.skill) ++player.skill.sk;
			heros.forEach(hero => {
				if(hero.skill) hero.skill.sk += 1/amo;
			});
		}
		xp.update();
		if(player && player.alive && Entity.isTouching(player, xp)) {xp.attack(player); add()}
		heros.forEach(hero => {if(xp.alive && Entity.isTouching(hero, xp)) {xp.attack(hero); add()}});
	});
	enemies.forEach(enemy => {
		enemy.update(focus);
		if(player && player.alive && Entity.isTouching(player, enemy)) {
			Entity.collide(player, enemy, focus);
			player.attack(enemy);
			enemy.attack(player);
		}
		heros.forEach(hero => {
			if(enemy.alive && Entity.isTouching(enemy, hero)) {
				Entity.collide(hero, enemy, focus);
				hero.attack(enemy);
				enemy.attack(hero);
			}
		});
		bullets.forEach(bullet => {
			if(enemy.alive && Entity.isTouching(enemy, bullet)) {
				Entity.collide(bullet, enemy, focus);
				bullet.attack(enemy);
				enemy.attack(bullet);
			}
		});
	});
	bullets.forEach(bullet => {bullet.update(focus)});
	heros.forEach(hero => {hero.update()});
	npcs.forEach(npc => {
		npc.update();
		if(player && player.alive && Entity.isTouching(npc, player))
			Entity.collide(npc, player, focus);
		enemies.forEach(enemy => {
			if(Entity.isTouching(enemy, npc))
				Entity.collide(npc, enemy, focus);
		});
		heros.forEach(hero => {
			if(Entity.isTouching(hero, npc))
				Entity.collide(npc, hero, focus);
		});
		bullets.forEach(bullet => {
			if(Entity.isTouching(bullet, npc))
				Entity.collide(npc, bullet, focus);
		});
	});
	particles.forEach(particle => {particle.update()});
	{let enemiesArray = enemies.asArray();
		for(let a = 0; a < enemiesArray.length; a++) for(let b = a + 1; b < enemiesArray.length; b++) {
			let enemy = enemiesArray[a], enemy2 = enemiesArray[b];
			if(Entity.isTouching(enemy, enemy2))
				Entity.collide(enemy, enemy2, focus);
		}
	}
	{let bulletsArray = bullets.asArray();
		for(let a = 0; a < bulletsArray.length; a++) for(let b = a + 1; b < bulletsArray.length; b++) {
			let bullet = bulletsArray[a], bullet2 = bulletsArray[b];
			if(Entity.isTouching(bullet, bullet2))
				Entity.collide(bullet, bullet2, focus);
		}
	}
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
	var w = game.x2 - game.x,
		h = game.y2 - game.y;
	var w2 = ceil(w/game.scale) * game.scale,
		h2 = ceil(h/game.scale) * game.scale
	var back = backgrounds.get(backgroundName);
	if(back) {
		bctx.drawImage(back, 0, 0)
	}else{
		var backGen = bckdrpGen.get(backgroundName);
		if(backGen) {
			let back = backGen(w2, h2);
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
			path.addPath(back, Matrix(back.scale, back.scale, (w - w2)/2 + game.x, (h - h2)/2 + game.y));
			ctx.strokeStyle = back.stroke;
			ctx.fillStyle = back.fill;
			ctx.fill(path);
			ctx.stroke(path);
			backgrounds.set(backgroundName, canvas);
		}
	}
	if(game.level > 0) {
		if(player && !hardcore) {
			let x = (game.x2 - game.scale * player.lives)/2;
			for(let i = 0; i < player.lives; i++) {
				drawShape({
					shape: player.shape, color: player.color,
					size: game.scale, x: x + i * game.scale, y: 0, fillAlpha: 0
				});
			}
		}
	}
	/**@type {Boss}*/
	let boss = game.boss[0];
	if(boss) {
		let x = game.x2/4;
		let y = game.y2 - game.scale * 3/2;
		let s = game.scale;
		let width = (game.x2 - game.scale)/2;
		ctx.lineWidth = s/10;
		ctx.fillStyle = boss.color2;
		ctx.strokeStyle = boss.color;
		ctx.beginPath();
		ctx.fillRect(x + game.scale/2, y, width * (boss.hp/boss.maxHp), s);
		ctx.strokeRect(x + game.scale/2, y, width, s);
		drawShape({x, y, size: s, shape: boss.shape, color: boss.color, rotation: boss.rotation});
		drawShape({x, y, size: s, shape: boss.shape2, color: boss.color2 || boss.color, rotation: (typeof boss.rotation2 == "number")? boss.rotation2: boss.rotation});
	}
	particles.forEach(particle => {particle.draw()});
	heros.forEach(hero => {hero.draw()});
	if(player && player.alive) player.draw();
	enemies.forEach(enemy => enemy.draw());
	npcs.forEach(npc => {npc.draw()});
	bullets.forEach(bullet => {bullet.draw()});
	exp.forEach(xp => {xp.draw()});
	if(dialogue.active) dialogue.draw();
}