{
	let Shape = class extends Path2D{
		/**Radian to rotate the shape by*/
		rotation = 0;
		/**Scale factor for the shape*/
		scale = 1;
	}
	/**@param {(ctx: Shape) => void script*/
	var createShape = (script) => {
		var ctx = new Shape;
		script(ctx);
		return ctx;
	}
	/**@type {Map<string, Shape>}*/
	var shapes = new Map;
	shapes.set("square", createShape(path => {
		path.rect(0, 0, 1, 1);
	}));
	shapes.set("circle", createShape(path => {
		path.arc(1/2, 1/2, 1/2, 0, PI * 2);
	}));
	shapes.set("square2", createShape(path => {
		var r = 1/2;
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
	shapes.set("arrow", createShape(path => {
		path.moveTo(1/2, 1/8);
		path.lineTo(3/4, 2/5);
		path.lineTo(3/5, 2/5);
		path.lineTo(3/5, 4/5);
		path.lineTo(2/5, 4/5);
		path.lineTo(2/5, 2/5);
		path.lineTo(1/4, 2/5);
		path.closePath();
		path.rotation = PI/2;
	}));
	shapes.set("arrow2", createShape(path => {
		//Top Triangle
		path.moveTo(1/2, 1/8);
		path.lineTo(3/4, 2/5);
		path.lineTo(1/4, 2/5);
		path.closePath();
		//Bottom Triangle
		path.moveTo(1/2, 4/8);
		path.lineTo(3/4, 4/5);
		path.lineTo(1/4, 4/5);
		path.closePath();
		path.rotation = PI/2;
	}));
	shapes.set("4square", createShape(path => {
		path.scale = 4;
		path.rect(0, 0, 1, 1);
		path.rect(3, 0, 1, 1);
		path.rect(0, 3, 1, 1);
		path.rect(3, 3, 1, 1);
	}));
	/**@param {{
		 shape: string | Shape, x: number, y: number,
		size: number, color: string,
		fillAlpha?: number,
		strokeAlpha?: number,
		rotation?: number
	}} options*/
	function drawShape(options) {
		var {
			shape, x, y,
			size, color,
			fillAlpha=1,
			strokeAlpha=1,
			rotation=0
		} = options;
		var hasDependencies = (
			typeof x == "number" &&
			typeof y == "number" &&
			typeof color == "string" &&
			typeof size == "number"
		);
		if((shapes.has(shape) || shape instanceof Shape) && hasDependencies) {
			var path = shape instanceof Shape? shape: shapes.get(shape);
			var mx = x + size/2,
				my = y + size/2;
			ctx.save();
			ctx.beginPath();
			ctx.translate(mx, my);
			ctx.rotate(rotation + path.rotation);
			ctx.translate(-mx, -my);
			ctx.lineWidth = 0.1;
			ctx.fillStyle = color;
			ctx.strokeStyle = color;
			ctx.translate(x, y);
			ctx.scale(size/path.scale, size/path.scale);
			ctx.globalAlpha = fillAlpha;
			ctx.fill(path);
			ctx.globalAlpha = strokeAlpha;
			ctx.stroke(path);
			ctx.restore();
			return true;
		}else return false;
	}
}