class Background extends Shape{
    /**fill color*/
    fill = "#0000";
    /**stroke color*/
    stroke = "#0000";
    update() {}
}
/**@param {(ctx: Background) => void script*/
var createBackground = (script) => {
    var ctx = new Background;
    script(ctx);
    return ctx;
}
/**@type {Map<string, Background>}*/
var backgrounds = new Map;
/**@type {Map<string, (width: number, height: number) => Background>}*/
var bckdrpGen = new Map;
bckdrpGen.set("tutorial", (width, height) => createBackground(path => {
    var w = width/game.scale;
    var h = height/game.scale;
    path.scale = game.scale;
    for(let x = 0; x <= w; x++) {
        path.moveTo(x, 0);
        path.lineTo(x, h);
    }
    for(let y = 0; y <= h; y++) {
        path.moveTo(0, y);
        path.lineTo(w, y);
    }
    path.stroke = "#0ff5";
}));
bckdrpGen.set("catalog", (width, height) => createBackground(path => {
    var w = width/game.scale;
    var h = height/game.scale;
    path.scale = game.scale;
    for(let y = h - 1; y >= 0; y--) {
        path.moveTo(0, y);
        path.lineTo(h - y, h);
    }
    for(let x = 1; x < w; x++) {
        path.moveTo(x, 0);
        path.lineTo(x + h, h);
    }
    path.stroke = "#0f0a";
}));
bckdrpGen.set("level-1", (width, height) => createBackground(path => {
    var w = width/game.scale;
    var h = height/game.scale;
    path.scale = game.scale;
    function circle(x, y, r) {
        path.moveTo(x + r, y);
        path.arc(x, y, r, 0, PI * 2);
    }
    circle(w/2, h/2, 5);
    circle(w/6, h/4, 3);
    circle(w * 5/6, h/4, 3);
    circle(w/6, h * 3/4, 3);
    circle(w * 5/6, h * 3/4, 3);
    //right triangle
    path.moveTo(0, h/4);
    path.lineTo(w/12, h/2);
    path.lineTo(0, h * 3/4);
    //left triangle
    path.moveTo(w, h/4);
    path.lineTo(w * 11/12, h/2);
    path.lineTo(w, h * 3/4);
    //left center triangle
    path.moveTo(w/2 - 5, 0);
    path.lineTo(w/6 + 3, h/2);
    path.lineTo(w/2 - 5, h);
    path.moveTo(w/2 + 5, 0);
    path.lineTo(w * 5/6 - 3, h/2);
    path.lineTo(w/2 + 5, h);
    path.stroke = "#f00a";
}))