/**@param {string} text @param {{continued?: boolean, auto?: false}} options*/
function dialogue(text, color="white", options={}) {
	var line = {
		text, color,
		continued: options.continued,
		auto: options.auto != false,
		onFinished() {}
	}
	dialogue.lines.push(line);
	dialogue.active = true;
	return {
		/**@param {() => void} func*/
		then(func) {line.onFinished = func}
	}
}
/**@type {{text: string, color: string, continued: boolean, onFinished(): void}[]}*/
dialogue.lines = [];
dialogue.text = "";
dialogue.active = false;
dialogue.idle = 0;
dialogue.draw = () => {
	var line = dialogue.lines[0];
	if(!line) {
		dialogue.active = false;
	return}
	if(line.text.length > dialogue.text.length) {
		let txt = line.text[dialogue.text.length];
		dialogue.text = `${dialogue.text}${txt}`;
		if(!dialogue.skip.includes(txt)) SFX.get("Text").play();
	}else ++dialogue.idle;
	let s = game.scale;
	ctx.font = `${s}px Arial`;
	var parts = dialogue.text.split(" ");
	var lines = [];
	for(let part of parts) {
		let txt = lines.pop();
		if(!txt) lines.push(part);
		else{
			text = `${txt} ${part}`;
			let {width} = ctx.measureText(text);
			if(width < innerWidth) lines.push(text);
			else{
				lines.push(txt);
				lines.push(part);
			}
		}
	}
	ctx.fillStyle = line.color;
	var a = 0;
	for(let line of lines)
		ctx.fillText(line, 0, innerHeight - (lines.length - a++) * s + s/2);
}
dialogue.skip = " ,.!?";
dialogue.update = () => {
	var touch;
	touches.forEach(obj => {
		if(!obj.end && !obj.used && !touch) {
			touch = true;
			obj.used = true;
		}
	});
	if((dialogue.idle * game.tick > 1000 && dialogue.lines[0].auto) || touch || keys.get(" ") == 1) {
		if(keys.has("select")) keys.set("select", 2);
		var line = dialogue.lines.shift();
		dialogue.idle = 0;
		if(line.text.length > dialogue.text.length) {
			dialogue.text = line.text;
			dialogue.lines.unshift(line);
		}else{
			line.onFinished();
			if(!line.continued)
				dialogue.text = "";
		}
	}
}