import { Map } from "../worlds/map.js"
import { Player } from "../characters/player.js"

/**
 * @class
 * @property {Player} player
 * @property {CanvasRenderingContext2D} ctx
 * @property {Map} map
 */
export class Game {
	#hitbox = false

	/**
	 * @param {Object} data
	 * @param {HTMLCanvasElement} data.canvas
	 * @param {Player} data.player
	 */
	constructor({ canvas, player }) {
		this.map = new Map({ canvas })
		this.player = player

		this.ctx = canvas.getContext('2d')
	}

	render() {
		this.#update()
		this.#draw()
	}

	#update() {
		this.player.update(this.map.tiles)
		this.map.update()

		if (this.ctx) {
			const middle = this.ctx.canvas.width / 3

			if (this.player.x > middle) {
				this.map.move()
				this.player.x = middle
			}
		}
	}

	#draw() {
		const { ctx, player, map } = this
		if (!ctx) return

		// Clear canvas
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

		// Draw game elements
		player.draw(ctx)
		map.draw(ctx)

		// Draw boxes
		if (this.#hitbox) {
			player.drawBox(ctx)
			player.drawBoxCollision(ctx)
		}
	}
}