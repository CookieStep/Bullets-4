var canvas = document.createElement("canvas"),
	ctx = canvas.getContext("2d", {alpha: false});
var {
	cos, sin, PI,
	ceil, floor, round,
	sqrt, pow, abs
} = Math, {
	assign
} = Object;
/**@param {number} max @param {number} min*/
var random = (max, min) =>
    Math.random() * (max - min) + min;
/**@type {Player}*/
var player;