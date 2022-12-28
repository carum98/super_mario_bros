import { Map } from "../worlds/map.js"
import { Player } from "../characters/player.js"

/**
 * @class
 * @property {Player} player
 * @property {CanvasRenderingContext2D} ctx
 * @property {Map} map
 */
export class Game {
	#timeUpdate = 0
	#timeDraw = 0

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
		const now = performance.now()
		this.#update()
		this.#timeUpdate = performance.now() - now

		const now2 = performance.now()
		this.#draw()
		this.#timeDraw = performance.now() - now2
	}

	#update() {
		this.player.update(this.map.tiles)
		this.map.update()

		if (this.ctx) {
			const middle = this.ctx.canvas.width / 4

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
		map.draw(ctx)
		player.draw(ctx)
	}

	/**
	 * Expose params for debug
	 */
	get debugParams() {
		return {
			timeUpdate: this.#timeUpdate.toFixed(5) + 'ms',
			timeDraw: this.#timeDraw.toFixed(5) + 'ms',
		}
	}
}