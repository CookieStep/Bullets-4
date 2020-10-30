class Sound{
	/**@param {{volume: number}} options
	 * @param {{src: "Music/", type: ("audio/ogg" | "audio/wav" | "audio/mp3")}[]} sources*/
	constructor(options, ...sources) {
		this.options = options;
		this.sources = sources;
		sources.sort(() => random(2) - 1);
		let elements = [];
		let {volume=1} = options;
		for(let source of sources) {
			let element = document.createElement("audio");
			element.volume = volume;
			let child = document.createElement("source");
			Object.assign(child, source);
			element.appendChild(child);
			elements.push(element);
		}
		this.elements = elements;
	}
	get element() {return this.elements[floor(random(this.elements.length))]}
	play() {
		let {element} = this
		element.currentTime = 0;
		element.play();
	}
}
class Bgm{
	/**@param {{volume: number}} options
	 * @param {{src: "Music/...", type: ("audio/ogg" | "audio/wav" | "audio/mp3")}[]} sources*/
	constructor(options, ...sources) {
		this.options = options;
		this.sources = sources;
		sources.sort(() => random(2) - 1);
		let elements = [];
		let {volume=1} = options;
		let element = document.createElement("audio");
		element.volume = volume;
		element.loop = true;
		for(let source of sources) {
			let child = document.createElement("source");
			Object.assign(child, source);
			element.appendChild(child);
			elements.push(element)
		}
		this.element = element;
	}
	play() {
		let {element} = this
		if(!this.isPlaying) element.currentTime = 0;
		element.play();
		this.isPlaying = true;
	}
	pause() {
		this.element.pause();
	}
	resume() {
		if(this.isPlaying) this.element.play();
	}
	stop() {
		let {element} = this;
		element.pause();
		element.currentTime = 0;
		this.isPlaying = false;
	}
}
/**@type {Map<string, Bgm>}*/
let Music = new Map;
Music.set("Tutorial", new Bgm({volume: 1}, {
	src: "Music/TutorialMusic.wav",
	type: "audio/wav"
}));
Music.set("Level-1", new Bgm({volume: 1}, {
	src: "Music/Level1.wav",
	type: "audio/wav"
}));