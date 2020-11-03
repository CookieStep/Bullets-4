function _defineProperty3(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _defineProperty2(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

Set.prototype.toArray = function () {
  var ill = this.values();
  var arr = [];

  do {
    var {
      value,
      done
    } = ill.next();
    if (!done) arr.push(value);
  } while (!done);

  return arr;
};

var data;

function loadData() {
  data = baseData;

  if (localStorage.saveData) {
    assign(data, JSON.parse(localStorage.saveData));
  } else {
    localStorage.saveData = "{}";
  }

  dataParser.forEach((value, key) => value(data[key]));
}

function saveData() {
  data._catalog = data.catalog.toArray();
  dataStringfy.forEach((value, key) => value(data[key]));
  localStorage.saveData = JSON.stringify(data);
}

var baseData = {
  catalog: new Set(),
  firstRun: true,
  touchStyle: 2,
  level: 1,
  keyBind: {
    Backspace: "back",
    KeyS: "down",
    ArrowDown: "down2",
    Enter: "enter",
    KeyA: "left",
    ArrowLeft: "left2",
    KeyD: "right",
    ArrowRight: "right2",
    Space: "select",
    KeyW: "up",
    ArrowUp: "up2"
  }
};
/**@type {Map<string, (value) => void>}*/

var dataParser = new Map();
/**@type {Map<string, (value) => void>}*/

var dataStringfy = new Map();
dataParser.set("_catalog", value => {
  if (value) data.catalog = new Set(value);else data.catalog = new Set();
});
dataStringfy.set("catalog", value => {
  if (value) data._catalog = value.toArray();
}); //This function doesn't typescript properly due to a type parameter
//For typescript, see collection.ts

class Collection {
  constructor(...items) {
    this.map = new Map();
    this.empty = [];
    this.push(...items);
  }

  push(...items) {
    var {
      map,
      empty
    } = this;
    var ids = [];
    items.forEach(value => {
      if (empty.length) var id = empty.pop();else id = BigInt(map.size);
      map.set(id, value);
      ids.push(id);
    });
    if (ids.length < 2) return ids[0];else return ids;
  }

  delete(...ids) {
    var {
      map,
      empty
    } = this;
    var done;
    ids.forEach(id => {
      done = map.delete(id);
      if (done) empty.push(id);
    });
    if (ids.length == 1) return done;
  }

  forEach(callbackfn) {
    var {
      map
    } = this;
    var collection = this;
    map.forEach((value, key) => {
      callbackfn(value, key, collection);
    });
  }

  filter(callbackfn) {
    var {
      map
    } = this;
    var nCol = new Collection();
    var collection = this;
    map.forEach((value, key) => {
      if (callbackfn(value, key, collection)) nCol.set(key, value);
    });
    nCol.scan();
    return nCol;
  }

  remove(callbackfn) {
    var {
      map
    } = this;
    var collection = this;
    var removed = [];
    map.forEach((value, key) => {
      if (callbackfn(value, key, collection)) removed.push(collection.delete(key));
    });
    if (removed.length < 2) return removed[0];else return removed;
  }

  asArray() {
    var array = [];
    this.map.forEach(value => array.push(value));
    return array;
  }

  scan() {
    var max = 0n;
    var empty = [];
    this.map.forEach((value, key) => {
      if (key > max) max = key;
    });

    for (let i = 0n; i <= max; i++) if (!this.map.has(i)) empty.push(i);

    this.empty = empty;
    return empty;
  }

  clear() {
    this.empty = [];
    this.map.clear();
  }

  get(id) {
    return this.map.get(id);
  }

  has(id) {
    return this.map.has(id);
  }

  set(id, value) {
    this.map.set(id, value);
    return this;
  }

  get size() {
    return this.map.size;
  }

}

var canvas = document.createElement("canvas"),
    pen = canvas.getContext("2d", {
  alpha: false
}),
    background = document.createElement("canvas"),
    bctx = background.getContext("2d"),
    foreground = document.createElement("canvas"),
    ctx = foreground.getContext("2d");
var {
  cos,
  sin,
  PI,
  atan2,
  ceil,
  floor,
  round,
  sqrt,
  pow,
  abs,
  max,
  min
} = Math,
    {
  assign
} = Object;
/**@param {number} max @param {number} min*/

var random = (max = 1, min = 0) => Math.random() * (max - min) + min;

var flip = (num = 1) => round(random()) * num;
/**
 * @param {number | {x: number, y: number}} x Either and {x, y} or a number
 * @param {number} y The y value, if not inside x
*/


var radian = (x, y = undefined) => typeof x == "number" ? atan2(y, x) : atan2(x.y, x.x);

var point = (radian, distance = 1) => ({
  x: cos(radian) * distance,
  y: sin(radian) * distance
});

var constrain = (value, max = 1, min = 0) => round((value - min) / (max - min)) * (max - min) + min;
/**@type {Player}*/


var player;
/**@type {Collection<Bullets>}*/

var bullets = new Collection();
/**@type {Collection<Enemy>}*/

var enemies = new Collection();
/**@type {Collection<Enemy>}*/

var enemies2 = new Collection();
/**@type {Collection<Exp>}*/

var exp = new Collection();
/**@type {Collection<Particle>}*/

var particles = new Collection();
/**@type {Collection<Npc>}*/

var npcs = new Collection();
var hardcore; //921600 => 40

var game = {
  scale: 40,
  level: 0,
  fps: 40,
  lives: 0,

  reset() {
    this.lives = 3;
    this.event = {};
  },

  x: 0,
  y: 0,
  event: {},
  x2: innerWidth,
  y2: innerHeight,

  get m() {
    return min(this.x, this.y);
  },

  get m2() {
    return min(this.x2, this.y2);
  },

  get tick() {
    return 1000 / this.fps;
  }

};
var tick = 0;
/**@type {string}*/

var backgroundName = "tutorial",
    backgroundColor = "#000";
/**@param {string} text @param {{continued?: boolean, auto?: false}} options*/

function dialogue(text, color = "white", options = {}) {
  var line = {
    text,
    color,
    continued: options.continued,
    auto: options.auto != false,

    onFinished() {}

  };
  dialogue.lines.push(line);
  dialogue.active = true;
  return {
    /**@param {() => void} func*/
    then(func) {
      line.onFinished = func;
    }

  };
}
/**@type {{text: string, color: string, continued: boolean, onFinished(): void}[]}*/


dialogue.lines = [];
dialogue.text = "";
dialogue.active = false;
dialogue.idle = 0;

dialogue.draw = () => {
  var line = dialogue.lines[0];

  if (!line) {
    dialogue.active = false;
    return;
  }

  if (line.text.length > dialogue.text.length) {
    let txt = line.text[dialogue.text.length];
    dialogue.text = `${dialogue.text}${txt}`;
    if (!dialogue.skip.includes(txt)) SFX.get("Text").play();
  } else ++dialogue.idle;

  let s = game.scale;
  ctx.font = `${s}px Arial`;
  var parts = dialogue.text.split(" ");
  var lines = [];

  for (let part of parts) {
    let txt = lines.pop();
    if (!txt) lines.push(part);else {
      text = `${txt} ${part}`;
      let {
        width
      } = ctx.measureText(text);
      if (width < innerWidth) lines.push(text);else {
        lines.push(txt);
        lines.push(part);
      }
    }
  }

  ctx.fillStyle = line.color;
  var a = 0;

  for (let line of lines) ctx.fillText(line, 0, innerHeight - (lines.length - a++) * s + s / 2);
};

dialogue.skip = " ,.!?";

dialogue.update = () => {
  var touch;
  touches.forEach(obj => {
    if (!obj.end && !obj.used && !touch) {
      touch = true;
      obj.used = true;
    }
  });

  if (dialogue.idle * game.tick > 1000 && dialogue.lines[0].auto || touch || keys.get("select") == 1) {
    if (keys.has("select")) keys.set("select", 2);
    var line = dialogue.lines.shift();
    dialogue.idle = 0;

    if (line.text.length > dialogue.text.length) {
      dialogue.text = line.text;
      dialogue.lines.unshift(line);
    } else {
      line.onFinished();
      if (!line.continued) dialogue.text = "";
    }
  }
};

function mainMenu() {
  main(false);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, game.x, game.y2);
  ctx.lineWidth = 5;
  ctx.strokeStyle = "white";
  ctx.moveTo(game.x, 0);
  ctx.lineTo(game.x, game.y2);
  ctx.stroke();

  var any = (...list) => {
    var any = false;
    list.forEach(v => {
      if (!any && (keys.get(v) == 1 || keys.get(v) == 3)) any = true;
    });
    return any;
  };

  if (any("down", "down2", "right", "right2")) mainMenu.selected++;
  if (any("up", "up2", "left", "left2")) mainMenu.selected--;
  ["up", "up2", "left", "left2", "right", "right2", "down", "down2"].forEach(key => {
    if (keys.has(key)) keys.set(key, 2);
  });
  mainMenu.selected = (mainMenu.selected + mainMenu.items.length + 1) % (mainMenu.items.length + 1);
  var {
    selected
  } = mainMenu;
  var h = innerHeight / 6;
  ctx.font = `${round(h)}px Sans`;
  ctx.fillStyle = "white";
  var text = "Bullets 4";
  var {
    width
  } = ctx.measureText(text);
  var x = (game.x - width) / 2;
  var color = ctx.createLinearGradient(x, 0, x + width, 0);
  color.addColorStop(0, "white");
  color.addColorStop(1, "red");
  ctx.fillStyle = color;
  ctx.fillText(text, x, h);
  let i = 0;
  h *= 1 / 2;
  ctx.font = `${h}px Sans`;
  var spa = 2.25;
  var touch;
  touches.forEach(obj => {
    if (!obj.end && !obj.used && !touch) touch = obj;
  });

  for (let part of mainMenu.items) {
    let {
      text,
      base,
      color,
      edge
    } = part;
    let outline = selected == i ? "white" : color;
    ctx.fillStyle = "white";
    let width = ctx.measureText(text).width;
    let x = (game.x - width) / 2;
    let y = h * i * spa;
    y += h * 3.5;
    h *= 4 / 3;
    drawShape({
      shape: base.shapeFill,
      x,
      y,
      size: width,
      sizeY: h,
      strokeAlpha: 0,
      color
    });
    drawShape({
      shape: edge.shapeFill,
      x: x - h,
      y,
      size: h,
      strokeAlpha: 0,
      color
    });
    drawShape({
      shape: edge.shapeFill,
      x: x + width,
      y,
      size: h,
      strokeAlpha: 0,
      color,
      rotation: PI
    });
    drawShape({
      shape: base.shape,
      x,
      y,
      size: width,
      sizeY: h,
      fillAlpha: 0,
      color: outline
    });
    drawShape({
      shape: edge.shape,
      x: x - h,
      y,
      size: h,
      fillAlpha: 0,
      color: outline
    });
    drawShape({
      shape: edge.shape,
      x: x + width,
      y,
      size: h,
      fillAlpha: 0,
      color: outline,
      rotation: PI
    });
    ctx.fillText(text, x, y + h * 3 / 4);

    if (touch && !touch.used) {
      if (touch.x > x - h && touch.x < x + width + h && touch.y > y && touch.y < y + h) {
        selected = i;
        touch.used = true;
      }
    }

    h *= 3 / 4;
    i++;
  }

  if (touch && touch.used || keys.get("select") == 1) {
    keys.set("select", 2);
    if (touch) touch.used = true;
    if (selected in mainMenu.items && mainMenu.items[selected].select) mainMenu.items[selected].select();
  }
}

mainMenu.selected = -1;
mainMenu.items = [{
  text: "Story mode",
  color: "#fa5",
  base: {
    shape: "squareBase",
    shapeFill: "square"
  },
  edge: {
    shape: "trapEdge",
    shapeFill: "trapEdgeFill"
  },

  select() {
    mainMenu.stop();
    levelMenu.setup();
  }

}, {
  text: " Challenges ",
  color: "#f55",
  base: {
    shape: "squareBase",
    shapeFill: "square"
  },
  edge: {
    shape: "triEdge",
    shapeFill: "triEdgeFill"
  }
}, {
  text: "Catalog",
  color: "#ad2",
  base: {
    shape: "squareBase",
    shapeFill: "square"
  },
  edge: {
    shape: "circleEdge",
    shapeFill: "circleEdgeFill"
  },

  select() {
    mainMenu.stop();
    catalog.setup();
  }

}];

mainMenu.setup = function () {
  player = undefined;
  game.level = -1;
  enemies.clear();
  this.active = true;
  onresize();

  while (enemies.size < 20) Enemy.summonBulk(...catalog.getList());

  Music.get("MainMenu").play();
  backgroundName = undefined;
  backgroundColor = "#000";
};

mainMenu.stop = function () {
  this.active = false;
  enemies.clear();
  Music.get("MainMenu").stop();
};

mainMenu.screen = function () {
  game.x = innerWidth / 2;
};

class Shape extends Path2D {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "rotation", 0);

    _defineProperty(this, "scale", 1);
  }

}

