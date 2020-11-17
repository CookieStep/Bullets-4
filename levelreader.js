class levelReadable{
	/**@param {(level: levelReadable) => void} script
	 * @param {levelPhase[]} phases*/
	constructor(script, ...phases) {
		if(script instanceof levelPhase) phases.unshift(script);
		else if(script) this.script = script;
		this.phases = phases;
		this.phase = 0;
	}
	/**@param {number} phase*/
	setPhase(phase) {this.phase = phase; this.paused = false}
	get currentPhase() {return this.phases[this.phase]}
	next() {this.phase++}
	run() {
		if(this.phase == -1 || this.paused) return;
		if(this.currentPhase)
			this.currentPhase.run(this);
		if(typeof this.script == "function")
			this.script(this);
	}
}
class levelPhase{
	/**@param {(phase: levelPhase, level: levelReadable) => void} script
	 * @param {levelPart[]} parts*/
	constructor(script, ...parts) {
		if(script instanceof levelPart) parts.unshift(script);
		else if(script) this.script = script;
		this.parts = parts;
		this.part = 0;
	}
	get currentPart() {return this.parts[this.part]}
	resetSummons() {
		this.parts.forEach(part => part.resetSummons());
	}
	reset() {
		this.part = 0;
		this.parts.forEach(part => part.reset());
	}
	next() {++this.part}
	/**@param {number} part*/
	setPart(part) {this.part = part; this.paused = false}
	/**@param {levelReadable} level*/
	run(level) {
		if(this.part == -1 || this.paused) return;
		if(this.currentPart) this.currentPart.run(this, level);
		else level.next();
		if(typeof this.script == "function")
			this.script(this, level);
	}
}
class levelPart{
	/**@param {{
	 * 	wait?: number
	 * 	delay?: number
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
			wait=0,
			delay=0,
			dialogue=[],
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
		this.delay = delay;
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
		if((scoreAttack || speedrun) && this.mainMenu) {
			this.mainMenu = false;
			this.nextLevel = true;
		}
	}
	resetSummons() {
		if(this.summons) this.summons.forEach(value => value.summoned = 0);
	}
	reset() {
		this.time = 0;
		this.resetSummons();
	}
	/**@param {levelPhase} phase @param {levelReadable} level*/
	run(phase, level) {
		function runThen(then) {
			switch(then) {
				case "nextPart":
					phase.next();
				break;
				case "nextPhase":
					level.next();
				break;
				case "nextLevel":
					nextLevel();
				break;
			}
		}
		function nextLevel() {
			++game.level;
			levelMenu.selected = game.level;
			levelMenu.items2 = [...levelMenu.items];
			if(levelMenu.selected in levelMenu.items2) {
				levelMenu.create(false);
				clearBad();
			}else{
				levels = [];
				mainMenu.setup();
			}
		}
		var part = this;
		var canEnd = true;
		if((speedrun || this.wait < this.time) && this.delay < this.time) {
			if(this.summons) this.summons.forEach(value => {
				var {what, amount=1, params=[]} = value;
				if(!("summoned" in value)) value.summoned = 0;
				if(amount > value.summoned && what.summon(new what, ...params)) ++value.summoned;
				if(amount > value.summoned) canEnd = false;
			});
			if(this.dialogue && !speedrun) this.dialogue.forEach(value => {
				var {text, color, continued, auto, onFinished, then} = value;
				var a = dialogue(text, color, {continued, auto});
				if(onFinished || then) a.then(() => {
					if(onFinished) onFinished(part, phase, level)
					if(then) runThen(then);
				});
			});
			if(Music.has(this.startBgm)) Music.get(this.startBgm).play();
			if(Music.has(this.endBgm)) Music.get(this.endBgm).stop();
			if(this.setBackground) backgroundName = this.setBackground;
			if(typeof this.script == "function") {
				if(this.script(this, phase, level)) canEnd = false;
			}
			if(canEnd) {
				if(this.saveData) {
					let keys = Object.keys(this.saveData);
					for(let key of keys) {
						let val = this.saveData[key];
						data[key] = val;
					}
				}
				if(this.setEvent) {
					let keys = Object.keys(this.setEvent);
					for(let key of keys) {
						let val = this.setEvent[key];
						game.event[key] = val;
					}
				}
				if(speedrun && this.dialogue) this.dialogue.forEach(value => {
					if(value.onFinished) value.onFinished(part, phase, level);
					if(value.then) runThen(value.then);
				});
				if(this.nextPart) phase.next();
				if(this.nextPhase) level.next();
				if(this.partPause) this.time = -1;
				if(this.phasePause) phase.paused = true;
				if(this.levelPause) level.paused = true;
				if(this.levelComplete) data.clearedIds[game.levelId] = true;
				if(this.nextLevel) nextLevel();
				if(this.mainMenu) {
					levels = [];
					mainMenu.setup();
				}
				if(this.waitUntilClear && !enemies.size && !particles.size) phase.next();
			}
		}
		if(this.time != -1) this.time += game.tick;
	}
}