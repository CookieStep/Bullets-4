function main(focus=true) {
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
        enemy.update(focus);
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
    bullets.forEach(bullet => {bullet.update(focus)});
    particles.forEach(particle => {particle.update()});
    {let enemiesArray = enemies.asArray();
        for(let a = 0; a < enemiesArray.length; a++) for(let b = a + 1; b < enemiesArray.length; b++) {
            let enemy = enemiesArray[a], enemy2 = enemiesArray[b];
            if(Entity.isTouching(enemy, enemy2)) {
                if(focus) SFX.get("Wall").play();
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
    particles.forEach(particle => {particle.draw()});
    if(player && player.alive) player.draw();
    enemies.forEach(enemy => enemy.draw());
    bullets.forEach(bullet => {bullet.draw()});
    exp.forEach(xp => {xp.draw()});
    if(dialogue.active) dialogue.draw();
}