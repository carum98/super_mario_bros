export class Sound {
	/**
	 * @readonly
	 * @enum {Symbol}
	 */
	static Name = {
		coin: Symbol('coin'),
		jump: Symbol('jump'),
		powerup: Symbol('powerup'),
		die: Symbol('die'),
		bump: Symbol('bump'),
		break: Symbol('break'),
		stomp: Symbol('stomp'),
		goal: Symbol('goal'),
		fireball: Symbol('fireball'),
		powerupAppears: Symbol('powerup-appears'),
		powerdown: Symbol('powerdown'),
		pipeTravel: Symbol('pipe-travel'),
		overworld: Symbol('overworld'),
		background: Symbol('background'),
	}

	static #sounds = {
		[Sound.Name.coin]: new Audio('./assets/sounds/coin.wav'),
		[Sound.Name.jump]: new Audio('./assets/sounds/jump-small.wav'),
		[Sound.Name.die]: new Audio('./assets/sounds/mariodie.wav'),
		[Sound.Name.powerup]: new Audio('./assets/sounds/powerup.wav'),
		[Sound.Name.bump]: new Audio('./assets/sounds/bump.wav'),
		[Sound.Name.break]: new Audio('./assets/sounds/breakblock.wav'),
		[Sound.Name.stomp]: new Audio('./assets/sounds/stomp.wav'),
		[Sound.Name.goal]: new Audio('./assets/sounds/goal.wav'),
		[Sound.Name.fireball]: new Audio('./assets/sounds/fireball.wav'),
		[Sound.Name.powerupAppears]: new Audio('./assets/sounds/powerup-appears.wav'),
		[Sound.Name.powerdown]: new Audio('./assets/sounds/powerdown.wav'),
		[Sound.Name.pipeTravel]: new Audio('./assets/sounds/powerdown.wav'),
		[Sound.Name.overworld]: new Audio('./assets/sounds/overworld.mp3'),
		[Sound.Name.background]: new Audio('./assets/sounds/background.mp3'),
	}

	/**
	 * @param {Name} Name
	 * @returns {void}
	 */
	static play(Name) {
		const sound = Sound.#sounds[Name]

		if (sound) {
			sound.volume = 0.1
			sound.play()
		}
	}

	/**
	 * @param {Name} Name
	 * @returns {void}
	 */
	static stop(Name) {
		const sound = Sound.#sounds[Name]

		if (sound) {
			sound.pause()
			sound.currentTime = 0
		}
	}

	/**
	 * @param {Name} Name
	 * @returns {HTMLAudioElement} Audio
	 */
	static backgroundMusic(Name) {
		const music = Sound.#sounds[Name]
		music.volume = 0.2
		music.loop = true

		return music
	}
}