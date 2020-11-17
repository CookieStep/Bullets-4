class Shape extends Path2D {
	/**Radian to rotate the shape by*/
	rotation = 0;
	/**Scale factor for the shape*/
	scale = 1;
	/** Line creator 
	 * @param {array} Line positions
	*/
	lineCreator = (...args) => {
		args.forEach(arr => {
			var [func, ...args] = arr;
			switch (func) {
				case 'mt':
					this.moveTo(...args);
					break;
				case 'lt':
					this.lineTo(...args);
					break;
				case 'rct':
					this.rect(...args);
					break;
				case 'qct':
					this.quadraticCurveTo(...args);
					break;
				case 'rot':
					this.rotation = args[0];
					break;
				case 'scl':
					this.scale = args[0];
					break;
				case 'cp':
					this.closePath();
					break;
				case 'bp':
					this.beginPath();
					break;
				case 'arc':
					this.arc(...args);
					break;
				case 'art':
					this.arcTo(...args);
					break;
				case 'eps':
					this.ellipse(...args);
					break;
				case 'bct':
					this.bezierCurveTo(...args);
					break;
				case 'ap':
					this.addPath(...args);
					break;
				case 'rt':
					this.rect(...args);
					break;
				default:
					console.log('Invalid usage');
					break;
			}
		})
	}
}
{

	/**
	 * @param {(ctx: Shape) => void} script Give the shape you created
	 * @returns {Shape} The shape created
	*/
	var createShape = (script) => {
		var ctx = new Shape;
		script(ctx);
		return ctx;
	}
	/**@type {Map<string, Shape>}*/
	var shapes = new Map;
	//Bases
	shapes.set("square", createShape(path => {
		path.rect(0, 0, 1, 1);
	}));
	shapes.set("circle", createShape(path => {
		path.arc(1 / 2, 1 / 2, 1 / 2, 0, PI * 2);
	}));
	shapes.set("square2", createShape(path => {
		var r = 1 / 2;
		path.lineCreator(
			['mt', r, 0],
			['lt', 1 - r, 0],
			['qct', 1, 0, 1, r],
			['lt', 1, 1 - r],
			['qct', 1, 1, 1 - r, 1],
			['lt', r, 1],
			['qct', 0, 1, 0, 1 - r],
			['lt', 0, r],
			['qct', 0, 0, r, 0]
		)
		// path.moveTo(r, 0);
		// path.lineTo(1 - r, 0);
		// path.quadraticCurveTo(1, 0, 1, r);
		// path.lineTo(1, 1 - r);
		// path.quadraticCurveTo(1, 1, 1 - r, 1);
		// path.lineTo(r, 1);
		// path.quadraticCurveTo(0, 1, 0, 1 - r);
		// path.lineTo(0, r);
		// path.quadraticCurveTo(0, 0, r, 0);
	}));
	shapes.set("corner3", createShape(path => {
		var r = 1 / 3;
		path.lineCreator(
			['mt', 0, 0],
			['lt', 1 - r, 0],
			['qct', 1, 0, 1, r],
			['lt', 1, 1],
			['lt', 0, 1],
			['lt', 0, 0]
		);
		// path.moveTo(r, 0);
		// path.lineTo(1 - r, 0);
		// path.quadraticCurveTo(1, 0, 1, r);
		// path.lineTo(1, 1 - r);
		// path.quadraticCurveTo(1, 1, 1 - r, 1);
		// path.lineTo(r, 1);
		// path.quadraticCurveTo(0, 1, 0, 1 - r);
		// path.lineTo(0, r);
		// path.quadraticCurveTo(0, 0, r, 0);
	}));
	shapes.set("square3", createShape(path => {
		var r = 1 / 3;
		path.lineCreator(
			['mt', r, 0],
			['lt', 1 - r, 0],
			['qct', 1, 0, 1, r],
			['lt', 1, 1 - r],
			['qct', 1, 1, 1 - r, 1],
			['lt', r, 1],
			['qct', 0, 1, 0, 1 - r],
			['lt', 0, r],
			['qct', 0, 0, r, 0]
		)
		//path.moveTo(r, 0);
		//path.lineTo(1 - r, 0);
		//path.quadraticCurveTo(1, 0, 1, 0 + r);
		//path.lineTo(1, 1 - r);
		//path.quadraticCurveTo(1, 1, 1 - r, 1);
		//path.lineTo(r, 1);
		//path.quadraticCurveTo(0, 1, 0, 1 - r);
		//path.lineTo(0, r);
		//path.quadraticCurveTo(0, 0, r, 0);
	}));
	shapes.set("square4", createShape(path => {
		var r = 1 / 4;
		path.lineCreator(
			['mt', r, 0],
			['lt', 1 - r, 0],
			['qct', 1, 0, 1, r],
			['lt', 1, 1 - r],
			['qct', 1, 1, 1 - r, 1],
			['lt', r, 1],
			['qct', 0, 1, 0, 1 - r],
			['lt', 0, r],
			['qct', 0, 0, r, 0]
		)
		// path.moveTo(r, 0);
		// path.lineTo(1 - r, 0);
		// path.quadraticCurveTo(1, 0, 1, 0 + r);
		// path.lineTo(1, 1 - r);
		// path.quadraticCurveTo(1, 1, 1 - r, 1);
		// path.lineTo(r, 1);
		// path.quadraticCurveTo(0, 1, 0, 1 - r);
		// path.lineTo(0, r);
		// path.quadraticCurveTo(0, 0, r, 0);
	}));
	shapes.set("bullet", createShape(path => {
		var r = 1 / 3;
		path.lineCreator(
			['rot', PI / 2],
			['mt', 0, 1],
			['qct', 0, 0, r, 0],
			['lt', 1 - r, 0],
			['qct', 1, 0, 1, 1],
			['cp']
		)
		//path.rotation = PI / 2;
		//path.moveTo(0, 1);
		//path.quadraticCurveTo(0, 0, r, 0);
		//path.lineTo(1 - r, 0);
		//path.quadraticCurveTo(1, 0, 1, 1);
		//path.closePath();
	}));
	shapes.set("4star", createShape(path => {
		path.lineCreator(
			['scl', 8],
			['mt', 0, 0],
			['lt', 0, 0],
			['lt', 4, 1],
			['lt', 8, 0],
			['lt', 7, 4],
			['lt', 8, 8],
			['lt', 4, 7],
			['lt', 0, 8],
			['lt', 1, 4],
			['cp']
		)
		//path.scale = 8;
		//path.moveTo(0, 0);
		//path.lineTo(4, 1);
		//path.lineTo(8, 0);
		//path.lineTo(7, 4);
		//path.lineTo(8, 8);
		//path.lineTo(4, 7);
		//path.lineTo(0, 8);
		//path.lineTo(1, 4);
		//path.closePath();
	}));
	//Bases
	//Icons
	shapes.set("tophat", createShape(path => {
		path.lineCreator(
			["rct", -0.2, -0.2, 1.4, 0.2],
			["rct", 0, -0.8, 1, 0.6]
		)
		// path.rect(-0.2, -0.2, 1.4, 0.2);
		// path.rect(0, -0.8, 1, 0.6);
	}));
	shapes.set("arrow", createShape(path => {
		path.lineCreator(
			['mt', 1 / 2, 1 / 8],
			['lt', 3 / 4, 2 / 5],
			['lt', 3 / 5, 2 / 5],
			['lt', 3 / 5, 4 / 5],
			['lt', 2 / 5, 4 / 5],
			['lt', 2 / 5, 2 / 5],
			['lt', 1 / 4, 2 / 5],
			['cp'],
			['rot', PI / 2]
		)
		// path.moveTo(1 / 2, 1 / 8);
		// path.lineTo(3 / 4, 2 / 5);
		// path.lineTo(3 / 5, 2 / 5);
		// path.lineTo(3 / 5, 4 / 5);
		// path.lineTo(2 / 5, 4 / 5);
		// path.lineTo(2 / 5, 2 / 5);
		// path.lineTo(1 / 4, 2 / 5);
		// path.closePath();
		// path.rotation = PI / 2;
	}));
	shapes.set("arrowloop", createShape(path => {
		var a = 7/32;
		var b = 13/32;
		//
		var c = 1 - b;
		var d = 1 - a;
		//
		var f = 1/4;
		var g = 3/4;
		//
		var n = (b - a)/2;
		//
		path.moveTo(f, a);
		path.quadraticCurveTo(d, a, d, g);
		path.lineTo(d + n/2, g);
		path.lineTo(d - n, g + n * 7/4);
		path.lineTo(c - n/2, g);
		path.lineTo(c, g);
		path.quadraticCurveTo(c, b, f, b);
		path.lineTo(f, b + n/2);
		path.lineTo(f - n * 7/4, b - n);
		path.lineTo(f, a - n/2);
		path.closePath();
		path.rotation = PI * 3/2;
	}));
	shapes.set("arrow2", createShape(path => {
		//Top Triangle
		path.moveTo(1 / 2, 1 / 8);
		path.lineTo(3 / 4, 2 / 5);
		path.lineTo(1 / 4, 2 / 5);
		path.closePath();
		//Bottom Triangle
		path.moveTo(1 / 2, 4 / 8);
		path.lineTo(3 / 4, 4 / 5);
		path.lineTo(1 / 4, 4 / 5);
		path.closePath();
		path.rotation = PI / 2;
	}));
	shapes.set("arrow3", createShape(path => {
		//Top Triangle
		path.moveTo(1 / 2, 1 / 8);
		path.lineTo(3 / 4, 2 / 5);
		path.lineTo(1 / 4, 2 / 5);
		path.closePath();
		//Bottom Box
		path.rect(1 / 4, 7 / 10, 1 / 2, 1 / 10);
		path.rotation = PI / 2;
	}));
	shapes.set("4square", createShape(path => {
		path.scale = 4;
		path.rect(0, 0, 1, 1);
		path.rect(3, 0, 1, 1);
		path.rect(0, 3, 1, 1);
		path.rect(3, 3, 1, 1);
	}));
	shapes.set("plus", createShape(path => {
		path.scale = 2;
		path.moveTo(1, 0);
		path.lineTo(1, 2);
		path.moveTo(0, 1);
		path.lineTo(2, 1);
	}));
	//Icons
	//MenuBoxes
	shapes.set("squareBase", createShape(path => {
		path.moveTo(0, 0);
		path.lineTo(1, 0);
		path.moveTo(0, 1);
		path.lineTo(1, 1);
	}));
	shapes.set("circleEdge", createShape(path => {
		path.moveTo(-1 / 5, 0);
		path.arc(0, 1 / 2, 1 / 2, -PI / 2, PI / 2);
		path.lineTo(-1 / 5, 1);
		path.rotation = PI;
	}));
	shapes.set("circleEdgeFill", createShape(path => {
		path.moveTo(-1 / 5, 0);
		path.arc(0, 1 / 2, 1 / 2, -PI / 2, PI / 2);
		path.lineTo(-1 / 5, 1);
		path.closePath();
		path.rotation = PI;
	}));
	shapes.set("triEdge", createShape(path => {
		path.moveTo(-1 / 5, 0);
		path.lineTo(0, 0);
		path.lineTo(0, 1 / 4);
		path.lineTo(1 / 3, 1 / 2);
		path.lineTo(0, 3 / 4);
		path.lineTo(0, 1);
		path.lineTo(-1 / 5, 1);
		path.rotation = PI;
	}));
	shapes.set("triEdgeFill", createShape(path => {
		path.moveTo(-1 / 5, 0);
		path.lineTo(0, 0);
		path.lineTo(0, 1 / 4);
		path.lineTo(1 / 3, 1 / 2);
		path.lineTo(0, 3 / 4);
		path.lineTo(0, 1);
		path.lineTo(-1 / 5, 1);
		path.closePath();
		path.rotation = PI;
	}));
	shapes.set("trapEdge", createShape(path => {
		path.moveTo(-1 / 5, 0);
		path.lineTo(0, 0);
		path.lineTo(1 / 3, 1 / 3);
		path.lineTo(1 / 3, 2 / 3);
		path.lineTo(0, 1);
		path.lineTo(-1 / 5, 1);
		path.rotation = PI;
	}));
	shapes.set("trapEdgeFill", createShape(path => {
		path.moveTo(-1 / 5, 0);
		path.lineTo(0, 0);
		path.lineTo(1 / 3, 1 / 3);
		path.lineTo(1 / 3, 2 / 3);
		path.lineTo(0, 1);
		path.lineTo(-1 / 5, 1);
		path.closePath();
		path.rotation = PI;
	}));
	shapes.set("crownEdge", createShape(path => {
		path.moveTo(-1 / 5, 0);
		path.lineTo(1/3, 0);
		path.lineTo(0, 1/4)
		path.lineTo(1/3, 1/2);
		path.lineTo(0, 3/4);
		path.lineTo(1/3, 1);
		path.lineTo(-1 / 5, 1);
		path.rotation = PI;
	}));
	shapes.set("crownEdgeFill", createShape(path => {
		path.moveTo(-1 / 5, 0);
		path.lineTo(1/3, 0);
		path.lineTo(0, 1/4)
		path.lineTo(1/3, 1/2);
		path.lineTo(0, 3/4);
		path.lineTo(1/3, 1);
		path.lineTo(-1 / 5, 1);
		path.closePath();
		path.rotation = PI;
	}));
	//MenuBoxes
	/**@param {{
		 shape: string | Shape, x: number, y: number,
		size: number, color: string, sizeY?: number,
		fillAlpha?: number,
		strokeAlpha?: number,
		rotation?: number,
		undoStrokeScale?: number
	}} options*/
	function drawShape(options) {
		var {
			shape, x, y,
			size, color,
			sizeY = size,
			fillAlpha = 1,
			strokeAlpha = 1,
			rotation = 0,
			undoStrokeScale = 1
		} = options;
		var hasDependencies = (
			typeof x == "number" &&
			typeof y == "number" &&
			typeof color == "string" &&
			typeof size == "number" &&
			typeof sizeY == "number"
		);
		if ((shapes.has(shape) || shape instanceof Shape) && hasDependencies) {
			var path = shape instanceof Shape ? shape : shapes.get(shape);
			var mx = x + size / 2,
				my = y + sizeY / 2;
			ctx.save();
			ctx.beginPath();
			ctx.translate(mx, my);
			ctx.rotate(rotation + path.rotation);
			ctx.translate(-mx, -my);
			ctx.lineWidth = 0.1;
			if (undoStrokeScale) ctx.lineWidth /= undoStrokeScale;
			ctx.fillStyle = color;
			ctx.strokeStyle = color;
			ctx.translate(x, y);
			ctx.scale(size / path.scale, sizeY / path.scale);
			ctx.globalAlpha = fillAlpha;
			ctx.fill(path);
			ctx.globalAlpha = strokeAlpha;
			ctx.stroke(path);
			ctx.restore();
			return true;
		} else return false;
	}
}
function Matrix(scaleX = 1, scaleY = 1, moveX = 0, moveY = 0, skewX = 0, skewY = 0) {
	var matrix = new DOMMatrix;
	[
		matrix.a,
		matrix.d,
		matrix.e,
		matrix.f,
		matrix.b,
		matrix.c
	] = [
		scaleX,
		scaleY,
		moveX,
		moveY,
		skewX,
		skewY
	];
	return matrix;
}