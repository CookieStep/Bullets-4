var canvas = document.createElement("canvas"),
	ctx = canvas.getContext("2d", {alpha: false});
var {
	cos, sin, PI, atan2,
	ceil, floor, round,
	sqrt, pow, abs,
	max, min
} = Math, {
	assign
} = Object;
/**@param {number} max @param {number} min*/
var random = (max=1, min=0) =>
	Math.random() * (max - min) + min;
/**
 * @param {number | {x: number, y: number}} x Either and {x, y} or a number
 * @param {number} y The y value, if not inside x
*/
var radian = (x, y=undefined) => typeof x == "number"? atan2(y, x): atan2(x.y, x.x);
var point = (radian, distance=1) => ({x: cos(radian) * distance, y: sin(radian) * distance});
var constrain = (value, max=1, min=0) => round((value - min)/(max - min)) * (max - min) + min;
/**@type {Player}*/
var player;
/**@type {Collection<Bullets>}*/
var bullets = new Collection;
/**@type {Collection<Enemy>}*/
var enemies = new Collection;
/**@type {Collection<Enemy>}*/
var enemies2 = new Collection;
/**@type {Collection<Particle>}*/
var particles = new Collection;
var hardcore;
//921600 => 40
var game = {
	scale: 40,
	level: 0,
	fps: 50,
	lives: 3,
	x: 0,
	y: 0,
	x2: innerWidth,
	y2: innerHeight,
	get tick() {
		return 1000/this.fps;
	}
}