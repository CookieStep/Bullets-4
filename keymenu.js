function keybindMenu() {
	var h = innerHeight/20;
	ctx.font = `${round(h)}px Sans`;
	var i = 0;
	ctx.fillStyle = "#0005";
	ctx.fillRect(0, 0, innerWidth, innerHeight);
	var touch;
	touches.forEach(obj => {
		if(!obj.end && !obj.used && !touch) touch = obj;
	});
	var spa = 1.25;
	var text = "Reset keybind";
	var width = ctx.measureText(text).width;
	var x = (innerWidth - width - h)/2;
	var y = 0;
	ctx.fillStyle = "orange";
	ctx.fillText(text, x, y + h);
	var w = width;
	if(touch && !touch.used) {
		if(touch.x > x && touch.x < x + w && touch.y > y && touch.y < y + h) {
			data.keyBind = baseData.keyBind;
			touch.used = true;
		}
	}
	for(let key in data.keyBind) {
		let value = data.keyBind[key];
		let width = ctx.measureText(`${key} ${value} `).width;
		let x = (innerWidth - width - h)/2;
		let y = h * (i + 1) * spa;
		ctx.fillStyle = i == keybindMenu.selected? "yellow": "green";
		ctx.fillText(key, x, y + h);
		let w = ctx.measureText(key).width;
		if(i == keybindMenu.selected && keybindMenu.pressed) {
			delete data.keyBind[key];
			data.keyBind[keybindMenu.pressed] = value;
			delete keybindMenu.pressed;
		}
		if(touch && !touch.used) {
			if(touch.x > x && touch.x < x + w && touch.y > y && touch.y < y + h) {
				keybindMenu.selected = i;
				touch.used = true;
			}
		}
		ctx.fillStyle = "blue";
		x += ctx.measureText(`${key} `).width;
		ctx.fillText(value, x, y + h);
		w = ctx.measureText(value).width;
		if(touch && !touch.used) {
			if(touch.x > x && touch.x < x + w && touch.y > y && touch.y < y + h) {
				data.keyBind[key] = keybindMenu.options[(keybindMenu.options.indexOf(value) + 1) % keybindMenu.options.length];
				touch.used = true;
			}
		}
		x += ctx.measureText(`${value} `).width;
		y += h * 1/4;
		let _h = h * 3/4;
		drawShape({
			x, y, size: _h,
			shape: "plus", rotation: PI/4,
			color: "red"
		});
		if(touch && !touch.used) {
			if(touch.x > x && touch.x < x + _h && touch.y > y && touch.y < y + _h) {
				delete data.keyBind[key];
				touch.used = true;
			}
		}
		++i;
	}
	var text = "Add key";
	var width = ctx.measureText(text).width;
	var x = (innerWidth - width - h)/2;
	var y = h * (i + 1) * spa;
	ctx.fillStyle = "yellow";
	ctx.fillText(text, x, y + h);
	var w = width;
	if(touch && !touch.used) {
		if(touch.x > x && touch.x < x + w && touch.y > y && touch.y < y + h) {
			data.keyBind["Key"] = "up";
			touch.used = true;
		}
	}
	if(touch && !touch.used) {
		if(keybindMenu.selected) delete keybindMenu.selected;
		else keybindMenu.active = false;
		touch.used = true;
	}
}
keybindMenu.options = ["up", "up2", "right", "right2", "left", "left2", "down", "down2", "select", "back", "enter", "secondary"];