{
  /**@param {(ctx: Shape) => void script*/
  var createShape = script => {
    var ctx = new Shape();
    script(ctx);
    return ctx;
  };
  /**@type {Map<string, Shape>}*/


  var shapes = new Map(); //Bases {}

  shapes.set("square", createShape(path => {
    path.rect(0, 0, 1, 1);
  }));
  shapes.set("circle", createShape(path => {
    path.arc(1 / 2, 1 / 2, 1 / 2, 0, PI * 2);
  }));
  shapes.set("square2", createShape(path => {
    var r = 1 / 2;
    path.moveTo(r, 0);
    path.lineTo(1 - r, 0);
    path.quadraticCurveTo(1, 0, 1, 0 + r);
    path.lineTo(1, 1 - r);
    path.quadraticCurveTo(1, 1, 1 - r, 1);
    path.lineTo(r, 1);
    path.quadraticCurveTo(0, 1, 0, 1 - r);
    path.lineTo(0, r);
    path.quadraticCurveTo(0, 0, r, 0);
  }));
  shapes.set("square3", createShape(path => {
    var r = 1 / 3;
    path.moveTo(r, 0);
    path.lineTo(1 - r, 0);
    path.quadraticCurveTo(1, 0, 1, 0 + r);
    path.lineTo(1, 1 - r);
    path.quadraticCurveTo(1, 1, 1 - r, 1);
    path.lineTo(r, 1);
    path.quadraticCurveTo(0, 1, 0, 1 - r);
    path.lineTo(0, r);
    path.quadraticCurveTo(0, 0, r, 0);
  }));
  shapes.set("square4", createShape(path => {
    var r = 1 / 4;
    path.moveTo(r, 0);
    path.lineTo(1 - r, 0);
    path.quadraticCurveTo(1, 0, 1, 0 + r);
    path.lineTo(1, 1 - r);
    path.quadraticCurveTo(1, 1, 1 - r, 1);
    path.lineTo(r, 1);
    path.quadraticCurveTo(0, 1, 0, 1 - r);
    path.lineTo(0, r);
    path.quadraticCurveTo(0, 0, r, 0);
  }));
  shapes.set("bullet", createShape(path => {
    var r = 1 / 3;
    path.rotation = PI / 2;
    path.moveTo(0, 1);
    path.quadraticCurveTo(0, 0, r, 0);
    path.lineTo(1 - r, 0);
    path.quadraticCurveTo(1, 0, 1, 1);
    path.closePath();
  }));
  shapes.set("4star", createShape(path => {
    path.scale = 8;
    path.moveTo(0, 0);
    path.lineTo(4, 1);
    path.lineTo(8, 0);
    path.lineTo(7, 4);
    path.lineTo(8, 8);
    path.lineTo(4, 7);
    path.lineTo(0, 8);
    path.lineTo(1, 4);
    path.closePath();
  })); //Bases
  //Icons

  shapes.set("tophat", createShape(path => {
    path.rect(-0.2, -0.2, 1.4, 0.2);
    path.rect(0, -0.8, 1, 0.6);
  }));
  shapes.set("arrow", createShape(path => {
    path.moveTo(1 / 2, 1 / 8);
    path.lineTo(3 / 4, 2 / 5);
    path.lineTo(3 / 5, 2 / 5);
    path.lineTo(3 / 5, 4 / 5);
    path.lineTo(2 / 5, 4 / 5);
    path.lineTo(2 / 5, 2 / 5);
    path.lineTo(1 / 4, 2 / 5);
    path.closePath();
    path.rotation = PI / 2;
  }));
  shapes.set("arrow2", createShape(path => {
    //Top Triangle
    path.moveTo(1 / 2, 1 / 8);
    path.lineTo(3 / 4, 2 / 5);
    path.lineTo(1 / 4, 2 / 5);
    path.closePath(); //Bottom Triangle

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
    path.closePath(); //Bottom Box

    path.rect(1 / 4, 7 / 10, 1 / 2, 1 / 10);
    path.rotation = PI / 2;
  }));
  shapes.set("4square", createShape(path => {
    path.scale = 4;
    path.rect(0, 0, 1, 1);
    path.rect(3, 0, 1, 1);
    path.rect(0, 3, 1, 1);
    path.rect(3, 3, 1, 1);
  })); //Icons
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
  })); //MenuBoxes

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
      shape,
      x,
      y,
      size,
      color,
      sizeY = size,
      fillAlpha = 1,
      strokeAlpha = 1,
      rotation = 0,
      undoStrokeScale = 1
    } = options;
    var hasDependencies = typeof x == "number" && typeof y == "number" && typeof color == "string" && typeof size == "number" && typeof sizeY == "number";

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
  var matrix = new DOMMatrix();
  [matrix.a, matrix.d, matrix.e, matrix.f, matrix.b, matrix.c] = [scaleX, scaleY, moveX, moveY, skewX, skewY];
  return matrix;
}

class Background extends Shape {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "fill", "#0000");

    _defineProperty(this, "stroke", "#0000");
  }

  update() {}

}
/**@param {(ctx: Background) => void script*/


var createBackground = script => {
  var ctx = new Background();
  script(ctx);
  return ctx;
};
/**@type {Map<string, Background>}*/


var backgrounds = new Map();
/**@type {Map<string, (width: number, height: number) => Background>}*/

var bckdrpGen = new Map();
bckdrpGen.set("tutorial", (width, height) => createBackground(path => {
  var w = width / game.scale;
  var h = height / game.scale;
  path.scale = game.scale;

  for (let x = 0; x <= w; x++) {
    path.moveTo(x, 0);
    path.lineTo(x, h);
  }

  for (let y = 0; y <= h; y++) {
    path.moveTo(0, y);
    path.lineTo(w, y);
  }

  path.stroke = "#0ff5";
}));
bckdrpGen.set("catalog", (width, height) => createBackground(path => {
  var w = width / game.scale;
  var h = height / game.scale;
  path.scale = game.scale;

  for (let y = h - 1; y >= 0; y--) {
    path.moveTo(0, y);
    path.lineTo(h - y, h);
  }

  for (let x = 1; x < w; x++) {
    path.moveTo(x, 0);
    path.lineTo(x + h, h);
  }

  path.stroke = "#0f0a";
}));
bckdrpGen.set("level-1", (width, height) => createBackground(path => {
  var w = width / game.scale;
  var h = height / game.scale;
  path.scale = game.scale;

  function circle(x, y, r) {
    path.moveTo(x + r, y);
    path.arc(x, y, r, 0, PI * 2);
  }

  circle(w / 2, h / 2, 5);
  circle(w / 6, h / 4, 3);
  circle(w * 5 / 6, h / 4, 3);
  circle(w / 6, h * 3 / 4, 3);
  circle(w * 5 / 6, h * 3 / 4, 3); //right triangle

  path.moveTo(0, h / 4);
  path.lineTo(w / 12, h / 2);
  path.lineTo(0, h * 3 / 4); //left triangle

  path.moveTo(w, h / 4);
  path.lineTo(w * 11 / 12, h / 2);
  path.lineTo(w, h * 3 / 4); //left center triangle

  path.moveTo(w / 2 - 5, 0);
  path.lineTo(w / 6 + 3, h / 2);
  path.lineTo(w / 2 - 5, h);
  path.moveTo(w / 2 + 5, 0);
  path.lineTo(w * 5 / 6 - 3, h / 2);
  path.lineTo(w / 2 + 5, h);
  path.stroke = "#f00a";
}));

class Sound {
  /**@param {{volume: number}} options
   * @param {{src: "../SFX/", type: ("audio/ogg" | "audio/wav" | "audio/mp3")}[]} sources*/
  constructor(options, ...sources) {
    this.options = options;
    sources.concat(sources);
    sources.concat(sources);
    sources.sort(() => random(2) - 1);
    this.sources = sources;
    let elements = [];
    let {
      volume = 1
    } = options;

    for (let source of sources) {
      let element = document.createElement("audio");
      element.volume = volume;
      let child = document.createElement("source");
      Object.assign(child, source);
      element.appendChild(child);
      elements.push(element);
    }

    this.elements = elements;
  }

  get element() {
    return this.elements[floor(random(this.elements.length))];
  }

  play() {
    let {
      element
    } = this;
    element.currentTime = 0;
    element.play();
  }

}

class Bgm {
  /**@param {{volume: number}} options
   * @param {{src: "../Music/...", type: ("audio/ogg" | "audio/wav" | "audio/mp3")}[]} sources*/
  constructor(options, ...sources) {
    this.options = options;
    this.sources = sources;
    sources.sort(() => random(2) - 1);
    let {
      volume = 1
    } = options;
    let element = document.createElement("audio");
    element.volume = volume;
    element.loop = true;

    for (let source of sources) {
      let child = document.createElement("source");
      Object.assign(child, source);
      element.appendChild(child);
    }

    this.element = element;
  }

  play() {
    let {
      element
    } = this;
    if (!this.isPlaying) element.currentTime = 0;
    element.play();
    this.isPlaying = true;
  }

  pause() {
    if (this.isPlaying) this.element.pause();
  }

  resume() {
    if (this.isPlaying) this.element.play();
  }

  stop() {
    let {
      element
    } = this;
    element.pause();
    element.currentTime = 0;
    this.isPlaying = false;
  }

}
/**@type {Map<string, Bgm>}*/


var Music = new Map();
Music.set("Tutorial", new Bgm({
  volume: 1
}, {
  src: "../Music/TutorialMusic.wav",
  type: "audio/wav"
}));
Music.set("Level-1", new Bgm({
  volume: 1
}, {
  src: "../Music/Level1.wav",
  type: "audio/wav"
}));
Music.set("MainMenu", new Bgm({
  volume: 1
}, {
  src: "../Music/MainMenu.wav",
  type: "audio/wav"
}));
Music.set("Catalog", new Bgm({
  volume: 1
}, {
  src: "../Music/Catalog.wav",
  type: "audio/wav"
}));
Music.set("Boss-1", new Bgm({
  volume: 1
}, {
  src: "../Music/Boss1.wav",
  type: "audio/wav"
}));
/**@type {Map<string, Sound>}*/

