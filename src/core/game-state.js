/**
 * @enum {number}
 * @readonly
 */
export const INCREASE_SCORE = {
	COIN: 200,
	BLOCK: 50,
	ENEMY: 100,
}

/**
 * @class
 * @property {number} score
 * @property {number} coins
 * @property {number} level
 * @property {number} world
 * @property {number} lives
 * @property {number} timer
 */
export class GameState {
	/** @type {number | null} */
	#intervalId = null

	score = 0
	coins = 0

	level = 1
	world = 1

	lives = 3

	timer = 0

	/**
	 * @param {INCREASE_SCORE} value 
	 */
	increaseScore(value) {
		this.score += value
	}

	/**
	 * @method	
	 */
	increaseCoins() {
		this.coins++

		this.increaseScore(INCREASE_SCORE.COIN)
	}

	/**
	 * @method
	 */
	decreaseLife() {
		this.lives--
	}

	/**
	 * Increase level and world
	 */
	nextLevel() {
		this.level++

		if (this.level > 3) {
			this.level = 1
			this.world++
		}
	}

	/**
	 * @method
	 */
	startTimer() {
		this.timer = 400

		this.#intervalId = setInterval(() => {
			this.timer--
		}, 1000)
	}

	/**
	 * @method
	 */
	stopTimer() {
		if (this.#intervalId !== null) {
			clearInterval(this.#intervalId)
			this.#intervalId = null
		}
	}

	/**
	 * Reset game state
	 */
	reset() {
		this.score = 0
		this.coins = 0

		this.level = 1
		this.world = 1

		this.lives = 3

		this.timer = 0
	}
}