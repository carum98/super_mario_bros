import { Map } from "../worlds/map.js"
import { Player } from "../characters/player.js"
import { Information } from "../ui/information.js"
import { Mushroom } from "../worlds/mushroom.js"

/**
 * @class
 * @property {CanvasRenderingContext2D} ctx
 * @property {Player} player
 * @property {Map} map
 * @property {Information} information
 * @property {Entity[]} entities
 * @property {number} score
 * @property {number} coins
 * @property {string} level
 * @property {number} timer
 */
export class Game {
	#timeUpdate = 0
	#timeDraw = 0
	#timeStart = 0

	/**
	 * @param {Object} data
	 * @param {HTMLCanvasElement} data.canvas
	 */
	constructor({ canvas }) {
		const now = performance.now()

		this.ctx = canvas.getContext('2d')

		this.map = new Map({ canvas })
		this.player = new Player({ game: this })

		this.score = 0
		this.coins = 0
		this.level = '1 - 1'
		this.timer = 400

		this.information = new Information({ game: this })

		this.entities = []

		this.#timeStart = performance.now() - now
	}

	render() {
		const now = performance.now()
		this.#update()
		this.#timeUpdate = performance.now() - now

		const now2 = performance.now()
		this.#draw()
		this.#timeDraw = performance.now() - now2

		this.#checkCollision()
	}

	#update() {
		this.player.update()
		this.map.update()
		this.information.update()

		if (this.ctx) {
			const middle = this.ctx.canvas.width / 4

			if (this.player.x > middle) {
				this.map.move()
				this.player.x = middle
			}
		}
	}

	#draw() {
		const { ctx, player, map, information } = this
		if (!ctx) return

		// Clear canvas
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

		// Draw game elements
		map.draw(ctx)
		player.draw(ctx)
		information.draw(ctx)
	}

	#checkCollision() {
		const { player, entities } = this

		if (entities.length === 0) return

		entities.forEach((entity) => {
			if (player.conllidesWith(entity)) {
				entity.onCollide()

				// Remove entity from array
				const index = entities.indexOf(entity)
				entities.splice(index, 1)

				// Add power up to player
				if (entity.powerUp) {
					player.powerUp = entity.powerUp
				}

				// Change all mushrooms to fire flower
				if (entity instanceof Mushroom) {
					this.map.toogleMushroomsToFireFlower()
				}
			}
		})
	}

	/**
	 * Expose params for debug
	 * @returns {GameDebugParams} GameDebugParams
	 */
	get debugParams() {
		return {
			timeUpdate: this.#timeUpdate.toFixed(5) + 'ms',
			timeDraw: this.#timeDraw.toFixed(5) + 'ms',
			timeStart: this.#timeStart.toFixed(5) + 'ms',
		}
	}
}