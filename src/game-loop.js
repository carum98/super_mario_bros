export class GameLoop {
	#loopId = null
	#callback = null

	#fps = 60
	#then = 0
	#interval = 1000 / this.#fps

	constructor(callback) {
		this.#callback = callback
	}

	start() {
		this.#gameLoop(0)
	}

	stop() {
		cancelAnimationFrame(this.#loopId)
	}

	#gameLoop(timeStamp) {
		this.#loopId = requestAnimationFrame(this.#gameLoop.bind(this))

		const delta = timeStamp - this.#then

		if (delta >= this.#interval) {
			// console.log(Math.round(1000 / delta))

			this.#then = timeStamp - (delta % this.#interval)
			this.#callback()
		}
	}
}