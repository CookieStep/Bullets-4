class Particle extends Entity{
	static summon(particle) {
        var id = particles.push(particle);
        particle.id = id;
		return particle;
    }
    update() {
        this.tick();
    }
}
class Shockwave extends Particle{
    constructor(parent, size) {
        super(parent);
        this.mx = parent.mx;
        if(typeof this.mx != "number") this.mx = parent.x;
        this.my = parent.my;
        if(typeof this.my != "number") this.my = parent.y;
        this.Msize = size;
        this.scale = 0;
    }
    get alive() {return this.size < this.Msize}
    tick() {
        var {parent} = this;
        this.scale += this.Msize/(game.scale * 50);
        this.mx = parent.mx;
        if(typeof this.mx != "number") this.mx = parent.x;
        this.my = parent.my;
        if(typeof this.my != "number") this.my = parent.y;
    }
    get fillAlpha() {return 0}
    shape = "circle";
    get undoStrokeScale() {
        return this.scale;
    }
    color = "white";
}