import { Sound } from '../core/sound.js'
import { Sprite } from '../entities/sprite.js'
import { Loader } from '../loaders/index.js'

const emptySprite = { x: -20, y: -20, w: 16, h: 16 }

/**
 * @class
 * @extends Sprite
 * @property {number} vy
 * @property {number} limit
 * @property {{ frames: Frame[], speed: number }} animation
 */
export class Coin extends Sprite {
	#debug = false
	#active = false

	/**
	 * @param {Object} data 
	 * @param {number} data.x
	 * @param {number} data.y
	 */
	constructor({ x, y }) {
		const { path, animation } = Loader.Sprite.getAnimation({
			src: Loader.Sprite.SRC.PLAYER,
			name: 'coin'
		})

		super({ path, x, y, sprite: emptySprite })

		this.animation = animation
		this.vy = 0
		this.limit = y
	}

	/**
	 * Update coin position only if it's active.
	 * When coin reach the limit, it will stop moving and clear animation
	 */
	update() {
		if (this.#active) {
			this.y += this.vy
			this.vy += 0.2

			if (this.y >= this.limit) {
				this.y = this.limit
				this.vy = 0

				this.clearAnimation()

				this.sprite = emptySprite
				this.#active = false
			}

			super.update()
		}
	}

	/**
	 * Trigger coin animation and activate it
	 */
	trigger() {
		this.#active = true

		const { frames, speed } = this.animation

		this.vy = -4
		this.setAnimation({ frames, speed })

		Sound.play(Sound.Name.coin)
	}

	/**
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw(ctx) {
		if (this.#active) {
			super.draw(ctx)
		}

		if (this.#debug) {
			this.drawContainer(ctx)
		}
	}

	/**
	 * Switch debug mode to show grid
	 */
	toogleDebug() {
		this.#debug = !this.#debug
	}
}