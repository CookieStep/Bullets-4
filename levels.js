function runLevel(number) {
	if(!levels[number] && generateLevel[number]) levels[number] = generateLevel[number]();
	if(levels[number]) levels[number].run();
}
/**@type {levelReadable[]}*/
var levels = [];
var generateLevel = [
	() => new levelReadable(null,
		new levelPhase(
			(phase, level) => {
				var touch;
				touches.forEach(obj => {
					if(!obj.end && Date.now() - obj.start > game.tick * 5) touch = true;
				});
				if((!phase.move) && player && player.alive && (
					keys.has("w") || keys.has("d") || keys.has("a") || keys.has("s") || touch
				)) phase.move = true;
				if(phase.move && phase.part > 2) level.next();
			},
			new levelPart({
				wait: 2500,
				dialogue: [{
					text: "Wait...",
					color: "white",
					continued: true
				}, {
					text: "Wait... Where's our player?",
					color: "white",
					onFinished(part, phase) {phase.setPart(1)}
				}],
				phasePause: true
			}),
			new levelPart({
				wait: 1000,
				script() {
					player = new Player;
					assign(player, {
						x: 0, y: (innerHeight - player.size)/2,
						velocity: {x: player.size * 2, y: 0}
					});
				},
				nextPart: true
			}),
			new levelPart({
				wait: 3000,
				dialogue: [{
					text: "Ah, there you are",
					color: "white"
				}, {
					text: "Welcome player, welcome.",
					color: "white",
					onFinished(part, phase) {phase.setPart(3)}
				}],
				phasePause: true
			}),
			new levelPart({
				wait: 5000,
				dialogue: [{
					text: "Um...",
					color: "white"
				}, {
					text: "You are aware of how to move...",
					color: "white",
					continued: true
				}, {
					text: "You are aware of how to move... Right player?",
					color: "white",
					onFinished(part, phase) {phase.setPart(4)}
				}],
				phasePause: true
			}),
			new levelPart({
				wait: 5000,
				dialogue: [{
					get text() {return touches.size? "Just press and hold.": "Use the W A S D keys"},
					color: "white"
				}],
				phasePause: true
			})
		), new levelPhase(
			(phase) => {
				if(!player.alive) {
					player = new Player().spawn();
					if(hardcore) {
						phase.setPart(1);
						phase.resetSummons();
					}
				}
			},
			new levelPart({
				wait: 250,
				dialogue: [{
					text: "I hope you're ready Player.",
					color: "white"
				}, {
					text: "Bring on the PAIN!",
					color: "white",
					onFinished(part, phase) {phase.setPart(1)}
				}],
				phasePause: true
			}),
			new levelPart({
				wait: 1000,
				summons: [{enemy: Chill}],
				nextPart: true
			}),
			new levelPart({
				wait: 2000,
				dialogue: [{
					text: "What?",
					color: "white"
				}, {
					text: "What is this???",
					color: "white"
				}],
				nextPart: true
			}),
			new levelPart({
				wait: 3000,
				dialogue: [{
					text: "Come on!",
					color: "white",
					continued: true
				}, {
					text: "Come on! Give me something better!",
					color: "white",
					onFinished(part, phase) {phase.setPart(4)}
				}],
				phasePause: true
			}),
			new levelPart({
				wait: 2000,
				summons: [{enemy: GoGo}],
				nextPart: true
			}),
			new levelPart({
				wait: 1000,
				dialogue: [{
					text: "See, now this is more like it.",
					color: "white",
					onFinished(part, phase) {phase.setPart(6)}
				}],
				phasePause: true
			}),
			new levelPart({
				wait: 5000,
				dialogue: [{
					text: "Ok. I'm bored now...",
					color: "white"
				}, {
					text: "SEND MORE!!!",
					color: "white",
					onFinished(part, phase) {phase.setPart(7)}
				}],
				phasePause: true
			}),
			new levelPart({
				wait: 3000,
				summons: [{enemy: GoGo, amount: 8}],
				nextPart: true
			}),
			new levelPart({
				wait: 10000,
				dialogue: [{
					text: "Hmm...",
					color: "white",
					continued: true
				}, {
					text: "Hmm... Well this is a bit unfair, isn't it?",
					color: "white",
					onFinished(part, phase) {phase.setPart(9)}
				}],
				phasePause: true
			}),
			new levelPart({
				wait: 5000,
				script() {enemies.clear()},
				dialogue: [{
					text: "Well that simply won't do.",
					color: "white",
					onFinished(part, phase) {phase.setPart(10)}
				}],
				phasePause: true
			}),
			new levelPart({
				wait: 1000,
				dialogue: [{
					text: "Here kid, have a gun.",
					color: "white",
					onFinished(part, phase, level) {
						player.skill = new Gun(player);
						level.next();
					}
				}],
				phasePause: true
			})
		),
		new levelPhase(
			(phase) => {
				if(!player.alive) {
					player = new Player().spawn();
					player.skill = new Gun(player);
					if(hardcore) {
						phase.setPart(0);
						phase.resetSummons();
					}
				}
			},
			new levelPart({
				wait: 5000,
				dialogue: [{
					text: "Now,",
					color: "white",
					continued: true
				}, {
					text: "Now, back to the carnage.",
					color: "white",
					onFinished(level, phase) {phase.setPart(1)}
				}],
				phasePause: true
			}),
			new levelPart({
				wait: 2000,
				summons: [{enemy: Chill, amount: 5}, {enemy: GoGo, amount: 5}],
				nextPart: true
			}),
			new levelPart({script(part, phase) {if(!enemies.length) phase.setPart(3)}}),
			new levelPart({
				wait: 100,
				
			})
		)
	)
];
// 			case(8):{
// 				if(this.time > 1000) {
// 					dialogue("Good job player. welcome to Bullets 4", "white").then(() => {
						
// 					});
// 				}
// 			}break;
// 		}
// 	},
// 	function(level) {
// 		level.time += game.tick;
// 		switch(level.phase) {
// 			case(undefined):level.set(0);
// 			case(-1):break;
// 			case(0):{
// 			}break;
// 		}
// 	}
// ]
// function runLevel(levelNumber) {
// 	var level = levels[levelNumber];
// 	if(!level.set) {
// 		level.set = function(phase) {
// 			level.time = 0;
// 			level.said = 0;
// 			level.phase = phase;
// 		}
// 		level.pause = function() {level.phase = -1}
// 		level.say = function(said) {
// 			level.time = 0;
// 			level.said = said;
// 		}
// 	}
// 	level(level);
// }