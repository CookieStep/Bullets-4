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
	next() {this.phase++}
	run() {
		if(this.phase == -1 || this.paused) return;
		if(this.phase in this.phases)
			this.phases[this.phase].run(this)
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
	resetSummons() {
		this.parts.forEach(part => part.resetSummons());
	}
	reset() {
		this.part = 0;
		this.parts.forEach(part => part.reset());
	}
	next() {this.part++}
	/**@param {number} part*/
	setPart(part) {this.part = part; this.paused = false}
	/**@param {levelReadable} level*/
	run(level) {
		if(this.part == -1 || this.paused) return;
		if(this.part in this.parts)
			this.parts[this.part].run(this, level);
		if(typeof this.script == "function")
			this.script(this, level);
	}
}
class levelPart{
	/**@param {{
	 * 	wait?: number
	 * 	dialogue?: {
	 * 		text: string
	 * 		color: string
	 * 		continued?: boolean
	 * 		auto?: false
	 * 		onFinished?(part: levelPart, phase: levelPhase, level: levelReadable): void
	 *	}[]
	 * 	summons?: {enemy: typeof Enemy, amount: number}[]
	 * 	script?: (part: levelPart, phase: levelPhase, level: levelReadable): void
	 *  partPause?: true
	 * 	phasePause?: true
	 * 	levelPause?: true
	 * 	nextPart?: true
	 * 	nextPhase?: true
	 * 	mainMenu?: true
	 * 	startBgm?: string
	 * 	endBgm?: string
	}} options*/
	constructor(options) {
		var {
			wait=0,
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
			endBgm
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
		this.time = 0;
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
		var part = this;
		var canEnd = true;
		if(this.wait < this.time) {
			if(this.summons) this.summons.forEach(value => {
				var {enemy, amount=1} = value;
				if(!("summoned" in value)) value.summoned = 0;
				if(amount > value.summoned && Enemy.summon(new enemy)) ++value.summoned;
				if(amount > value.summoned) canEnd = false;
			});
			if(this.dialogue) this.dialogue.forEach(value => {
				var {text, color, continued, auto, onFinished} = value;
				var a = dialogue(text, color, {continued, auto});
				if(onFinished) a.then(() => onFinished(part, phase, level));
			});
			if(Music.has(this.startBgm)) Music.get(this.startBgm).play();
			if(Music.has(this.stopBgm)) Music.get(this.stopBgm).stop();
			if(typeof this.script == "function")
				this.script(this, phase, level);
			if(canEnd) {
				if(this.nextPart) phase.next();
				if(this.nextPhase) level.next();
				if(this.partPause) this.time = -1;
				if(this.phasePause) phase.paused = true;
				if(this.levelPause) level.paused = true;
				if(this.mainMenu) mainMenu.setup();
			}
		}
		if(this.time != -1) this.time += game.tick;
	}
}