var SFX = new Map();
SFX.set("Death", new Sound({
  volume: 0.5
}, {
  src: "../SFX/Death.wav",
  type: "audio/wav"
}));
SFX.set("Hit", new Sound({
  volume: 1
}, {
  src: "../SFX/Hit.wav",
  type: "audio/wav"
}, {
  src: "../SFX/Hit2.wav",
  type: "audio/wav"
}, {
  src: "../SFX/Hit3.wav",
  type: "audio/wav"
}, {
  src: "../SFX/Hit4.wav",
  type: "audio/wav"
}));
SFX.set("PowerUp", new Sound({
  volume: 1
}, {
  src: "../SFX/PowerUp.wav",
  type: "audio/wav"
}));
SFX.set("Shoot", new Sound({
  volume: 0.5
}, {
  src: "../SFX/Shoot.wav",
  type: "audio/wav"
}, {
  src: "../SFX/Shoot2.wav",
  type: "audio/wav"
}, {
  src: "../SFX/Shoot3.wav",
  type: "audio/wav"
}));
SFX.set("Spawn", new Sound({
  volume: 1
}, {
  src: "../SFX/Spawn.wav",
  type: "audio/wav"
}, {
  src: "../SFX/Spawn2.wav",
  type: "audio/wav"
}, {
  src: "../SFX/Spawn3.wav",
  type: "audio/wav"
}));
SFX.set("Text", new Sound({
  volume: 1
}, {
  src: "../SFX/Text.wav",
  type: "audio/wav"
}));
SFX.set("Wall", new Sound({
  volume: 0.25
}, {
  src: "../SFX/Wall.wav",
  type: "audio/wav"
}, {
  src: "../SFX/Wall2.wav",
  type: "audio/wav"
}, {
  src: "../SFX/Wall3.wav",
  type: "audio/wav"
}));
SFX.set("Xp", new Sound({
  volume: 0.25
}, {
  src: "../SFX/Xp.wav",
  type: "audio/wav"
}, {
  src: "../SFX/Xp2.wav",
  type: "audio/wav"
}, {
  src: "../SFX/Xp3.wav",
  type: "audio/wav"
}, {
  src: "../SFX/Xp4.wav",
  type: "audio/wav"
}, {
  src: "../SFX/Xp5.wav",
  type: "audio/wav"
}));

class Entity {
  /**@param {Entity} parent*/
  constructor(parent) {
    _defineProperty(this, "ancestor", void 0);

    _defineProperty(this, "name", "Entity");

    _defineProperty(this, "description", ["This is like,", "where you should write a description."]);

    _defineProperty(this, "velocity", {
      x: 0,
      y: 0
    });

    _defineProperty(this, "knockback", 1);

    _defineProperty(this, "knockRes", 1);

    _defineProperty(this, "friction", 0.9);

    _defineProperty(this, "x", 0);

    _defineProperty(this, "y", 0);

    _defineProperty(this, "id", -1n);

    _defineProperty(this, "wallSFX", true);

    _defineProperty(this, "color", "white");

    _defineProperty(this, "shape", "square");

    _defineProperty(this, "color2", "black");

    _defineProperty(this, "shape2", "");

    _defineProperty(this, "scale", 1);

    _defineProperty(this, "spd", 0.015);

    _defineProperty(this, "onWall", BOUNCE);

    _defineProperty(this, "hp", 1);

    _defineProperty(this, "maxHp", 1);

    _defineProperty(this, "atk", 1);

    _defineProperty(this, "deathSFX", void 0);

    this.parent = parent;
  }
  /**The class this one "evolves from" or extends*/


  get size() {
    return game.scale * this.scale;
  }
  /**@param {Entity} attacker*/


  attack(attacker) {
    this.hp -= attacker.atk;
    if (!this.alive) this.die();
  }

  die() {
    if (SFX.has(this.deathSFX)) SFX.get(this.deathSFX).play();
  }
  /**Plays when this entity dies
   * @type {string}*/


  get alive() {
    return this.hp > 0;
  }

  update(focus) {
    if (this.skill) this.skill.update();
    this.tick();
    this.forces();
    this.screenlock(focus);
  }
  /**Move to spawn*/


  pickLocation() {
    var {
      x = 0,
      y = 0,
      x2 = innerWidth,
      y2 = innerHeight
    } = game;
    this.x = random(x2 - this.size, x);
    this.y = random(y2 - this.size, y);
  }

  spawn() {
    this.pickLocation();
    return this;
  }

  static wall(num, ver, d) {
    switch (ver) {
      case BOUNCE:
        return d * abs(num);

      case NULL:
        return 0;

      default:
        return num;
    }
  }
  /**@param {boolean} focus Is this screen important? (used for audio, mainly)*/


  screenlock(focus) {
    var {
      x = 0,
      y = 0,
      x2 = innerWidth,
      y2 = innerHeight
    } = game;
    var wallX = false,
        wallY = false;
    var {
      onWall,
      velocity
    } = this;

    if (this.x < x) {
      wallX = true;
      this.x = x;
      velocity.x = Entity.wall(velocity.x, onWall, 1);
    }

    if (this.y < y) {
      wallY = true;
      this.y = y;
      velocity.y = Entity.wall(velocity.y, onWall, 1);
    }

    if (this.x + this.size > x2) {
      wallX = true;
      this.x = x2 - this.size;
      velocity.x = Entity.wall(velocity.x, onWall, -1);
    }

    if (this.y + this.size > y2) {
      wallY = true;
      this.y = y2 - this.size;
      velocity.y = Entity.wall(velocity.y, onWall, -1);
    }

    if (wallX || wallY) {
      if (this.wallSFX && focus) SFX.get("Wall").play();
      this.hitWall(wallX, wallY);
    }
  }

  tick() {}
  /**@param {boolean} x Hit the x wall? @param {boolean} y Hit the y wall?*/


  hitWall(x, y) {}

  forces() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.velocity.x *= sqrt(this.friction);
    this.velocity.y *= sqrt(this.friction);
  }

  moveTo(x, y) {
    if (typeof x == "number") {
      this.move(radian(x - this.mx, y - this.my));
      return Entity.distance(this, {
        x,
        y
      });
    } else if ("mx" in x) this.move(radian(x.mx - this.mx, x.my - this.my));else if ("x" in x) this.move(radian(x.x - this.mx, x.y - this.my));

    return Entity.distance(this, x);
  }

  prepare() {}

  draw() {
    var {
      x,
      y,
      size,
      color,
      shape,
      rotation,
      fillAlpha,
      strokeAlpha,
      undoStrokeScale,
      shape2,
      color2,
      rotation2,
      fillAlpha2,
      strokeAlpha2,
      undoStrokeScale2
    } = this;
    drawShape({
      shape,
      x,
      y,
      size,
      color,
      rotation,
      strokeAlpha,
      fillAlpha,
      undoStrokeScale
    });

    if (shape2) {
      var test = (what, type, fallback) => typeof what == type ? what : fallback;

      drawShape({
        shape: shape2,
        x,
        y,
        size,
        color: test(color2, "string", color),
        rotation: test(rotation2, "number", rotation),
        fillAlpha: test(fillAlpha2, "number", fillAlpha),
        strokeAlpha: test(strokeAlpha2, "number", strokeAlpha),
        undoStrokeScale: undoStrokeScale2
      });
    }

    if (this.skill) this.skill.draw();
  }
  /**@param {number} radian @param {Entity[]} tests*/


  move(radian, ...tests) {
    this.velocity.x += cos(radian) * this.spd * this.size;
    this.velocity.y += sin(radian) * this.spd * this.size;

    if (tests.length) {
      var a = false;
      tests.forEach(test => {
        if (Entity.isTouching(this, test)) a = true;
      });
      return a;
    }
  }
  /**Rotation of shape*/


  get rotation() {
    return 0;
  }
  /**Rotation of shape2
   * @type {number}*/


  get rotation2() {
    return undefined;
  }
  /**transparency of shape's fill*/


  get fillAlpha() {
    return this.hp / this.maxHp;
  }
  /**transparency of shape2's fill*/


  get fillAlpha2() {
    return this.fillAlpha;
  }
  /**transparency of shape's outline*/


  get strokeAlpha() {
    return 1;
  }
  /**transparency of shape2's outline*/


  get strokeAlpha2() {
    return this.fillAlpha;
  }

  get mx() {
    return this.x + this.size / 2;
  }

  get my() {
    return this.y + this.size / 2;
  }

  set mx(mx) {
    this.x = mx - this.size / 2;
  }

  set my(my) {
    this.y = my - this.size / 2;
  }
  /**Distance between a and b
   * @param {Entity} a @param {Entity} b*/


  static distance(a, b) {
    var x = a.mx == undefined ? a.x : a.mx;
    var y = a.my == undefined ? a.y : a.my;
    var x2 = b.mx == undefined ? b.x : b.mx;
    var y2 = b.my == undefined ? b.y : b.my;
    var dis = {
      x: x - x2,
      y: y - y2
    };
    return sqrt(dis.y * dis.y + dis.x * dis.x);
  }
  /**Is a touching b?
   * @param {Entity} a @param {Entity} b*/


}

_defineProperty(Entity, "isTouching", (a, b) => abs(a.mx - b.mx) < (a.size + b.size) / 2 && abs(a.my - b.my) < (a.size + b.size) / 2);

_defineProperty(Entity, "radianTo", (a, b) => radian(b.x - a.x, b.y - a.y));

_defineProperty(Entity, "collide", (a, b, focus) => {
  if (focus) SFX.get("Wall").play();
  let s = (a.size + b.size) / 2,
      x = a.mx - b.mx,
      y = a.my - b.my;
  x /= 10;
  y /= 10;

  if (x < s) {
    a.velocity.x = x * b.knockback * a.knockRes;
    b.velocity.x = -x * a.knockback * b.knockRes;
  }

  if (y < s) {
    a.velocity.y = y * b.knockback * a.knockRes;
    b.velocity.y = -y * a.knockback * b.knockRes;
  }
});

const BOUNCE = Symbol("Bounce"),
      NULL = Symbol("Null"),
      NOTHING = Symbol("Nothing");

class Exp extends Entity {
  constructor(parent, rad) {
    super(parent);

    _defineProperty(this, "r", random(PI));

    _defineProperty(this, "rspd", random(PI / 16, PI / -16));

    _defineProperty(this, "spd", 0.075);

    _defineProperty(this, "deathSFX", "Xp");

    _defineProperty(this, "scale", 1 / 4);

    _defineProperty(this, "color", "#ff5");

    this.rad = rad;
  }

  tick() {
    if (player && player.alive && Entity.distance(this, player) < 5 * game.scale) this.moveTo(player);
    this.r += this.rspd;
  }

  pickLocation() {
    var {
      parent
    } = this;
    this.mx = parent.mx;
    this.my = parent.my;
    this.velocity = point(this.rad, this.spd * this.size * 10);
  }

  static summon(dead) {
    var r = PI / 5;
    var s = random(PI);

    for (let i = 0; i < 10; i++) exp.push(new Exp(dead, r * i + s).spawn());
  }

  get rotation() {
    return this.r;
  }

}

class Particle {
  /**@param {Entity} parent*/
  constructor(parent) {
    _defineProperty(this, "x", 0);

    _defineProperty(this, "y", 0);

    _defineProperty(this, "id", -1n);

    _defineProperty(this, "color", "white");

    _defineProperty(this, "shape", "square");

    _defineProperty(this, "scale", 1);

    this.parent = parent;
  }

  get size() {
    return game.scale * this.scale;
  }

  static summon(particle) {
    var id = particles.push(particle);
    particle.id = id;
    return particle;
  }

  update() {
    this.tick();
  }

  draw() {
    Entity.prototype.draw.call(this);
  }
  /**Rotation of shape*/


  get rotation() {
    return 0;
  }
  /**Rotation of shape2
   * @type {number}*/


  get rotation2() {
    return undefined;
  }
  /**transparency of shape's fill*/


  get fillAlpha() {
    return this.hp / this.maxHp;
  }
  /**transparency of shape2's fill*/


  get fillAlpha2() {
    return this.fillAlpha;
  }
  /**transparency of shape's outline*/


  get strokeAlpha() {
    return 1;
  }
  /**transparency of shape2's outline*/


  get strokeAlpha2() {
    return this.fillAlpha;
  }

  get mx() {
    return this.x + this.size / 2;
  }

  get my() {
    return this.y + this.size / 2;
  }

  set mx(mx) {
    this.x = mx - this.size / 2;
  }

  set my(my) {
    this.y = my - this.size / 2;
  }

}

class Shockwave extends Particle {
  constructor(parent, size) {
    super(parent);

    _defineProperty(this, "shape", "circle");

    _defineProperty(this, "color", "white");

    this.mx = parent.mx;
    if (typeof this.mx != "number") this.mx = parent.x;
    this.my = parent.my;
    if (typeof this.my != "number") this.my = parent.y;
    this.Msize = size;
    this.px = this.mx;
    this.py = this.my;
    this.scale = 0;
  }

