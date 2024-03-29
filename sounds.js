class Sound{
	/**@param {{volume: number}} options
	 * @param {{src: "SFX/", type: ("audio/ogg" | "audio/wav" | "audio/mp3")}[]} sources*/
	constructor(options, ...sources) {
		this.options = options;
		sources.concat(sources);
		sources.concat(sources);
		sources.sort(() => random(2) - 1);
		this.sources = sources;
		let elements = [];
		let {volume=1} = options;
		this.volume = volume;
		for(let source of sources) {
			let element = document.createElement("audio");
			element.volume = volume;
			let child = document.createElement("source");
			Object.assign(child, source);
			element.appendChild(child);
			elements.push(element);
		}
		this.elements = elements;
		this.loaded = 0;
		this.elements.forEach(element => element.oncanplaythrough = () => ++this.loaded);
	}
	get isLoaded() {return this.loaded == this.elements.length}
	get element() {return this.elements[floor(random(this.elements.length))]}
	play() {
		let {element} = this
		element.currentTime = 0;
		element.play();
	}
	update() {this.elements.forEach(element =>
		element.volume = this.volume * Sound.volume
	)}
	static _volume = 1;
	static set volume(val) {
		this._volume = val;
		SFX.forEach(sfx => sfx.update());
	}
	static get volume() {return this._volume}
}
class Bgm{
	/**@param {{volume: number}} options
	 * @param {{src: "Music/...", type: ("audio/ogg" | "audio/wav" | "audio/mp3")}[]} sources*/
	constructor(options, ...sources) {
		this.options = options;
		this.sources = sources;
		sources.sort(() => random(2) - 1);
		let {volume=1} = options;
		this.volume = volume * Bgm.volume;
		let element = document.createElement("audio");
		element.volume = volume;
		element.loop = true;
		for(let source of sources) {
			let child = document.createElement("source");
			Object.assign(child, source);
			element.appendChild(child);
		}
		this.element = element;
		this.element.oncanplaythrough = () => this.isLoaded = true;
	}
	play() {
		let {element} = this
		if(!this.isPlaying) element.currentTime = 0;
		element.play();
		this.isPlaying = true;
	}
	pause() {if(this.isPlaying) this.element.pause()}
	resume() {if(this.isPlaying) this.element.play()}
	stop() {
		let {element} = this;
		element.pause();
		element.currentTime = 0;
		this.isPlaying = false;
	}
	update() {this.element.volume = this.volume * Bgm.volume}
	static _volume = 1;
	static set volume(val) {
		this._volume = val;
		Music.forEach(bgm => bgm.update());
	}
	static get volume() {return this._volume}
}
/**@type {Map<string, Bgm>}*/
var Music = new Map;
Music.set("Tutorial", new Bgm({volume: 1}, {
	src: "Music/TutorialMusic.wav",
	type: "audio/wav"
}));
Music.set("Level-1", new Bgm({volume: 1}, {
	src: "Music/Level1.wav",
	type: "audio/wav"
}));
Music.set("MainMenu", new Bgm({volume: 1}, {
	src: "Music/MainMenu.wav",
	type: "audio/wav"
}));
Music.set("Catalog", new Bgm({volume: 1}, {
	src: "Music/Catalog.wav",
	type: "audio/wav"
}));
Music.set("Boss-1", new Bgm({volume: 1}, {
	src: "Music/Boss1.wav",
	type: "audio/wav"
}));
Music.set("Options", new Bgm({volume: 1}, {
	src: "Music/Options.wav",
	type: "audio/wav"
}));
Music.set("Level-2", new Bgm({volume: 1}, {
	src: "Music/Level2.wav",
	type: "audio/wav"
}));
/**@type {Map<string, Sound>}*/
var SFX = new Map;
SFX.set("Death", new Sound({volume: 0.5}, {src: "SFX/Death.wav", type: "audio/wav"}));
SFX.set("Hit", new Sound({volume: 1}, {src: "SFX/Hit.wav", type: "audio/wav"}, {src: "SFX/Hit2.wav", type: "audio/wav"}, {src: "SFX/Hit3.wav", type: "audio/wav"}, {src: "SFX/Hit4.wav", type: "audio/wav"}));
SFX.set("PowerUp", new Sound({volume: 1}, {src: "SFX/PowerUp.wav", type: "audio/wav"}));
SFX.set("Shoot", new Sound({volume: 0.5}, {src: "SFX/Shoot.wav", type: "audio/wav"}, {src: "SFX/Shoot2.wav", type: "audio/wav"}, {src: "SFX/Shoot3.wav", type: "audio/wav"}));
SFX.set("Spawn", new Sound({volume: 1}, {src: "SFX/Spawn.wav", type: "audio/wav"}, {src: "SFX/Spawn2.wav", type: "audio/wav"}, {src: "SFX/Spawn3.wav", type: "audio/wav"}));
SFX.set("Text", new Sound({volume: 0}, {src: "SFX/Text.wav", type: "audio/wav"}));
SFX.set("Wall", new Sound({volume: 0.25}, {src: "SFX/Wall.wav", type: "audio/wav"}, {src: "SFX/Wall2.wav", type: "audio/wav"}, {src: "SFX/Wall3.wav", type: "audio/wav"}));
SFX.set("Xp", new Sound({volume: 0.25}, {src: "SFX/Xp.wav", type: "audio/wav"}, {src: "SFX/Xp2.wav", type: "audio/wav"}, {src: "SFX/Xp3.wav", type: "audio/wav"}, {src: "SFX/Xp4.wav", type: "audio/wav"}, {src: "SFX/Xp5.wav", type: "audio/wav"}));

Bgm.volume = .25;
Sound.volume = .25;
