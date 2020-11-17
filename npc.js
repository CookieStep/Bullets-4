class Npc extends Entity{
    spawn(x, y) {
		this.pickLocation(x, y);
		return this;
    }
    pickLocation(x, y) {
        this.mx = x;
        this.my = y;
    }
    static summon(npc, x, y) {
        npcs.push(npc.spawn(x, y));
        return npc;
    }
}
class TopHat extends Npc{
    tick() {
        if(game.event.arena1) {
            var x = game.x2/6,
                y = game.y2/2
            if(Entity.distance(this, {x, y}) > game.scale/5) this.moveTo(x, y);
        }
        if(game.event.arena2 || game.event.curve1) {
            var x = game.x2/6,
                y = game.y2/4
            if(Entity.distance(this, {x, y}) > game.scale/5) this.moveTo(x, y);
        }
        if(game.event.curve2) this.hp = 0;
    }
    shape = "square4";
    color = "#ddd";
    shape2 = "tophat";
    color2 = "#fff";
    get rotation2() {
        return atan2(game.scale, this.velocity.x) - PI/2;
    }
    static textColor = "#ddd";
}