  get alive() {
    return this.size < this.Msize;
  }

  tick() {
    this.scale += this.Msize / (game.scale * 50);
    this.mx = this.px;
    this.my = this.py;
  }

  get fillAlpha() {
    return 0;
  }

  get undoStrokeScale() {
    return this.scale;
  }

}

class Spawner extends Particle {
  constructor(parent, collection) {
    super(parent);

    _defineProperty(this, "hue", 0);

    _defineProperty(this, "time", 100);

    _defineProperty(this, "scale", 2);

    _defineProperty(this, "shape", "4star");

    parent.update();
    this.scale = this.parent.scale * 2;
    if (parent.spawner) this.hue = parent.spawner;
    this.collection = collection;
  }

  tick() {
    var {
      parent
    } = this;
    this.mx = parent.mx;
    this.my = parent.my;

    if (this.time-- == 0) {
      var id = this.collection.push(parent);
      parent.id = id;
    }

    this.color = `hsl(${this.hue}, 100%, ${50 + abs(25 - this.time % 50) * 2}%)`;
  }

  draw() {
    var {
      parent
    } = this;
    super.draw();
    parent.draw();
  }

  get alive() {
    return this.time >= 0;
  }

  get rotation() {
    return this.time * PI / 25;
  }

}

class Skill {
  /**@param {Entity} user*/
  constructor(user) {
    this.user = user;
  }

  update() {}
  /**Arrow Keys
   * @param {number} x @param {number} y*/


  directional(x, y) {}

}

class Gun extends Skill {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "sk", 0);

    _defineProperty(this, "rsk", 10);

    _defineProperty(this, "lastShot", 0);
  }
  /**Arrow Keys
   * @param {number} x @param {number} y*/


  directional(x, y) {
    if (this.sk < this.rsk) return;
    if (this.lastShot) return;
    this.sk -= this.rsk;
    ({
      x,
      y
    } = point(radian(x, y)));
    this.lastShot = 10;
    var bullet = new Bullet(this.user, radian(x, y)).spawn();
    bullet.x += player.size * x / 2;
    bullet.y += player.size * y / 2;
    bullets.push(bullet);
    SFX.get("Shoot").play();
  }

  update() {
    if (this.lastShot) this.lastShot--;
    var a = 20 - floor(this.sk / this.rsk);
    if (a > 0) this.sk += a / 320;
  }

  draw() {
    var {
      user
    } = this;
    var m = user.size * 1.5;
    var s = user.size / 3;
    var a = floor(this.sk / this.rsk);
    var ri = PI * 2 / a;
    var x = user.mx - s / 2;
    var y = user.my - s / 2;

    for (let i = 0; i < a; i++) {
      var rad = ri * i + tick / (a * 2 + 3);
      drawShape({
        x: x + cos(rad) * m,
        y: y + sin(rad) * m,
        size: s,
        color: "white",
        shape: "square3",
        fillAlpha: 0,
        rotation: rad
      });
    }
  }

}

class Player extends Entity {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "deathSFX", "Death");

    _defineProperty(this, "skill", void 0);

    _defineProperty(this, "color", "#55f");

    _defineProperty(this, "shape", "square3");

    _defineProperty(this, "color2", "#f55");
  }

  tick() {
    this.keys();

    switch (data.touchStyle) {
      case 1:
        this.touchv1();

      case 2:
        this.touchv2();

      case 3:
        this.touchv3();
    }
  }
  /**Moves the player to the middle of the screen*/


  pickLocation() {
    this.mx = innerWidth / 2;
    this.my = innerHeight / 2;
    enemies.forEach(enemy => {
      if (Entity.distance(this, enemy) < 5 * game.scale) {
        var radian = Entity.radianTo(this, enemy);
        enemy.x += cos(radian) * enemy.size * 5;
        enemy.y += sin(radian) * enemy.size * 5;
      }
    });
    SFX.get("Spawn").play();
    Particle.summon(new Shockwave(this, 10 * game.scale));
  }
  /**React to pressed keys*/


  keys() {
    //wasd
    this.velocity.x += this.size * this.spd * (keys.has("right") - keys.has("left"));
    this.velocity.y += this.size * this.spd * (keys.has("down") - keys.has("up")); //Arrow keys

    var [x, y] = [0, 0];
    if (keys.has("right2")) x++;
    if (keys.has("left2")) x--;
    if (keys.has("down2")) y++;
    if (keys.has("up2")) y--;
    this.skl = Boolean(x || y);
    if (this.skill && (x || y)) this.skill.directional(x, y);
    ["up", "left", "right", "down"].forEach(key => {
      if (keys.has(key)) this.moved = true;
    });
  }

  touchv1() {
    var {
      touch,
      touch2
    } = this;
    if (touch && touch.end) touch = false;
    if (touch2 && touch2.end) touch2 = false;
    if (!touch && !this.moved) touches.forEach(obj => {
      if (obj != touch2 && !obj.end && Date.now() - game.tick * 5 > obj.start) {
        touch = obj;
      }
    });
    if (!touch2 && !this.skl) touches.forEach(obj => {
      if (obj != touch && !obj.end && Date.now() - game.tick * 5 > obj.start) {
        touch2 = obj;
      }
    });

    if (touch && !this.moved) {
      this.moveTo(touch);
      this.touch = touch;
      touch.used = true;
    }

    if (touch2 && !this.skl) {
      if (this.skill) this.skill.directional(touch2.x - this.mx, touch2.y - this.my);
      this.touch2 = touch2;
      touch2.used = true;
    }
  }

  touchv2() {
    var {
      touch,
      touch2
    } = this;
    if (touch && touch.end) touch = false;
    if (touch2 && touch2.end) touch2 = false;
    if (!touch && !this.moved) touches.forEach(obj => {
      if (obj.sx < innerWidth / 2 && obj != touch2 && !obj.end && Date.now() - game.tick * 5 > obj.start) {
        touch = obj;
      }
    });
    if (!touch2 && !this.skl) touches.forEach(obj => {
      if (obj.sx > innerWidth / 2 && obj != touch && !obj.end && Date.now() - game.tick * 5 > obj.start) {
        touch2 = obj;
      }
    });

    if (touch && !this.moved) {
      this.move(radian(touch.x - touch.sx, touch.y - touch.sy));
      this.touch = touch;
      drawShape({
        x: touch.sx - game.scale / 4,
        y: touch.sy - game.scale / 4,
        size: game.scale / 2,
        color: this.color,
        shape: "circle"
      });
      ctx.lineWidth = game.scale / 4;
      ctx.beginPath();
      ctx.strokeStyle = this.color;
      ctx.moveTo(touch.sx, touch.sy);
      ctx.lineTo(touch.x, touch.y);
      ctx.stroke();
    }

    if (touch2 && !this.skl) {
      this.touch2 = touch2;
      if (this.skill) this.skill.directional(touch2.x - touch2.sx, touch2.y - touch2.sy);else return;
      drawShape({
        x: touch2.sx - game.scale / 4,
        y: touch2.sy - game.scale / 4,
        size: game.scale / 2,
        color: this.color2,
        shape: "circle"
      });
      ctx.lineWidth = game.scale / 4;
      ctx.beginPath();
      ctx.strokeStyle = this.color2;
      ctx.moveTo(touch2.sx, touch2.sy);
      ctx.lineTo(touch2.x, touch2.y);
      ctx.stroke();
    }
  }

  touchv3() {
    var {
      touch,
      touch2
    } = this;
    if (touch && touch.end) touch = false;
    if (!touch && !this.moved) touches.forEach(obj => {
      if (obj.sx < innerWidth / 2 && obj != touch2 && !obj.end && Date.now() - game.tick * 5 > obj.start) {
        touch = obj;
      }
    });
    if (!touch2 && !this.skl) touches.forEach(obj => {
      if (obj.sx > innerWidth / 2 && obj != touch && !obj.end && Date.now() - game.tick * 5 > obj.start) {
        touch2 = obj;
      }
    });

    if (touch && !this.moved) {
      this.move(radian(touch.x - touch.sx, touch.y - touch.sy));
      this.touch = touch;
      drawShape({
        x: touch.sx - game.scale / 4,
        y: touch.sy - game.scale / 4,
        size: game.scale / 2,
        color: this.color,
        shape: "circle"
      });
      ctx.lineWidth = game.scale / 4;
      ctx.beginPath();
      ctx.strokeStyle = this.color;
      ctx.moveTo(touch.sx, touch.sy);
      ctx.lineTo(touch.x, touch.y);
      ctx.stroke();
    }

    if (touch2 && !this.skl) {
      if (!touch2.end) {
        this.touch2 = touch2;
        return;
      } else delete this.touch2;

      if (this.skill) this.skill.directional(touch2.x - touch2.sx, touch2.y - touch2.sy);else return;
      drawShape({
        x: touch2.sx - game.scale / 4,
        y: touch2.sy - game.scale / 4,
        size: game.scale / 2,
        color: this.color2,
        shape: "circle"
      });
      ctx.lineWidth = game.scale / 4;
      ctx.beginPath();
      ctx.strokeStyle = this.color2;
      ctx.moveTo(touch2.sx, touch2.sy);
      ctx.lineTo(touch2.x, touch2.y);
      ctx.stroke();
    }
  }

  die() {
    if (game.level > 0 && game.lives > 0 && !hardcore) {
      --game.lives;
      this.hp = this.maxHp;
      this.spawn();
    }
  }

  static summon() {
    player = new Player().spawn();
    player.skill = new Player.weapon(player);
    return player;
  }

  get rotation() {
    return radian(this.velocity);
  }

}

_defineProperty(Player, "weapon", Gun);

class Npc extends Entity {
  spawn(x, y) {
    this.pickLocation(x, y);
    return this;
  }

  pickLocation(x, y) {
    this.mx = x;
    this.my = y;
  }

  static summon(npc, x, y) {
    npcs.push(npc.spawn(x, y));
    return npc;
  }

}

class TopHat extends Npc {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "shape", "square4");

    _defineProperty(this, "color", "#ddd");

    _defineProperty(this, "shape2", "tophat");

    _defineProperty(this, "color2", "#fff");
  }

  tick() {
    if (game.event.arena1) {
      var x = game.x2 / 6,
          y = game.y2 / 2;
      if (Entity.distance(this, {
        x,
        y
      }) > game.scale / 5) this.moveTo(x, y);
    }

    if (game.event.arena2) {
      var x = game.x2 / 6,
          y = game.y2 / 4;
      if (Entity.distance(this, {
        x,
        y
      }) > game.scale / 5) this.moveTo(x, y);
    }
  }

  get rotation2() {
    return atan2(game.scale, this.velocity.x) - PI / 2;
  }

}

_defineProperty(TopHat, "textColor", "#ddd");

class Bullet extends Entity {
  /**@param {Entity} parent @param {number} rad*/
  constructor(parent, rad) {
    super(parent);

    _defineProperty(this, "scale", 1 / 4);

    _defineProperty(this, "spd", 0.075);

    _defineProperty(this, "knockback", 5);

    _defineProperty(this, "time", 100);

    _defineProperty(this, "shape", "square3");

    this.color = parent.color;
    this.rad = rad;
  }

  pickLocation() {
    var {
      parent
    } = this;
    this.mx = parent.mx;
    this.my = parent.my;
    this.velocity = point(this.rad, this.spd * this.size * 10);
  }

  get fillAlpha() {
    return this.parent.fillAlpha;
  }

  get alive() {
    return this.time > 0;
  }
  /**@param {Entity} attacker*/


  attack(attacker) {
    this.time -= attacker.atk * 25;
  }

  tick() {
    this.time--;
    if (this.time == 100) this.move(this.rad);else this.move(radian(this.velocity));
  }

}

class Enemy extends Entity {
  constructor(...args) {
    super(...args);

    _defineProperty2(this, "deathSFX", "Hit");
  }

