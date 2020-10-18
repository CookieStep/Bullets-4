class Entity{
	velocity = {x: 0, y: 0};
	friction = 0.9;
    x = 0; y = 0;
    color = "white";
    shape = "square";
    size = 40;
    spd = 0.01;
	update() {
		this.tick();
        this.forces();
        this.screenlock();
    }
    screenlock() {
        if(this.x < 0) {
            this.x = 0;
            this.velocity.x = abs(this.velocity.x);
        }
        if(this.y < 0) {
            this.y = 0;
            this.velocity.y = abs(this.velocity.y);
        }
        if(this.x + this.size > innerWidth) {
            this.x = innerWidth - this.size;
            this.velocity.x = -abs(this.velocity.x);
        }
        if(this.y + this.size > innerHeight) {
            this.y = innerHeight - this.size;
            this.velocity.y = -abs(this.velocity.y);
        }
    }
	tick() {}
	forces() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
		this.velocity.x *= sqrt(this.friction);
        this.velocity.y *= sqrt(this.friction);
	}
	draw() {
		var {
			x, y,
			size,
            color,
            shape
		} = this;
		drawShape({shape, x, y, size, color});
	}
}