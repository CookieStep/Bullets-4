class Player extends Entity{
    tick() {
        this.keys();
    }
    keys() {
        this.velocity.x += this.size * this.spd * (keys.has("d") - keys.has("a"));
        this.velocity.y += this.size * this.spd * (keys.has("s") - keys.has("w"));
    }
    color = "blue";
    shape = "square3";
}