/**@param {string} text @param {{continued?: boolean}} options*/
function dialogue(text, color="white", options={}) {
    var line = {
        text,
        color,
        continued: options.continued,
        onFinished() {}
    }
    dialogue.lines.push(line);
    dialogue.active = true;
    return {
        /**@param {() => void} func*/
        then(func) {
            line.onFinished = func;
        }
    }
}
/**@type {{text: string, color: string, continued: boolean, onFinished(): void}[]}*/
dialogue.lines = [];
dialogue.text = "";
dialogue.active = false;
dialogue.draw = () => {
    var line = dialogue.lines[0];
    if(!line) {
        dialogue.active = false;
    return}
    if(line.text.length > dialogue.text.length) dialogue.text = `${dialogue.text}${line.text[dialogue.text.length]}`;
    let s = game.scale;
    ctx.font = `${s}px Arial`;
    ctx.fillStyle = line.color;
    ctx.fillText(dialogue.text, 0, innerHeight - s/5);
}
dialogue.update = () => {
	var touch;
	touches.forEach(obj => {
		if(!obj.end && !obj.used) {
			touch = true;
			obj.used = true;
		}
	});
    if(touch || keys.get(" ") == 1) {
        keys.set(" ", 2);
        var line = dialogue.lines.shift();
        if(line.text.length > dialogue.text.length) {
            dialogue.text = line.text;
            dialogue.lines.unshift(line);
        }else{
            line.onFinished();
            if(!line.continued) dialogue.text = "";
        }
    }
}