  spawn(sound = true, x, y) {
    var tries = 0,
        good;

    do {
      this.pickLocation();
      if (typeof x == "number") this.mx = x;
      if (typeof y == "number") this.my = y;
      ++tries;
      good = !(player && player.alive) || Entity.distance(player, this) > game.scale * 5;
    } while (good && tries < 10);

    if (good && sound) SFX.get("Spawn").play();
    return good ? this : good;
  }

  die() {
    super.die();
    Exp.summon(this);
    data.catalog.add(this.name);
  }
  /**@param {Enemy} enemy*/


  static summon(enemy, x, y) {
    enemy = enemy.spawn(true, x, y);
    if (enemy) Particle.summon(new Spawner(enemy, enemies));
    return enemy;
  }
  /**@param {Enemy[]} enemies*/


  static summonBulk(...enemyArray) {
    enemyArray.forEach(enemy => {
      enemy = enemy.spawn(false);
      if (enemy) enemies.push(enemy);
      return enemy;
    });
  }

}

class Chill extends Enemy {
  constructor(...args) {
    super(...args);

    _defineProperty2(this, "name", "Chill");

    _defineProperty2(this, "description", ["Does nothing.", `"He's pretty chill"`]);

    _defineProperty2(this, "color", "#fa5");

    _defineProperty2(this, "shape", "square2");
  }

}

class GoGo extends Enemy {
  constructor(...args) {
    super(...args);

    _defineProperty2(this, "name", "Go-go");

    _defineProperty2(this, "description", ["Litterally just moves.", `"Doesn't care where it's going`, `As long as it's going somewhere!"`]);

    _defineProperty2(this, "color", "#faa");

    _defineProperty2(this, "shape", "square2");

    _defineProperty2(this, "color2", "red");

    _defineProperty2(this, "shape2", "arrow");
  }

  tick() {
    var {
      x,
      y
    } = this.velocity;
    if (x || y) this.move(this.rotation);else this.move(random(PI * 2));
  }

  prepare() {
    this.velocity = {
      y: -1,
      x: 0
    };
  }

  get rotation() {
    return radian(this.velocity);
  }

}

class Underbox extends GoGo {
  constructor(...args) {
    super(...args);

    _defineProperty2(this, "name", "Underbox");

    _defineProperty2(this, "ancestor", "Go-go");

    _defineProperty2(this, "description", ["Picks a direction", "Does not sway from it's decision.", `"Filled with DETERMINATION"`]);

    _defineProperty2(this, "color", "#afa");

    _defineProperty2(this, "shape", "square");

    _defineProperty2(this, "color2", "#0c0");

    _defineProperty2(this, "shape2", "arrow2");
  }

  tick() {
    if (this.target) this.move(this.rotation2);else {
      var rad = random(PI * 2);
      this.target = {
        x: cos(rad),
        y: sin(rad)
      };
    }
  }

  prepare() {
    this.target = {
      y: -1,
      x: 0
    };
  }
  /**@param {boolean} x Hit the x wall? @param {boolean} y Hit the y wall?*/


  hitWall(x, y) {
    var {
      target
    } = this;
    target.x *= -x || 1;
    target.y *= -y || 1;
  }

  get rotation2() {
    return radian(this.target);
  }

}

class Corner extends Enemy {
  constructor(...args) {
    super(...args);

    _defineProperty2(this, "name", "Edge lord");

    _defineProperty2(this, "description", ["Goes from corner to corner", `"Is always on edge."`]);

    _defineProperty2(this, "wallSFX", false);

    _defineProperty2(this, "color", "#ffa");

    _defineProperty2(this, "color2", "#ec0");

    _defineProperty2(this, "shape2", "4square");
  }

  pickLocation() {
    var {
      x: gx = 0,
      y: gy = 0,
      x2 = innerWidth,
      y2 = innerHeight
    } = game;
    super.pickLocation();
    var a = round(random());
    if (a) this.x = constrain(this.x, x2, gx);else this.y = constrain(this.y, y2, gy);
    this.a = a;
    this.pickDir();
  }

  tick() {
    var {
      x: gx = 0,
      y: gy = 0,
      x2 = innerWidth,
      y2 = innerHeight
    } = game;
    var {
      a,
      velocity
    } = this;
    this.move(radian(this.velocity));
    if (a) this.x = constrain(this.x, x2, gx);else this.y = constrain(this.y, y2, gy);
    if (a) velocity.x = 0;else velocity.y = 0;
    if (this.last) --this.last;
  }

  pickDir() {
    var {
      x: gx = 0,
      y: gy = 0,
      x2 = innerWidth,
      y2 = innerHeight
    } = game;
    var x = constrain(this.x, x2, gx) - gx,
        y = constrain(this.y, y2, gy) - gy;
    this.velocity = {
      y: y ? -1 : 1,
      x: x ? -1 : 1
    };
    this.last = 10;
  }
  /**@param {boolean} x Hit the x wall? @param {boolean} y Hit the y wall?*/


  hitWall(x, y) {
    var {
      a
    } = this;

    if (a && y || !a && x) {
      this.a = !a;
      this.pickDir();
    }
  }

}

class Switch extends Underbox {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "name", "Switch");

    _defineProperty(this, "ancestor", "Underbox");

    _defineProperty(this, "description", ["Underbox. but can switch direction", `"Optimistic, determined, yet indecisive."`]);

    _defineProperty(this, "shape2", "arrow3");

    _defineProperty(this, "color2", "#ff0");
  }

  tick() {
    if (!this.last) {
      this.last = floor(random(120, 30)) + 1;
      delete this.target;
    } else --this.last;

    this.color = `hsl(${300 - this.last / 2}, 100%, 50%)`;
    super.tick();
  }

  prepare() {
    super.prepare();
    this.color = "#a0f";
  }

}

class Ghost extends Chill {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "name", "Ghost");

    _defineProperty(this, "ancestor", "Chill");

    _defineProperty(this, "description", ["Invisible when far away", `"You can hide, but you can't run!"`]);

    _defineProperty(this, "fade", -1);

    _defineProperty(this, "color", "#ccc");
  }

  tick() {
    if (player && player.alive) {
      var dis = Entity.distance(this, player);
      if (dis < this.size * 10) this.dis = dis / (10 * this.size);else this.dis = 1;
      if (this.fade > -1) this.fade -= 25;
      if (this.fade < -1) this.fade = -1;
    } else {
      if (this.fade == -1) this.fade = 0;
      this.fade++;
      this.fade %= 1000;
    }

    if (abs(this.velocity.x) > this.size / 100 || abs(this.velocity.y) > this.size / 100) this.fade = 0;
  }

  prepare() {
    this.fade = 250;
  }

  get fillAlpha() {
    if (this.fade == -1) var alpha = 1 - this.dis;else alpha = abs(500 - this.fade) / 500;
    return alpha * this.hp / this.maxHp;
  }

  get strokeAlpha() {
    return this.fillAlpha;
  }

}

class Boss extends Enemy {
  constructor(...args) {
    super(...args);

    _defineProperty3(this, "phase", 0);

    _defineProperty3(this, "phases", []);

    _defineProperty3(this, "time", 0);

    _defineProperty3(this, "time", 0);

    _defineProperty3(this, "scale", 2);

    _defineProperty3(this, "spawner", 180);
  }

  get currentPhase() {
    return this.phases[this.phase];
  }

  next() {
    ++this.phase;
    this.time = 0;
  }

  setPhase(num) {
    this.phase = num;
    this.time = 0;
  }

  tick() {
    ++this.time;
    if (this.currentPhase) this.currentPhase();
  }

  attack(enemy) {
    super.attack(enemy);
    Exp.summon(this);
  }

  die() {
    if (SFX.has(this.deathSFX)) SFX.get(this.deathSFX).play();
    Exp.summon(this);
  }

}

class Boss1 extends Boss {
  constructor(...args) {
    super(...args);

    _defineProperty3(this, "shape", "4star");

    _defineProperty3(this, "color", "#f55");

    _defineProperty3(this, "phases", [() => this.moveTo(this.size / 2, this.size / 2) < game.scale / 5 && this.next(), () => {
      this.r = 1;
      this.spd = this.nspd * 5;
      this.next();
    }, () => this.moveTo(game.x2 - this.size / 2, this.size / 2) < game.scale / 5 && this.next(), () => this.moveTo(game.x2 - this.size / 2, game.y2 - this.size / 2) < game.scale / 5 && this.next(), () => this.moveTo(this.size / 2, game.y2 - this.size / 2) < game.scale / 5 && this.next(), () => this.moveTo(this.size / 2, this.size / 2) < game.scale / 5 && this.next(), () => {
      this.spd = this.nspd;
      if (!player || !player.alive) this.next();else {
        this.moveTo(player);

        if (this.time > 200) {
          this.r = 0;
          this.next();
        }
      }
    }, () => this.moveTo(this.size / 2, game.y2 - this.size / 2) < game.scale / 5 && (this.spd += this.nspd) && this.next(), () => this.moveTo(this.size / 2, this.size / 2) < game.scale / 5 && (this.spd += this.nspd) && this.next(), () => this.moveTo(game.m2 - this.size / 2, game.m2 - this.size / 2) < game.scale / 5 && (this.spd += this.nspd) && this.next(), () => this.moveTo(game.x2 - this.size / 2, this.size / 2) < game.scale / 5 && this.next(), () => {
      this.spd = this.nspd;
      this.summons = 0;
      if (!player || !player.alive) this.next();else {
        this.r = 1;
        this.moveTo(player);
        if (this.time > 200) this.next();
      }
    }, () => {
      this.r = 0;

      if (this.summons < 5) {
        if (Enemy.summon(new GoGo())) ++this.summons;
      } else this.next();
    }, () => {
      if (this.time > 500) this.setPhase(0);
    }]);

    _defineProperty3(this, "nspd", this.spd / 2);

    _defineProperty3(this, "onWall", NULL);

    _defineProperty3(this, "hp", 20);

    _defineProperty3(this, "maxHp", 20);
  }

  get rotation() {
    switch (this.r) {
      case 0:
        return 0;

      case 1:
        return this.time * PI / 10;
    }
  }

}

