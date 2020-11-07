var canvas = document.createElement("canvas"),
	pen = canvas.getContext("2d", { alpha: false }),
	background = document.createElement("canvas"),
	bctx = background.getContext("2d"),
	foreground = document.createElement("canvas"),
	ctx = foreground.getContext("2d");
var {
	cos, sin, PI, atan2,
	ceil, floor, round,
	sqrt, pow, abs,
	max, min
} = Math, {
	assign
} = Object;
/**@param {number} max @param {number} min @returns {number} A number between **min** and **max***/
var random = (max = 1, min = 0) =>
	Math.random() * (max - min) + min;
var flip = (num = 1) =>
	round(random()) * num;
/**
 * @param {number | {x: number, y: number}} x Either and {x, y} or a number
 * @param {number} y The y value, if not inside x (Must be used)
 * @returns {number} A radian from two coordinates
*/
var radian = (x, y = undefined) => typeof x == "number" ? atan2(y, x) : atan2(x.y, x.x);
/**
 * Gets the point in coordinates from the radian and distance
 * - the coordinates are relative to 0
 * @param {number} radian The radian used to calculate the point
 * @param {number} distance The distance used to calcualte the point with the radian
 * @returns {object} Returns an object containing the x and y coordinates
 * 				   - **{x: 5, y: -3}**
*/
var point = (radian, distance = 1) => ({ x: cos(radian) * distance, y: sin(radian) * distance });

/**
 * @param {number} value The initial number to check against
 * @param {number} max The maximum number the initial value can be
 * @param {number} min The minimum number the initial value can be
 * @returns {number} - Returns the original value or the clamped value
 *					 - depending if it's out of the bounds
*/
var constrain = (value, max = 1, min = 0) => round((value - min) / (max - min)) * (max - min) + min;
/**
 * @param {number} x The x coordinate of the first object
 * @param {number} y The y coordinate of the first object
 * @param {number} x2 The x coordinate of the second object
 * @param {number} y2 The y coordinate of the second object
 * @returns {number} The distance between two objects/points
*/
var distance = (x, y, x2 = 0, y2 = 0) => sqrt(pow(x - x2, 2) + pow(y - y2, 2));
/**@type {Player}*/
var player;
/**@type {Collection<Player>}*/
var heros = new Collection;
/**@type {Collection<Bullets>}*/
var bullets = new Collection;
/**@type {Collection<Enemy>}*/
var enemies = new Collection;
/**@type {Collection<Enemy>}*/
var enemies2 = new Collection;
/**@type {Collection<Exp>}*/
var exp = new Collection;
/**@type {Collection<Particle>}*/
var particles = new Collection;
/**@type {Collection<Npc>}*/
var npcs = new Collection;
var hardcore;
var speedrun;
var game = {
	//921600 => 40
	scale: 40,
	level: 0,
	fps: 40,
	lives: 0,
	score: 0,
	boss: [],
	reset() { this.lives = 3; this.event = {}; this.boss = []},
	x: 0,
	y: 0,
	event: {},
	x2: innerWidth,
	y2: innerHeight,
	get m() { return min(this.x, this.y) },
	get m2() { return min(this.x2, this.y2) },
	get tick() {
		return 1000 / this.fps;
	}
}
var tick = 0;
/**@type {string}*/
var backgroundName = "tutorial",
	backgroundColor = "#000";