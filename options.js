var options = {
    run() {
        mainMenu.call(this, "Options");
    },
    selected: -1,
    items: [{
        text: " Touch style ",
        color: "#a5f",
        base: {
            shape: "squareBase",
            shapeFill: "square"
        },
        edge: {
            shape: "triEdge",
            shapeFill: "triEdgeFill"
        }
    }, {
        text: "Key bindings",
        color: "#5a3",
        base: {
            shape: "squareBase",
            shapeFill: "square"
        },
        edge: {
            shape: "trapEdge",
            shapeFill: "trapEdgeFill"
        },
        select() {
            keybindMenu.active = true;
        }
    }, {
        text: "Back",
        color: "#da2",
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
            options.stop();
            mainMenu.setup();
        }
    }],
    color: "#2ad",
    color2: "#5a3",
    setup() {
        this.active = true;
        onresize();
        Music.get("Options").play();
    },
    screen() {
        game.x = game.x2;
    },
    stop() {
        this.active = false;
        Music.get("Options").stop();
    }
}