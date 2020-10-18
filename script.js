function update(e) {
	if(Date.now() < update.last + (game.tick)) {update.run(); return;}
	runLevel(game.level);
	if(player && player.alive) player.update();
	enemies = enemies.filter(enemy => enemy.alive);
	bullets = bullets.filter(bullet => bullet.alive);
	enemies.forEach(enemy => {
		enemy.update();
		if(player.alive && Entity.isTouching(player, enemy)) {
			player.attack(enemy);
			enemy.attack(player);
		}
		bullets.forEach(bullet => {
			if(Entity.isTouching(enemy, bullet)) {
				bullet.attack(enemy);
				enemy.attack(bullet);
			}
		})
	});
	bullets.forEach(bullet => {bullet.update()});
	for(let a = 0; a < enemies.length; a++) for(let b = a + 1; b < enemies.length; b++) {
		let enemy = enemies[a], enemy2 = enemies[b];
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
	if(dialogue.active) dialogue.update();
	ctx.fillStyle = "#0005";
	ctx.fillRect(0, 0, innerWidth, innerHeight);
	if(player && player.alive) player.draw();
	enemies.forEach(enemy => enemy.draw());
	bullets.forEach(bullet => {bullet.draw()});
	if(dialogue.active) dialogue.draw();
	update.last = Date.now();
	update.run();
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
	update();
}
onresize = () => assign(canvas, {
	width: innerWidth,
	height: innerHeight
});