var catalog = {
  getList() {
    var list = [];
    data.catalog.forEach(value => list.push(new (this.converter.get(value))()));
    return list;
  },

  /**@type {Map<string, typeof Enemy>}*/
  converter: new Map([["Chill", Chill], ["Go-go", GoGo], ["Underbox", Underbox], ["Edge lord", Corner]]),

  setup() {
    this.active = true;
    onresize();
    this.list = this.getList();
    this.list.forEach(enemy => enemy.spawn());
    enemies = new Collection(...this.list);
    this.list = this.getList();
    this.list.forEach(enemy => enemy.prepare());
    this.selected = this.list.length;
    this.mx = 0;
    this.my = 0;
    Music.get("Catalog").play();
    backgroundName = "catalog";
    backgroundColor = "#0a0";
  },

  screen() {
    game.x = game.scale * 2;
  },

  run() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, game.x2, game.y2);

    if (this.selected != this.list.length) {
      /**@type {Enemy}*/
      var enemy = enemies.get(BigInt(this.selected));
      var {
        mx,
        my
      } = enemy;
      mx -= game.x2 / 2;
      my -= game.y2 / 2;
    } else {
      mx = 0;
      my = 0;
    }

    {
      let a = this.mx - mx,
          b = this.my - my;
      let c = max(abs(a), abs(b));
      c /= game.scale / 2;

      if (c) {
        if (c < 1) {
          this.mx = mx;
          this.my = my;
        } else {
          this.mx -= a / c;
          this.my -= b / c;
        }
      }
    }
    ctx.translate(-this.mx, -this.my);
    bctx.translate(-this.mx, -this.my);
    main();
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, game.x, game.y2);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";
    ctx.strokeRect(game.x, 0, game.x2 - game.x, game.y2);
    ctx.translate(this.mx, this.my);
    bctx.translate(this.mx, this.my);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, game.x, game.y2);

    if (enemy) {
      var text = enemy.name;
      if (enemy.ancestor) text += ` (evolves from ${enemy.ancestor})`;
      ctx.font = `${game.scale / 2}px Sans`;
      var width = ctx.measureText(text).width;
      var h = game.scale * 3 / 4;
      ctx.strokeStyle = "white";
      ctx.beginPath();
      ctx.moveTo(game.x, h);
      ctx.lineTo(game.x + width, h);
      ctx.lineTo(game.x + width + game.scale, 0);
      ctx.lineTo(game.x, 0);
      ctx.closePath();
      ctx.fillStyle = enemy.color;
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = enemy.color2 || "black";
      ctx.fillText(text, game.x + game.scale / 4, game.scale / 2);
      {
        width = 0;
        let amo = 0;
        enemy.description.forEach(value => {
          var s = ctx.measureText(value).width;
          if (s > width) width = s;
          ++amo;
        });
        width += game.scale / 5;
        var x = game.x2 - width;
        ctx.fillStyle = "#ccc";
        ctx.fillRect(x - game.scale / 4, 0, width + game.scale / 4, amo * h + h / 4);
        ctx.strokeRect(x - game.scale / 4, 0, width + game.scale / 4, amo * h + h / 4);
        ctx.fillStyle = "black";
        enemy.description.forEach((value, i) => {
          i = +i;
          ctx.fillText(value, x, h * (i + 1));
        });
      }
    }

    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
    ctx.moveTo(game.x, 0);
    ctx.lineTo(game.x, game.y2);
    ctx.stroke();

    var any = (...list) => {
      var any = false;
      list.forEach(v => {
        if (!any && (keys.get(v) == 1 || keys.get(v) == 3)) any = true;
      });
      return any;
    };

    if (any("down", "down2", "right", "right2")) catalog.selected++;
    if (any("up", "up2", "left", "left2")) catalog.selected--;
    ["up", "up2", "left", "left2", "right", "right2", "down", "down2"].forEach(key => {
      if (keys.has(key)) keys.set(key, 2);
    });
    this.selected = (this.selected + this.list.length + 1) % (this.list.length + 1);
    var touch;
    touches.forEach(obj => {
      if (!obj.end && !obj.used && !touch) touch = obj;
    });
    var hit;
    var s = game.scale * 2;
    this.list.forEach((enemy, i) => {
      i = +i;
      var y = s * i;
      enemy.mx = game.x / 2;
      enemy.y = i * s;
      enemy.y += game.scale / 2;

      if (touch) {
        if (touch.x < s && touch.y > y && touch.y < y + s) {
          this.selected = i;
          hit = true;
        }
      }

      if (this.selected == i) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, y, s, s);
      }

      enemy.draw();
    });
    ctx.fillStyle = "white";
    var y = game.y2 - s;
    var end;
    if (touch && touch.x < s && touch.y > y && touch.y < y + s) end = true;
    if (touch && !hit) this.selected = this.list.length;
    ctx.fillRect(0, y, s, s);
    drawShape({
      x: 0,
      y: y,
      size: s,
      shape: "arrow",
      color: "red",
      rotation: PI
    });

    if (keys.get("back") == 1) {
      keys.set("back", 2);
      end = true;
    }

    if (end) {
      this.active = false;
      Music.get("Catalog").stop();
      mainMenu.setup();
    }
  }

};

function levelMenu() {
  main(false);
  var s = innerHeight / 10;
  var level = levelMenu.items[levelMenu.selected];
  var text = level.name;
  ctx.font = `${s}px Sans`;
  var {
    width
  } = ctx.measureText(text);
  var y = s * 4.5;
  ctx.fillStyle = level.color;
  ctx.fillText(text, (innerWidth - width) / 2, y);
  var switched;
  var touch;

  var any = (...list) => {
    var any = false;
    list.forEach(v => {
      if (!any && (keys.get(v) == 1 || keys.get(v) == 3)) any = true;
    });
    return any;
  };

  touches.forEach(obj => {
    if (!obj.end && (!obj.used || Date.now() - obj.start > 500) && !touch) touch = obj;
  });
  {
    let x = (innerWidth - width) / 2 - s * 5 / 4;
    let y2 = y - s * 4 / 5;
    drawShape({
      x,
      y: y2,
      shape: "arrow",
      color: levelMenu.selected > 0 ? level.color : "red",
      size: s,
      rotation: PI
    });

    if (any("left", "left2")) {
      --levelMenu.selected;
      switched = true;
    }

    if (touch && touch.x > x && touch.x < x + s && touch.y > y2 && touch.y < y2 + s) {
      --levelMenu.selected;
      touch.used = true;
      switched = true;
    }
  }

  if (levelMenu.selected + 1 < levelMenu.items.length && levelMenu.selected < data.level) {
    let x = (innerWidth + width) / 2 + s / 4;
    let y2 = y - s * 4 / 5;
    drawShape({
      x,
      y: y2,
      shape: "arrow",
      color: level.color,
      size: s
    });

    if (any("right", "right2")) {
      ++levelMenu.selected;
      switched = true;
    }

    if (touch && touch.x > x && touch.x < x + s && touch.y > y2 && touch.y < y2 + s) {
      ++levelMenu.selected;
      touch.used = true;
      switched = true;
    }
  }

  ["up", "up2", "left", "left2", "right", "right2", "down", "down2"].forEach(key => {
    if (keys.has(key)) keys.set(key, 2);
  });

  if (level.hasNew) {
    let i = tick % 20;
    i = abs(i - 10) / 5 + 3;
    let a = s / i;
    ctx.fillStyle = "yellow";
    ctx.font = `${a}px Sans`;
    let text = level.hasNew - 1 ? "New enemies!" : "New enemy!";
    let w2 = ctx.measureText(text).width;
    let x = (innerWidth + width) / 2 + s / 2;
    let y2 = y - s * 6 / 5;
    let y3 = y2 + a / 4;
    let x2 = x - w2 / 2;
    ctx.save();
    ctx.translate(x, y2);
    ctx.rotate(PI / 16);
    ctx.translate(-x, -y2);
    ctx.fillText(text, x2, y3);
    ctx.restore();
  }

  if (switched) levelMenu.create();else if (touch && !touch.used || keys.get("select") == 1) levelMenu.startLevel();
  ctx.fillStyle = level.color;
  ctx.font = `${s / 2}px Sans`;

  for (let l = 0; l < level.desc.length; l++) {
    var text = level.desc[l];
    var y = s * (5.5 + l / 2);
    var {
      width
    } = ctx.measureText(text);
    ctx.fillText(text, (innerWidth - width) / 2, y);
  }
}

levelMenu.setup = function () {
  onresize();
  this.active = true;
  if (!("selected" in this)) this.selected = 0;
  levelMenu.create();
};

levelMenu.stop = function () {
  this.active = false;
  this.selected = 0;
  mainMenu.setup();
};

levelMenu.startLevel = function () {
  game.level = levelMenu.selected;
  reset();
  player = undefined;
  levelMenu.active = false;
};

levelMenu.create = function () {
  enemies.clear();
  npcs.clear();
  particles.clear();
  Music.forEach(bgm => bgm.stop());
  var level = this.items[this.selected];

  if (!level) {
    this.stop();
    return;
  }

  level.hasNew = 0;
  if (Music.has(level.music)) Music.get(level.music).play();
  var can = catalog.getList();

  var has = what => {
    let is = false;
    can.forEach(enemy => {
      if (enemy instanceof what) is = true;
    });
    return is;
  };

  if (level.enemies) while (enemies.size < 20) {
    var list = [];
    level.enemies.forEach(enemy => {
      if (has(enemy)) list.push(new enemy());else ++level.hasNew;
    });
    Enemy.summonBulk(...list);
  }
  if (level.boss) level.boss.forEach(boss => boss.summonBulk(new boss()));
  backgroundName = level.background.name;
  backgroundColor = level.background.color;
};

levelMenu.items = [{
  name: "Tutorial",
  color: "#0cc",
  desc: ["Replay the tutorial", "In case you somehow forgot how to play or something"],
  enemies: [Chill, GoGo],
  music: "Tutorial",
  background: {
    name: "tutorial",
    color: "#0005"
  }
}, {
  name: "Level 1",
  color: "#fa5",
  desc: ["This is where your true journey begins."],
  enemies: [Chill, GoGo, Underbox, Corner],
  music: "Level-1",
  background: {
    name: "level-1",
    color: "#0005"
  }
}, {
  name: "Boss 1",
  color: "#f55",
  music: "Boss-1",
  desc: ["The first battle."],
  boss: [Boss1],
  background: {
    name: "level-1",
    color: "#0005"
  }
}];

class levelReadable {
  /**@param {(level: levelReadable) => void} script
   * @param {levelPhase[]} phases*/
  constructor(script, ...phases) {
    if (script instanceof levelPhase) phases.unshift(script);else if (script) this.script = script;
    this.phases = phases;
    this.phase = 0;
  }
  /**@param {number} phase*/


  setPhase(phase) {
    this.phase = phase;
    this.paused = false;
  }

  get currentPhase() {
    return this.phases[this.phase];
  }

  next() {
    this.phase++;
  }

  run() {
    if (this.phase == -1 || this.paused) return;
    if (this.currentPhase) this.currentPhase.run(this);
    if (typeof this.script == "function") this.script(this);
  }

}

class levelPhase {
  /**@param {(phase: levelPhase, level: levelReadable) => void} script
   * @param {levelPart[]} parts*/
  constructor(script, ...parts) {
    if (script instanceof levelPart) parts.unshift(script);else if (script) this.script = script;
    this.parts = parts;
    this.part = 0;
  }

  get currentPart() {
    return this.parts[this.part];
  }

  resetSummons() {
    this.parts.forEach(part => part.resetSummons());
  }

  reset() {
    this.part = 0;
    this.parts.forEach(part => part.reset());
  }

  next() {
    ++this.part;
  }
  /**@param {number} part*/


  setPart(part) {
    this.part = part;
    this.paused = false;
  }
  /**@param {levelReadable} level*/


  run(level) {
    if (this.part == -1 || this.paused) return;
    if (this.currentPart) this.currentPart.run(this, level);else level.next();
    if (typeof this.script == "function") this.script(this, level);
  }

}

class levelPart {
  /**@param {{
   * 	wait?: number
   * 	dialogue?: {
   * 		text: string
   * 		color: string
   * 		continued?: boolean
   * 		auto?: false
   * 		onFinished?(part: levelPart, phase: levelPhase, level: levelReadable): void
   * 		then: "nextPart" | "nextPhase"
   *	}[]
   * 	summons?: {what: typeof Entity, amount: number, params?:any[]}[]
   * 	script?: (part: levelPart, phase: levelPhase, level: levelReadable): boolean
   *  partPause?: true
   * 	phasePause?: true
   * 	levelPause?: true
   * 	nextPart?: true
   * 	nextPhase?: true
   * 	mainMenu?: true
   * 	startBgm?: string
   * 	endBgm?: string
   * 	setBackground?: string,
   * 	saveData?: {}
   * 	setEvent?: {}
   * 	waitUntilClear?: true
   * 	levelComplete?: true
  }} options*/
  constructor(options) {
    var {
      wait = 0,
      dialogue = [],
      summons,
      script,
      partPause,
      phasePause,
      levelPause,
      nextPart,
      nextPhase,
      startBgm,
      mainMenu,
      endBgm,
      setBackground,
      saveData,
      setEvent,
      waitUntilClear,
      levelComplete
    } = options;
    this.wait = wait;
    this.dialogue = dialogue;
    this.summons = summons;
    this.script = script;
    this.partPause = partPause;
    this.phasePause = phasePause;
    this.levelPause = levelPause;
    this.nextPart = nextPart;
    this.nextPhase = nextPhase;
    this.mainMenu = mainMenu;
    this.startBgm = startBgm;
    this.endBgm = endBgm;
    this.saveData = saveData;
    this.setEvent = setEvent;
    this.setBackground = setBackground;
    this.waitUntilClear = waitUntilClear;
    this.levelComplete = levelComplete;
    this.time = 0;
  }

  resetSummons() {
    if (this.summons) this.summons.forEach(value => value.summoned = 0);
  }

  reset() {
    this.time = 0;
    this.resetSummons();
  }
  /**@param {levelPhase} phase @param {levelReadable} level*/


