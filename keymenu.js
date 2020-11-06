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
	ctx.fillStyle = "#d52";
	ctx.fillText(text, x, y + h);
	var w = width;
	if(touch && !touch.used) {
		if(touch.x > x && touch.x < x + w && touch.y > y && touch.y < y + h) {
			data.keyBind = keyBind();
			touch.used = true;
			console.log("set");
		}
	}
	let keys = Object.keys(data.keyBind);
	keys.sort();
	for(let key of keys) {
		let value = data.keyBind[key];
		let keyName = keybindMenu.key(key);
		let valueName = keybindMenu.value[value];
		let width = ctx.measureText(`${keyName} ${valueName} `).width;
		let x = (innerWidth - width - h)/2;
		let y = h * (i + 1) * spa;
		ctx.fillStyle = key == keybindMenu.selected? "#da5": "#2ad";
		let w = ctx.measureText(keyName).width;
		x = innerWidth/2 - w - game.scale/2;
		ctx.fillText(keyName, x, y + h);
		if(key == keybindMenu.selected && keybindMenu.pressed) {
			if(!data.keyBind[keybindMenu.pressed]) {
				delete data.keyBind[key];
				data.keyBind[keybindMenu.pressed] = value;
				keybindMenu.selected = keybindMenu.pressed;
			}
			delete keybindMenu.pressed;
		}
		if(touch && !touch.used) {
			if(touch.x > x && touch.x < x + w && touch.y > y && touch.y < y + h) {
				keybindMenu.selected = key;
				touch.used = true;
			}
		}
		ctx.fillStyle = "#5a3";
		x = innerWidth/2 + game.scale/2;
		ctx.fillText(valueName, x, y + h);
		w = ctx.measureText(valueName).width;
		if(touch && !touch.used) {
			if(touch.x > x && touch.x < x + w && touch.y > y && touch.y < y + h) {
				data.keyBind[key] = keybindMenu.options[(keybindMenu.options.indexOf(value) + 1) % keybindMenu.options.length];
				touch.used = true;
			}
		}
		x += ctx.measureText(`${valueName} `).width;
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
			data.keyBind["Unassigned"] = undefined;
			touch.used = true;
		}
	}
	if(touch && !touch.used) {
		if("selected" in keybindMenu) delete keybindMenu.selected;
		else keybindMenu.active = false;
		touch.used = true;
	}
}
keybindMenu.options = ["up", "up2", "right", "right2", "left", "left2", "down", "down2", "select", "back", "enter", "secondary"];
/**@param {string} key*/
keybindMenu.key = function(key) {
	if(key.startsWith("Key")) return `${key.slice(3)} Key`;
	if(key.startsWith("Digit")) return `${Nth(key.slice(5))} Digit`;
	if(key.startsWith("Numpad")) return `Numpad ${key.slice(6)}`;
	if(key.startsWith("Arrow")) return `${key.slice(5)} Arrow`;
	if(key.startsWith("Shift")) return `${key.slice(5)} Shift`;
	if(key.startsWith("Bracket")) return `${key.slice(7)} Bracket`;
	if(key == "Space") return "Spacebar";
	return `${key} key`;
};
keybindMenu.value = {
	up: "Move up",
	up2: "Skill up",
	down: "Move down",
	down2: "Skill down",
	left: "Move left",
	left2: "Skill left",
	right: "Move right",
	right2: "Skill right",
	secondary: "Skill",
	select: "Select",
	back: "Back",
	enter: "Enter",
	[undefined]: "Nothing"
}
keybindMenu.get = function(value) {
	for(let key in data.keyBind) {
		let val = data.keyBind[key];
		if(val == value) return this.key(key);
	}
	return this.value[value];
}
function Nth(num) {
	var txt = `${num}`;
	var last = txt[txt.length - 1];
	if(last == "1") return `${txt}st`;
	if(last == "2") return `${txt}nd`;
	if(last == "3") return `${txt}rd`;
	return `${txt}th`
}