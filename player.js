class Player extends Entity{
	tick() {
		this.keys();
	}
	/**Moves the player to the middle of the screen*/
	pickLocation() {
		this.x = (innerWidth - this.size)/2;
		this.y = (innerHeight - this.size)/2;
	}
	/**React to pressed keys*/
	keys() {
		//wasd
		this.velocity.x += this.size * this.spd * (keys.has("d") - keys.has("a"));
		this.velocity.y += this.size * this.spd * (keys.has("s") - keys.has("w"));
		//Arrow keys
		var [x, y] = [0, 0];
		if(keys.has("ArrowRight")) x++;
		if(keys.has("ArrowLeft")) x--;
		if(keys.has("ArrowDown")) y++;
		if(keys.has("ArrowUp")) y--;
		if(this.skill && (x || y)) this.skill.directional(x, y);
	}
	/**@type {Skill}*/
	skill;
	get rotation() {return radian(this.velocity)}
	color = "blue";
	shape = "square3";
}