  run(phase, level) {
    var part = this;
    var canEnd = true;

    if (this.wait < this.time) {
      if (this.summons) this.summons.forEach(value => {
        var {
          what,
          amount = 1,
          params = []
        } = value;
        if (!("summoned" in value)) value.summoned = 0;
        if (amount > value.summoned && what.summon(new what(), ...params)) ++value.summoned;
        if (amount > value.summoned) canEnd = false;
      });
      if (this.dialogue) this.dialogue.forEach(value => {
        var {
          text,
          color,
          continued,
          auto,
          onFinished,
          then
        } = value;
        var a = dialogue(text, color, {
          continued,
          auto
        });
        if (onFinished || then) a.then(() => {
          if (onFinished) onFinished(part, phase, level);
          if (then) switch (then) {
            case "nextPart":
              phase.next();
              break;

            case "nextPhase":
              level.next();
              break;

            case "nextLevel":
              ++game.level;
              levelMenu.selected = game.level;
              levelMenu.create();
              break;
          }
        });
      });
      if (Music.has(this.startBgm)) Music.get(this.startBgm).play();
      if (Music.has(this.endBgm)) Music.get(this.endBgm).stop();
      if (this.setBackground) backgroundName = this.setBackground;

      if (typeof this.script == "function") {
        if (this.script(this, phase, level)) canEnd = false;
      }

      if (canEnd) {
        if (this.saveData) {
          let keys = Object.keys(this.saveData);

          for (let key of keys) {
            let val = this.saveData[key];
            data[key] = val;
          }
        }

        if (this.setEvent) {
          let keys = Object.keys(this.setEvent);

          for (let key of keys) {
            let val = this.setEvent[key];
            game.event[key] = val;
          }
        }

        if (this.nextPart) phase.next();
        if (this.nextPhase) level.next();
        if (this.partPause) this.time = -1;
        if (this.phasePause) phase.paused = true;
        if (this.levelPause) level.paused = true;
        if (this.levelComplete && data.level <= game.level) data.level = game.level + 1;
        if (this.mainMenu) mainMenu.setup();
        if (this.waitUntilClear && !enemies.size && !particles.size) phase.next();
      }
    }

    if (this.time != -1) this.time += game.tick;
  }

}

function runLevel(number) {
  if (!levels[number] && generateLevel[number]) levels[number] = generateLevel[number]();
  if (levels[number]) levels[number].run();
}
/**@type {levelReadable[]}*/


var levels = [];
var generateLevel = [() => new levelReadable(new levelPhase((phase, level) => {
  var touch;
  touches.forEach(obj => {
    if (!obj.end && Date.now() - obj.start > game.tick * 5) touch = true;
  });
  if (!phase.move && player && player.alive && (keys.has("w") || keys.has("d") || keys.has("a") || keys.has("s") || touch)) phase.move = true;
  if (phase.move && phase.part > 2) level.next();
}, new levelPart({
  setBackground: "tutorial",
  dialogue: [{
    text: "Wait...",
    color: TopHat.textColor,
    continued: true
  }, {
    text: "Wait... Where's our player?",
    color: TopHat.textColor,

    onFinished(part, phase) {
      phase.setPart(1);
    }

  }],
  phasePause: true
}), new levelPart({
  wait: 1000,

  script() {
    player = new Player();
    assign(player, {
      x: 0,
      y: (innerHeight - player.size) / 2,
      velocity: {
        x: player.size * 2,
        y: 0
      }
    });
    SFX.get("Spawn").play();
  },

  startBgm: "Tutorial",
  nextPart: true
}), new levelPart({
  wait: 3000,
  dialogue: [{
    text: "Ah, there you are",
    color: TopHat.textColor
  }, {
    text: "Welcome player, welcome.",
    color: TopHat.textColor,

    onFinished(part, phase) {
      phase.setPart(3);
    }

  }],
  partPause: true
}), new levelPart({
  wait: 5000,
  dialogue: [{
    text: "Um...",
    color: TopHat.textColor
  }, {
    text: "You are aware of how to move...",
    color: TopHat.textColor,
    continued: true
  }, {
    text: "You are aware of how to move... Right player?",
    color: TopHat.textColor,
    auto: false,

    onFinished(part, phase) {
      phase.setPart(4);
    }

  }],
  partPause: true
}), new levelPart({
  wait: 5000,
  dialogue: [{
    get text() {
      return touches.size ? "Just press and hold." : "Use the W A S D keys";
    },

    color: TopHat.textColor
  }],
  partPause: true
})), new levelPhase(phase => {
  if (player && !player.alive) {
    player = new Player().spawn();
    if (hardcore) phase.reset();
  }
}, new levelPart({
  wait: 250,
  dialogue: [{
    text: "I hope you're ready Player.",
    color: TopHat.textColor
  }, {
    text: "Bring on the PAIN!",
    color: TopHat.textColor,

    onFinished(part, phase) {
      phase.setPart(1);
    }

  }],
  partPause: true
}), new levelPart({
  wait: 1000,
  summons: [{
    what: Chill
  }],
  nextPart: true
}), new levelPart({
  wait: 2000,
  dialogue: [{
    text: "What?",
    color: TopHat.textColor
  }, {
    text: "What is this???",
    color: TopHat.textColor
  }],
  nextPart: true
}), new levelPart({
  wait: 3000,
  dialogue: [{
    text: "Come on!",
    color: TopHat.textColor,
    continued: true
  }, {
    text: "Come on! Give me something better!",
    color: TopHat.textColor,

    onFinished(part, phase) {
      phase.setPart(4);
    }

  }],
  phasePause: true
}), new levelPart({
  wait: 2000,
  summons: [{
    what: GoGo
  }],
  nextPart: true
}), new levelPart({
  wait: 3000,
  dialogue: [{
    text: "See, now this is more like it.",
    color: TopHat.textColor,

    onFinished(part, phase) {
      phase.setPart(6);
    }

  }],
  phasePause: true
}), new levelPart({
  wait: 5000,
  dialogue: [{
    text: "Ok. I'm bored now...",
    color: TopHat.textColor
  }, {
    text: "SEND MORE!!!",
    color: TopHat.textColor,

    onFinished(part, phase) {
      phase.setPart(7);
    }

  }],
  phasePause: true
}), new levelPart({
  wait: 3000,
  summons: [{
    what: GoGo,
    amount: 8
  }],
  nextPart: true
}), new levelPart({
  wait: 10000,
  dialogue: [{
    text: "Hmm...",
    color: TopHat.textColor,
    continued: true
  }, {
    text: "Hmm... Well this is a bit unfair, isn't it?",
    color: TopHat.textColor,

    onFinished(part, phase) {
      phase.setPart(9);
    }

  }],
  phasePause: true
}), new levelPart({
  wait: 5000,

  script() {
    enemies.clear();
  },

  dialogue: [{
    text: "Well that simply won't do.",
    color: TopHat.textColor,

    onFinished(part, phase) {
      phase.setPart(10);
    }

  }],
  phasePause: true
}), new levelPart({
  wait: 1000,
  dialogue: [{
    text: "Here kid, have a gun.",
    color: TopHat.textColor,

    onFinished(part, phase, level) {
      player.skill = new Gun(player);
      player.skill.sk = player.skill.rsk * 2;
      SFX.get("PowerUp").play();
      level.next();
    }

  }],
  phasePause: true
})), new levelPhase(phase => {
  if (player && !player.alive) {
    player = new Player().spawn();
    player.skill = new Gun(player);
    if (hardcore) phase.reset();
  }
}, new levelPart({
  wait: 5000,
  dialogue: [{
    text: "Now, back to the carnage.",
    color: TopHat.textColor,

    onFinished(level, phase) {
      phase.setPart(1);
    }

  }],
  phasePause: true
}), new levelPart({
  wait: 2000,
  summons: [{
    what: Chill,
    amount: 5
  }, {
    what: GoGo,
    amount: 5
  }],
  nextPart: true
}), new levelPart({
  wait: 5000,

  script(part, phase) {
    if (!enemies.size) phase.setPart(3);
  }

}), new levelPart({
  wait: 100,
  dialogue: [{
    text: "Wow, good job player",
    color: TopHat.textColor
  }, {
    text: "Welcome to Bullets 4.",
    color: TopHat.textColor,

    onFinished(part, phase) {
      phase.setPart(4);
    }

  }],
  phasePause: true
}), new levelPart({
  saveData: {
    firstRun: false
  },
  mainMenu: true,
  endBgm: "Tutorial"
}))), () => new levelReadable(level => {
  if (player && !player.alive) {
    level.currentPhase.reset();
    enemies.clear();
    exp.clear();
    player = Player.summon(new Player());
    game.reset();
  }
}, new levelPhase(new levelPart({
  setBackground: "level-1",
  summons: [{
    what: Player
  }, {
    what: TopHat,

    get params() {
      return [game.x2 / 4, game.y2 / 2];
    }

  }],
  nextPart: true
}), new levelPart({
  dialogue: [{
    text: "So, your finally here.",
    color: TopHat.textColor,
    then: "nextPhase"
  }],
  partPause: true
})), new levelPhase(new levelPart({
  dialogue: [{
    text: "Well, let's not waste any time",
    color: TopHat.textColor,
    then: "nextPart"
  }],
  setEvent: {
    arena1: true
  },
  partPause: true
}), new levelPart({
  summons: [{
    what: GoGo,
    amount: 8,

    get params() {
      if (!this.summoned) this.corners = [2, 2, 2, 2];
      let spaces = [[game.x2 / 6, game.y2 / 4], [game.x2 / 6, game.y2 * 3 / 4], [game.x2 * 5 / 6, game.y2 / 4], [game.x2 * 5 / 6, game.y2 * 3 / 4]];
      var a = 0;

      do var corner = floor(random(4)); while (!this.corners[corner] && ++a < 1000);

      if (this.corners[corner]) --this.corners[corner];
      return spaces[corner];
    }

  }],
  waitUntilClear: true,
  startBgm: "Level-1"
})), new levelPhase(new levelPart({
  dialogue: [{
    text: "Hmm...",
    color: TopHat.textColor,
    continued: true
  }, {
    text: "Hmm... Alright, let's try something new...",
    color: TopHat.textColor,
    then: "nextPart"
  }],
  partPause: true
}), new levelPart({
  summons: [{
    what: Underbox,
    amount: 8,

    get params() {
      if (!this.summoned) this.corners = [2, 2, 2, 2];
      let spaces = [[game.x2 / 6, game.y2 / 4], [game.x2 / 6, game.y2 * 3 / 4], [game.x2 * 5 / 6, game.y2 / 4], [game.x2 * 5 / 6, game.y2 * 3 / 4]];
      var a = 0;

      do var corner = floor(random(4)); while (!this.corners[corner] && ++a < 1000);

      if (this.corners[corner]) --this.corners[corner];
      return spaces[corner];
    }

  }],
  waitUntilClear: true
})), new levelPhase(new levelPart({
  dialogue: [{
    text: "All together now!",
    color: TopHat.textColor,
    then: "nextPart"
  }],
  partPause: true
}), new levelPart({
  summons: [{
    what: GoGo,
    amount: 4,

    get params() {
      if (!this.summoned) this.corners = [1, 1, 1, 1];
      let spaces = [[game.x2 / 6, game.y2 / 4], [game.x2 / 6, game.y2 * 3 / 4], [game.x2 * 5 / 6, game.y2 / 4], [game.x2 * 5 / 6, game.y2 * 3 / 4]];
      var a = 0;

      do var corner = floor(random(4)); while (!this.corners[corner] && ++a < 1000);

      if (this.corners[corner]) --this.corners[corner];
      return spaces[corner];
    }

  }, {
    what: Underbox,
    amount: 4,

    get params() {
      if (!this.summoned) this.corners = [1, 1, 1, 1];
      let spaces = [[game.x2 / 6, game.y2 / 4], [game.x2 / 6, game.y2 * 3 / 4], [game.x2 * 5 / 6, game.y2 / 4], [game.x2 * 5 / 6, game.y2 * 3 / 4]];
      var a = 0;

      do var corner = floor(random(4)); while (!this.corners[corner] && ++a < 1000);

      if (this.corners[corner]) --this.corners[corner];
      return spaces[corner];
    }

  }],
  waitUntilClear: true
})), new levelPhase(new levelPart({
  setEvent: {
    arena1: true
  },
  dialogue: [{
    text: "Alright. Let's make this more interesting.",
    color: TopHat.textColor,
    then: "nextPart"
  }],
  partPause: true
}), new levelPart({
  summons: [{
    what: Corner,
    amount: 8
  }, {
    what: Chill,
    amount: 8
  }],
  nextPart: true
}), new levelPart({
  dialogue: [{
    text: "That should suffice.",
    color: TopHat.textColor,
    then: "nextPart"
  }],
  partPause: true
}), new levelPart({
  summons: [{
    what: GoGo,
    amount: 4,

    get params() {
      if (!this.summoned) this.corners = [1, 1, 1, 1];
      let spaces = [[game.x2 / 6, game.y2 / 4], [game.x2 / 6, game.y2 * 3 / 4], [game.x2 * 5 / 6, game.y2 / 4], [game.x2 * 5 / 6, game.y2 * 3 / 4]];
      var a = 0;

      do var corner = floor(random(4)); while (!this.corners[corner] && ++a < 1000);

      if (this.corners[corner]) --this.corners[corner];
      return spaces[corner];
    }

  }, {
    what: Underbox,
    amount: 4,

    get params() {
      if (!this.summoned) this.corners = [1, 1, 1, 1];
      let spaces = [[game.x2 / 6, game.y2 / 4], [game.x2 / 6, game.y2 * 3 / 4], [game.x2 * 5 / 6, game.y2 / 4], [game.x2 * 5 / 6, game.y2 * 3 / 4]];
      var a = 0;

      do var corner = floor(random(4)); while (!this.corners[corner] && ++a < 1000);

      if (this.corners[corner]) --this.corners[corner];
      return spaces[corner];
    }

  }],
  waitUntilClear: true
}), new levelPart({
  dialogue: [{
    text: "WHAT.",
    color: TopHat.textColor
  }, {
    text: "You seriously survived that?",
    color: TopHat.textColor,
    then: "nextPart"
  }],
  partPause: true
}), new levelPart({
  setEvent: {
    arena1: false,
    arena2: true
  },
  dialogue: [{
    text: "Well... don't get cocky kid.",
    color: TopHat.textColor
  }, {
    text: "I still have one trick left up my sleeve.",
    color: TopHat.textColor,
    then: "nextLevel"
  }],
  levelComplete: true,
  partPause: true
}))), () => new levelReadable(level => {
  if (player && !player.alive) {
    level.currentPhase.reset();
    enemies.clear();
    exp.clear();
    player = Player.summon(new Player());
    game.reset();
  }
}, new levelPhase(new levelPart({
  summons: [{
    what: Player
  }, {
    what: Boss1
  }],
  waitUntilClear: true,
  startBgm: "Boss-1"
}), new levelPart({
  dialogue: [{
    text: "Fine. You win.",
    color: TopHat.textColor
  }, {
    text: "Just you wait until I get some new recruits.",
    color: TopHat.textColor,
    then: "nextPart"
  }],
  phasePause: true
})))];
/**@type {Map<string, {
		x: number, y: number, id: number,
		start: number,
		sx: number, sy: number,
		move: {x: number, y: number},
		used?: boolean,
		end?: number
	}>}*/

