/**@type {((level: {time: number, phase: number, said: number, pause(): void, say(said: number): void, set(phase: number): void}) => {})[]}*/
let levels = [
	function(level) {
		level.time += game.tick;
		switch(level.phase) {
			case(undefined):level.set(0);break;
			case(-1):break;
			case(0):{
				if(level.time > 1000) {
					dialogue("Wait...", "white", {continued: true});
					dialogue("Wait... Where's our player?", "white").then(() => {
						level.set(1);
					});
					level.pause();
				}
			}break;
			case(1):{
				if(keys.has("w") || keys.has("d") || keys.has("a") || keys.has("s")) level.move = true;
				if(level.time > 1000 && level.said == 0) {
					player = new Player
					assign(player, {
						x: 0, y: (innerHeight - player.size)/2,
						velocity: {x: player.size * 2, y: 0}
					});
					level.say(1);
				}
				if(level.time > 3000 && level.said == 1) {
					dialogue("Ah, there you are.", "white");
					dialogue("Welcome Player, welcome.", "white").then(() => level.set(2));
					level.pause();
				}
			}break;
			case(2):{
				if((keys.has("w") || keys.has("d") || keys.has("a") || keys.has("s")) || level.move) level.set(3);
				if(level.time > 5000 && level.said == 0) {
					dialogue("Um...", "white");
					dialogue("You are aware of how to move...", "white", {continued: true});
					dialogue("You are aware of how to move... Right Player?", "white").then(() => level.say(1));
					level.say(-1);
				}
				if(level.time > 5000 && level.said == 1) {
					dialogue("use W A S D", "white");
					level.say(-1);
				}
			}break;
			case(3):{
				delete level.move;
				if(level.time > 3000) {
					dialogue("I hope you're ready Player.", "white");
					dialogue("Bring on the PAIN!", "white").then(() => level.set(4));
					level.pause();
				}
			}break;
			case(4):{
				if(level.time > 2000 && level.said == 0)
					if(Enemy.summon(new Chill)) level.say(1);
				if(level.time > 3000 && level.said == 1) {
					dialogue("What?", "white");
					dialogue("What is this???", "white").then(() => level.say(2));
					level.say(-1);
				}
				if(level.time > 1000 && level.said == 2) {
					dialogue("I...", "white", {continued: true});
					dialogue("I... I don't understand.", "white");
					dialogue("You'd try for that to kill you!", "white").then(() => level.say(3));
					level.say(-1);
				}
				if(level.time > 3000 && level.said == 3) {
					dialogue("Come on now. Give me something better!", "white").then(() => level.set(5));
					level.pause();
				}
				if(!player.alive) {
					player = new Player().spawn();
					enemies = [];
					level.set(3);
				}
			}break;
			case(5):{
				if(level.time > 2000 && level.said == 0)
					if(Enemy.summon(new GoGo)) level.say(1);
				if(level.time > 1000 && level.said == 1) {
					level.say(-1);
					dialogue("See, now this is more like it.", "white").then(() => level.say(2))
				}
				if(level.time > 3000 && level.said == 2) {
					level.say(-1);
					dialogue("Ok. I'm bored now")
					dialogue("SEND MORE!!!").then(() => level.say(3));
					level.sum = 0;
				}
				if(level.time > 3000 && level.said == 3) {
					if(Enemy.summon(new GoGo)) level.sum++;
					if(level.sum == 8) level.say(4);
				}
				if(level.time > 10000 && level.said == 4) {
					level.say(-1); level.sum = 0;
					dialogue("Hmm...", "white", {continued: true});
					dialogue("Hmm... Well this is a bit unfair, isn't it?").then(() => level.say(5));
				}
				if(level.time > 5000 && level.said == 5) {
					enemies = []; level.pause();
					dialogue("Well, that simply won't do.", "white").then(() => level.set(6));
				}
				if(!player.alive) {
					player = new Player().spawn();
					enemies = [];
					level.set(3);
				}
			}break;
			case(6):{
				if(level.time > 1000 && level.said == 0) {
					level.say(-1);
					dialogue("Here, let's get you a gun.", "white").then(() => {
						level.say(1);
						player.skill = new Gun(player);
					});
				}
				if(level.time > 3000 && level.said == 1) {
					level.say(-1);
					dialogue("Now,", "white", {continued: true});
					dialogue("Now, back to the carnage.", "white").then(() => level.set(7));
				}
			}break;
			case(7):{
				if(level.time > 2000 && level.said == 0) {
					if(Enemy.summon(new Chill)) level.sum++;
					if(level.sum == 5) level.say(1);
				}
				if(level.said == 1) {
					if(Enemy.summon(new GoGo)) level.sum++;
					if(level.sum == 10) level.say(2);
				}
				if(!player.alive) {
					player = new Player().spawn();
					player.skill = Gun(player);
					enemies = [];
					level.set(6);
					level.say(1);
				}
				if(!enemies.length) level.set(7);
			}break;
			case(8):{
				if(this.time > 1000) {
					dialogue("Good job player. welcome to Bullets 4", "white").then(() => {
						
					});
				}
			}break;
		}
	},
	function(level) {
		level.time += game.tick;
		switch(level.phase) {
			case(undefined):level.set(0);break;
			case(-1):break;
			case(0):{

			}break;
		}
	}
]
function runLevel(levelNumber) {
	var level = levels[levelNumber];
	if(!level.set) {
		level.set = function(phase) {
			level.time = 0;
			level.said = 0;
			level.phase = phase;
		}
		level.pause = function() {level.phase = -1}
		level.say = function(said) {
			level.time = 0;
			level.said = said;
		}
	}
	level(level);
}