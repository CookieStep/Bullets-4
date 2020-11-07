var challenges = {
	run() {main(false);mainMenu.call(this, "Challenges")},
	selected: -1,
	items: [{
		text: "Score Attack",
		color: "#a5f",
		base: {
			shape: "squareBase",
			shapeFill: "square"
		},
		edge: {
			shape: "crownEdge",
			shapeFill: "crownEdgeFill"
		}
	}, {
		text: "Speedrun",
		color: "#cc0",
		base: {
			shape: "squareBase",
			shapeFill: "square"
		},
		edge: {
			shape: "trapEdge",
			shapeFill: "trapEdgeFill"
		},
		select() {
			speedrun = 1;
			challenges.stop();
			mainMenu.stop();
			levelMenu.selectedList = [];
			levelMenu.partyList = [];
			levelMenu.items2 = levelMenu.items;
			levelMenu.selected = 1;
			levelMenu.active = 1;
			levelMenu.startLevel();
			onresize();
		}
	}, {
		text: "Back",
		color: "#f55",
		base: {
			shape: "squareBase",
			shapeFill: "square"
		},
		edge: {
			shape: "circleEdge",
			shapeFill: "circleEdgeFill"
		},
		y(s) {return game.y2 - s * 1.1},
		x(width) {return game.x * 3/4 - width/2},
		select() {
			challenges.stop();
			mainMenu.active = true;
		}
	}],
	color: "#da2",
	color2: "#a53",
	setup() {this.active = true; mainMenu.active = false},
	stop() {this.active = false},
	screen() {mainMenu.screen()}
}