var touches = new Map();
/**@param {{changedTouches: Touch[]}} e*/

var touchstart = e => e.changedTouches.forEach(touch => {
  var {
    identifier: id,
    pageX: x,
    pageY: y
  } = touch;
  touches.set(id, {
    x,
    y,
    id,
    start: Date.now(),
    sx: x,
    sy: y,
    move: {
      x: 0,
      y: 0
    }
  });
}),

/**@param {{changedTouches: Touch[]}} e*/
touchmove = e => e.changedTouches.forEach(touch => {
  var {
    identifier: id,
    pageX: x,
    pageY: y
  } = touch;
  let obj = touches.get(id);
  obj.x = x;
  obj.y = y;
  touches.set(id, obj);
}),

/**@param {{changedTouches: Touch[]}} e*/
touchend = e => e.changedTouches.forEach(touch => {
  var {
    identifier: id,
    pageX: x,
    pageY: y
  } = touch;
  var obj = touches.get(id);
  obj.end = Date.now();
  touches.set(id, obj);
}),
    touchcancel = e => e.changedTouches.forEach(touch => touches.delete(touch.identifier)); //fix


ontouchstart = e => {
  touchstart({
    changedTouches: [...e.changedTouches]
  });
  canvas.requestFullscreen();
};

ontouchmove = e => {
  touchmove({
    changedTouches: [...e.changedTouches]
  });
};

ontouchend = e => {
  e.preventDefault();
  touchend({
    changedTouches: [...e.changedTouches]
  });
};

ontouchcancel = e => {
  touchcancel({
    changedTouches: [...e.changedTouches]
  });
};

onmousedown = touch => {
  var {
    pageX: x,
    pageY: y
  } = touch;
  var id = -1;
  touches.set(id, {
    x,
    y,
    id,
    start: Date.now(),
    sx: x,
    sy: y,
    move: {
      x: 0,
      y: 0
    }
  });
};

onmousemove = touch => {
  if (!touches.has(-1)) return;
  var {
    pageX: x,
    pageY: y
  } = touch;
  var id = -1;
  let obj = touches.get(id);
  obj.x = x;
  obj.y = y;
  touches.set(id, obj);
};

onmouseup = touch => {
  if (!touches.has(-1)) return;
  var {
    pageX: x,
    pageY: y
  } = touch;
  var id = -1;
  var obj = touches.get(id);
  obj.end = Date.now();
  touches.set(id, obj);
};

function main(focus = true) {
  runLevel(game.level);

  if (game.level > 0) {
    if (player && !hardcore) {
      let x = (game.x2 - game.scale * game.lives) / 2;

      for (let i = 0; i < game.lives; i++) {
        drawShape({
          shape: player.shape,
          color: player.color,
          size: game.scale,
          x: x + i * game.scale,
          y: 0,
          fillAlpha: 0
        });
      }
    }
  }

  if (player && player.alive) player.update();
  enemies.remove(enemy => !enemy.alive);
  exp.remove(xp => !xp.alive);
  bullets.remove(bullet => !bullet.alive);
  npcs.remove(npc => !npc.alive);
  particles.remove(particle => !particle.alive);
  exp.forEach(xp => {
    xp.update();

    if (player && player.alive && Entity.isTouching(player, xp)) {
      if (player.skill) ++player.skill.sk;
      xp.attack(player);
    }
  });
  enemies.forEach(enemy => {
    enemy.update(focus);

    if (player && player.alive && Entity.isTouching(player, enemy)) {
      Entity.collide(player, enemy, focus);
      player.attack(enemy);
      enemy.attack(player);
    }

    bullets.forEach(bullet => {
      if (enemy.alive && Entity.isTouching(enemy, bullet)) {
        Entity.collide(bullet, enemy, focus);
        bullet.attack(enemy);
        enemy.attack(bullet);
      }
    });
  });
  bullets.forEach(bullet => {
    bullet.update(focus);
  });
  npcs.forEach(npc => {
    npc.update();
    if (Entity.isTouching(npc, player)) Entity.collide(npc, player, focus);
    enemies.forEach(enemy => {
      if (Entity.isTouching(enemy, npc)) Entity.collide(npc, enemy, focus);
    });
    bullets.forEach(bullet => {
      if (Entity.isTouching(bullet, npc)) Entity.collide(npc, bullet, focus);
    });
  });
  particles.forEach(particle => {
    particle.update();
  });
  {
    let enemiesArray = enemies.asArray();

    for (let a = 0; a < enemiesArray.length; a++) for (let b = a + 1; b < enemiesArray.length; b++) {
      let enemy = enemiesArray[a],
          enemy2 = enemiesArray[b];
      if (Entity.isTouching(enemy, enemy2)) Entity.collide(enemy, enemy2, focus);
    }
  }
  if (dialogue.active) dialogue.update();
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = "#fff5";
  bctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, innerWidth, innerHeight);
  bctx.fillRect(0, 0, innerWidth, innerHeight);
  ctx.globalCompositeOperation = "source-over";

  if (++tick % 25 == 0) {
    let imageData = ctx.getImageData(0, 0, innerHeight, innerWidth);
    let {
      data
    } = imageData;

    for (let i = 3; i < data.length; i += 3) data[i] = floor(data[i] / 15) * 15;

    ctx.putImageData(imageData, 0, 0);
  }

  var w = game.x2 - game.x,
      h = game.y2 - game.y;
  var w2 = ceil(w / game.scale) * game.scale,
      h2 = ceil(h / game.scale) * game.scale;
  var back = backgrounds.get(backgroundName);

  if (back) {
    bctx.drawImage(back, 0, 0);
  } else {
    var backGen = bckdrpGen.get(backgroundName);

    if (backGen) {
      let back = backGen(w2, h2);
      let canvas = document.createElement("canvas"),
          ctx = canvas.getContext("2d");
      assign(canvas, {
        width: innerWidth,
        height: innerHeight
      }); //back.update();

      ctx.save();
      ctx.beginPath();
      let path = new Path2D();
      path.addPath(back, Matrix(back.scale, back.scale, (w - w2) / 2 + game.x, (h - h2) / 2 + game.y));
      ctx.strokeStyle = back.stroke;
      ctx.fillStyle = back.fill;
      ctx.fill(path);
      ctx.stroke(path);
      backgrounds.set(backgroundName, canvas);
    }
  }

  particles.forEach(particle => {
    particle.draw();
  });
  if (player && player.alive) player.draw();
  enemies.forEach(enemy => enemy.draw());
  npcs.forEach(npc => {
    npc.draw();
  });
  bullets.forEach(bullet => {
    bullet.draw();
  });
  exp.forEach(xp => {
    xp.draw();
  });
  if (dialogue.active) dialogue.draw();
}

function update(e) {
  if (Date.now() < update.last + game.tick) {
    update.run();
    return;
  }

  update.last = Date.now();
  if (mainMenu.active) mainMenu();else if (catalog.active) catalog.run();else if (levelMenu.active) levelMenu();else main();
  pen.clearRect(0, 0, innerWidth, innerHeight);
  pen.drawImage(background, 0, 0);
  pen.drawImage(foreground, 0, 0);
  Music.forEach(bgm => bgm.resume());
  update.run();
  saveData();
}

function reset() {
  onresize();
  game.reset();
  Music.forEach(bgm => bgm.stop());
  enemies.clear();
  bullets.clear();
  exp.clear();
  particles.clear();
  npcs.clear();
}

update.run = () => update.request = requestAnimationFrame(update);
/**@type {Map<string, (1 | 2 | 3)>}*/


onload = () => {
  onresize();
  document.body.appendChild(canvas);
  loadData();
  if (!data.firstRun) mainMenu.setup();
  update.run();
};

onresize = () => {
  assign(canvas, {
    width: innerWidth,
    height: innerHeight
  });
  assign(background, {
    width: innerWidth,
    height: innerHeight
  });
  assign(foreground, {
    width: innerWidth,
    height: innerHeight
  });
  assign(game, {
    x: 0,
    y: 0,
    x2: innerWidth,
    y2: innerHeight,
    scale: sqrt(innerWidth * innerHeight * 1600 / 921600)
  });
  backgrounds.clear();
  if (mainMenu.active) mainMenu.screen();else if (catalog.active) catalog.screen();
};

onblur = () => {
  cancelAnimationFrame(update.request);
  Music.forEach(bgm => bgm.pause());
};

onfocus = () => {
  Music.forEach(bgm => bgm.resume());
  update.run();
};

var keys = new Map();

onkeydown = e => {
  var key = data.keyBind[e.code];
  if (keys.has(key)) keys.set(key, 3);else keys.set(key, 1);
};

onkeyup = e => {
  var key = data.keyBind[e.code];
  keys.delete(key);
};