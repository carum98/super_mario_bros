export class GameLoop {
	/**
	 * @type {number | null}
	 */
	#loopId = null

	/**
	 * @type {Function | null}
	 */
	#callback = null

	#fps = 60
	#then = 0
	#interval = 1000 / this.#fps

	/**
	 * @param {Function} callback
	 */
	constructor(callback) {
		this.#callback = callback
	}

	/**
	 * Start the game loop
	 */
	start() {
		this.#gameLoop(0)
	}

	/**
	 * Stop the game loop
	 */
	stop() {
		if (this.#loopId !== null) {
			cancelAnimationFrame(this.#loopId)
		}
	}

	/**
	 * @param {DOMHighResTimeStamp} timeStamp
	 */
	#gameLoop(timeStamp) {
		this.#loopId = requestAnimationFrame(this.#gameLoop.bind(this))

		const delta = timeStamp - this.#then

		if (delta >= this.#interval) {
			// console.log(Math.round(1000 / delta))

			this.#then = timeStamp - (delta % this.#interval)

			if (this.#callback !== null) {
				this.#callback()
			}
		}
	}
}