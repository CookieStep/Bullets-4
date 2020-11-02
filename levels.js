function runLevel(number) {
	if(!levels[number] && generateLevel[number]) levels[number] = generateLevel[number]();
	if(levels[number]) levels[number].run();
}
/**@type {levelReadable[]}*/
var levels = [];
var generateLevel = [
	() => new levelReadable(
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
				setBackground: "tutorial",
				dialogue: [{
					text: "Wait...",
					color: TopHat.textColor,
					continued: true
				}, {
					text: "Wait... Where's our player?",
					color: TopHat.textColor,
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
					SFX.get("Spawn").play();
				},
				startBgm: "Tutorial",
				nextPart: true
			}),
			new levelPart({
				wait: 3000,
				dialogue: [{
					text: "Ah, there you are",
					color: TopHat.textColor
				}, {
					text: "Welcome player, welcome.",
					color: TopHat.textColor,
					onFinished(part, phase) {phase.setPart(3)}
				}],
				phasePause: true
			}),
			new levelPart({
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
					onFinished(part, phase) {phase.setPart(4)}
				}],
				phasePause: true
			}),
			new levelPart({
				wait: 5000,
				dialogue: [{
					get text() {return touches.size? "Just press and hold.": "Use the W A S D keys"},
					color: TopHat.textColor
				}],
				partPause: true
			})
		), new levelPhase(
			(phase) => {
				if(player && !player.alive) {
					player = new Player().spawn();
					if(hardcore)
						phase.reset()
				}
			},
			new levelPart({
				wait: 250,
				dialogue: [{
					text: "I hope you're ready Player.",
					color: TopHat.textColor
				}, {
					text: "Bring on the PAIN!",
					color: TopHat.textColor,
					onFinished(part, phase) {phase.setPart(1)}
				}],
				phasePause: true
			}),
			new levelPart({
				wait: 1000,
				summons: [{what: Chill}],
				nextPart: true
			}),
			new levelPart({
				wait: 2000,
				dialogue: [{
					text: "What?",
					color: TopHat.textColor
				}, {
					text: "What is this???",
					color: TopHat.textColor
				}],
				nextPart: true
			}),
			new levelPart({
				wait: 3000,
				dialogue: [{
					text: "Come on!",
					color: TopHat.textColor,
					continued: true
				}, {
					text: "Come on! Give me something better!",
					color: TopHat.textColor,
					onFinished(part, phase) {phase.setPart(4)}
				}],
				phasePause: true
			}),
			new levelPart({
				wait: 2000,
				summons: [{what: GoGo}],
				nextPart: true
			}),
			new levelPart({
				wait: 3000,
				dialogue: [{
					text: "See, now this is more like it.",
					color: TopHat.textColor,
					onFinished(part, phase) {phase.setPart(6)}
				}],
				phasePause: true
			}),
			new levelPart({
				wait: 5000,
				dialogue: [{
					text: "Ok. I'm bored now...",
					color: TopHat.textColor
				}, {
					text: "SEND MORE!!!",
					color: TopHat.textColor,
					onFinished(part, phase) {phase.setPart(7)}
				}],
				phasePause: true
			}),
			new levelPart({
				wait: 3000,
				summons: [{what: GoGo, amount: 8}],
				nextPart: true
			}),
			new levelPart({
				wait: 10000,
				dialogue: [{
					text: "Hmm...",
					color: TopHat.textColor,
					continued: true
				}, {
					text: "Hmm... Well this is a bit unfair, isn't it?",
					color: TopHat.textColor,
					onFinished(part, phase) {phase.setPart(9)}
				}],
				phasePause: true
			}),
			new levelPart({
				wait: 5000,
				script() {enemies.clear()},
				dialogue: [{
					text: "Well that simply won't do.",
					color: TopHat.textColor,
					onFinished(part, phase) {phase.setPart(10)}
				}],
				phasePause: true
			}),
			new levelPart({
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
			})
		),
		new levelPhase(
			(phase) => {
				if(player && !player.alive) {
					player = new Player().spawn();
					player.skill = new Gun(player);
					if(hardcore)
						phase.reset()
				}
			},
			new levelPart({
				wait: 5000,
				dialogue: [{
					text: "Now, back to the carnage.",
					color: TopHat.textColor,
					onFinished(level, phase) {phase.setPart(1)}
				}],
				phasePause: true
			}),
			new levelPart({
				wait: 2000,
				summons: [{what: Chill, amount: 5}, {what: GoGo, amount: 5}],
				nextPart: true
			}),
			new levelPart({
				wait: 5000,
				script(part, phase) {if(!enemies.size) phase.setPart(3)}
			}),
			new levelPart({
				wait: 100,
				dialogue: [{
					text: "Wow, good job player",
					color: TopHat.textColor
				}, {
					text: "Welcome to Bullets 4.",
					color: TopHat.textColor,
					onFinished(part, phase) {phase.setPart(4)}
				}],
				phasePause: true
			}),
			new levelPart({
				saveData: {
					firstRun: false
				},
				mainMenu: true,
				endBgm: "Tutorial"
			})
		)
	),
	() => new levelReadable(
		(level) => {
			if(player && !player.alive) {
				level.currentPhase.reset();
				enemies.clear();
				exp.clear();
				player = Player.summon(new Player);
				game.reset();
			}
		},
		new levelPhase(
			new levelPart({
				setBackground: "level-1",
				summons: [{what: Player}, {what: TopHat, get params() {
					return [game.x2/4, game.y2/2]
				}}],
				nextPart: true
			}),
			new levelPart({
				dialogue: [{
					text: "So, your finally here.",
					color: TopHat.textColor,
					then: "nextPhase"
				}],
				partPause: true
			}),
		),
		new levelPhase(
			new levelPart({
				dialogue: [{
					text: "Well, let's not waste any time",
					color: TopHat.textColor,
					then: "nextPart"
				}],
				setEvent: {
					arena1: true
				},
				partPause: true
			}),
			new levelPart({
				summons: [{what: GoGo, amount: 8, get params() {
					if(!this.summoned) this.corners = [2, 2, 2, 2];
					let spaces = [
						[game.x2/6, game.y2/4],
						[game.x2/6, game.y2 * 3/4],
						[game.x2 * 5/6, game.y2/4],
						[game.x2 * 5/6, game.y2 * 3/4]
					]
					var a = 0;
					do var corner = floor(random(4));
					while(!this.corners[corner] && (++a < 1000));
					if(this.corners[corner]) --this.corners[corner];
					return spaces[corner];
				}}],
				waitUntilClear: true,
				startBgm: "Level-1"
			}),
		),
		new levelPhase(
			new levelPart({
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
			}),
			new levelPart({
				summons: [{what: Underbox, amount: 8, get params() {
					if(!this.summoned) this.corners = [2, 2, 2, 2];
					let spaces = [
						[game.x2/6, game.y2/4],
						[game.x2/6, game.y2 * 3/4],
						[game.x2 * 5/6, game.y2/4],
						[game.x2 * 5/6, game.y2 * 3/4]
					]
					var a = 0;
					do var corner = floor(random(4));
					while(!this.corners[corner] && (++a < 1000));
					if(this.corners[corner]) --this.corners[corner];
					return spaces[corner];
				}}],
				waitUntilClear: true
			}),
		),
		new levelPhase(
			new levelPart({
				dialogue: [{
					text: "All together now!",
					color: TopHat.textColor,
					then: "nextPart"
				}],
				partPause: true
			}),
			new levelPart({
				summons: [{what: GoGo, amount: 4, get params() {
					if(!this.summoned) this.corners = [1, 1, 1, 1];
					let spaces = [
						[game.x2/6, game.y2/4],
						[game.x2/6, game.y2 * 3/4],
						[game.x2 * 5/6, game.y2/4],
						[game.x2 * 5/6, game.y2 * 3/4]
					]
					var a = 0;
					do var corner = floor(random(4));
					while(!this.corners[corner] && (++a < 1000));
					if(this.corners[corner]) --this.corners[corner];
					return spaces[corner];
				}}, {what: Underbox, amount: 4, get params() {
					if(!this.summoned) this.corners = [1, 1, 1, 1];
					let spaces = [
						[game.x2/6, game.y2/4],
						[game.x2/6, game.y2 * 3/4],
						[game.x2 * 5/6, game.y2/4],
						[game.x2 * 5/6, game.y2 * 3/4]
					]
					var a = 0;
					do var corner = floor(random(4));
					while(!this.corners[corner] && (++a < 1000));
					if(this.corners[corner]) --this.corners[corner];
					return spaces[corner];
				}}],
				waitUntilClear: true
			}),
		),
		new levelPhase(
			new levelPart({
				setEvent: {arena1: true},
				dialogue: [{
					text: "Alright. Let's make this more interesting.",
					color: TopHat.textColor,
					then: "nextPart"
				}],
				partPause: true
			}),
			new levelPart({summons: [{what: Corner, amount: 8}, {what: Chill, amount: 8}], nextPart: true}),
			new levelPart({
				dialogue: [{
					text: "That should suffice.",
					color: TopHat.textColor,
					then: "nextPart"
				}],
				partPause: true
			}),
			new levelPart({
				summons: [{what: GoGo, amount: 4, get params() {
					if(!this.summoned) this.corners = [1, 1, 1, 1];
					let spaces = [
						[game.x2/6, game.y2/4],
						[game.x2/6, game.y2 * 3/4],
						[game.x2 * 5/6, game.y2/4],
						[game.x2 * 5/6, game.y2 * 3/4]
					]
					var a = 0;
					do var corner = floor(random(4));
					while(!this.corners[corner] && (++a < 1000));
					if(this.corners[corner]) --this.corners[corner];
					return spaces[corner];
				}}, {what: Underbox, amount: 4, get params() {
					if(!this.summoned) this.corners = [1, 1, 1, 1];
					let spaces = [
						[game.x2/6, game.y2/4],
						[game.x2/6, game.y2 * 3/4],
						[game.x2 * 5/6, game.y2/4],
						[game.x2 * 5/6, game.y2 * 3/4]
					]
					var a = 0;
					do var corner = floor(random(4));
					while(!this.corners[corner] && (++a < 1000));
					if(this.corners[corner]) --this.corners[corner];
					return spaces[corner];
				}}],
				waitUntilClear: true
			}),
			new levelPart({
				dialogue: [{
					text: "WHAT.",
					color: TopHat.textColor
				}, {
					text: "You seriously survived that?",
					color: TopHat.textColor,
					then: "nextPart"
				}],
				partPause: true
			}),
			new levelPart({
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
			})
		)
	),
	() => new levelReadable(
		(level) => {
			if(player && !player.alive) {
				level.currentPhase.reset();
				enemies.clear();
				exp.clear();
				player = Player.summon(new Player);
				game.reset();
			}
		},
		new levelPhase(
			new levelPart({
				summons: [{what: Player}, {what: Boss1}],
				waitUntilClear: true,
				startBgm: "Boss-1"
			}),
			new levelPart({
				dialogue: [{
					text: "Fine. You win.",
					color: TopHat.textColor
				}, {
					text: "Just you wait until I get some new recruits.",
					color: TopHat.textColor,
					then: "nextPart"
				}],
				phasePause: true
			})
		)
	)
];