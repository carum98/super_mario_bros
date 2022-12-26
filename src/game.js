import { Map } from "./map.js"
import { Player } from "./player.js"

/**
 * @class
 * @property {Player} player
 * @property {CanvasRenderingContext2D} ctx
 * @property {Map} map
 */
export class Game {
	/**
	 * @param {Object} data
	 * @param {HTMLCanvasElement} data.canvas
	 * @param {Player} data.player
	 */
	constructor({ canvas, player }) {
		this.map = new Map({ canvas })
		this.player = player

		// Set player position
		this.player.y = canvas.height - this.player.height - 32

		this.ctx = canvas.getContext('2d')
	}

	render() {
		this.#update()
		this.#draw()
	}

	#update() {
		this.player.update()
	}

	#draw() {
		const { ctx, player, map } = this
		if (!ctx) return

		// Clear canvas
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

		// Draw game elements
		player.draw(ctx)
		map.draw(ctx)
	}
}