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
    for(let y = 0; y <= w; y++) {
        path.moveTo(0, y);
        path.lineTo(w, y);
    }
    path.stroke = "#0ff5";
    path.update = () => {
        path.stroke = "#00ffff" + (abs(256 - (tick % 512))/2).toString(16);
    }
}));