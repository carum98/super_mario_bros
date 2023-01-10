/**
 * @enum {number}
 * @readonly
 */
export const INCREASE_SCORE = {
	COIN: 200,
	BLOCK: 50,
	ENEMY: 100,
}

export class GameState {
	score = 0
	coins = 0

	level = 1
	world = 1

	lives = 3

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
	 * Reset game state
	 */
	reset() {
		this.score = 0
		this.coins = 0

		this.level = 1
		this.world = 1

		this.lives = 3
	}
}