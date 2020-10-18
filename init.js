var canvas = document.createElement("canvas"),
	ctx = canvas.getContext("2d", {alpha: false});
var {
	cos, sin, PI, atan2,
	ceil, floor, round,
	sqrt, pow, abs
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
/**@type {Player}*/
var player;
/**@type {Bullet[]}*/
var bullets = [];
/**@type {Enemy[]}*/
var enemies = [];
var enemies2 = [];
var game = {
	scale: 40,
	level: 0,
	fps: 50,
	lives: 3,
	get tick() {
		return 1000/this.fps;
	}
}