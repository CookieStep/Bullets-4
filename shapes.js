{
	/**@param {Path2D} path*/
	let _a = (path) => {};
	/**@param {_a} script*/
	var createShape = (script) => {
		var path = new Path2D;
		script(path);
		return path;
	}
	/**@type {Map<string, Path2D>}*/
	var shapes = new Map;
	shapes.set("square", createShape(path => {
		path.rect(0, 0, 1, 1);
	}));
	shapes.set("circle", createShape(path => {
		path.arc(1/2, 1/2, 1/2, 0, PI * 2);
	}));
	shapes.set("square3", createShape(path => {
		var r = 1/3;
		path.moveTo(r, 0);
		path.lineTo(1-r, 0);
		path.quadraticCurveTo(1, 0, 1, 0+r);
		path.lineTo(1, 1-r);
		path.quadraticCurveTo(1, 1, 1-r, 1);
		path.lineTo(r, 1);
		path.quadraticCurveTo(0, 1, 0, 1-r);
		path.lineTo(0, r);
		path.quadraticCurveTo(0, 0, r, 0);
	}));
	/**@param {{
		 shape: string, x: number, y: number,
		size: number, color: string,
		alpha?: number,
		rotation?: number
	}} options*/
	function drawShape(options) {
		var {
			shape, x, y,
			size, color,
			alpha=1,
			rotation=0
		} = options;
		var hasDependencies = (
			typeof x == "number" &&
			typeof y == "number" &&
			typeof color == "string" &&
			typeof size == "number"
		), isPath = shape instanceof Path2D;
		if((shapes.has(shape) || isPath) && hasDependencies) {
			var path = isPath? shape: shapes.get(shape);
			var mx = x + size/2,
				my = y + size/2;
			ctx.beginPath();
			ctx.translate(mx, my);
			ctx.rotate(rotation);
			ctx.translate(-mx, -my);
			ctx.lineWidth = 0.1;
			ctx.fillStyle = color;
			ctx.strokeStyle = color;
			ctx.translate(x, y);
			ctx.scale(size, size);
			ctx.globalAlpha = alpha;
			ctx.fill(path);
			ctx.globalAlpha = 1;
			ctx.stroke(path);
			ctx.scale(1/size, 1/size);
			ctx.translate(-x, -y);
			return true;
		}else return false;
	}
}