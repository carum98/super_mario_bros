import { Sprite } from '../entities/sprite.js'
import { Loader } from '../loaders/index.js'

/**
 * @class
 * @extends Sprite
 */
export class Mushroom extends Sprite {
	#debug = false
	#active = false

	/**
	 * @param {Object} param 
	 * @param {number} param.x
	 * @param {number} param.y
	 */
	constructor({ x, y }) {
		const { path, sprite } = Loader.Sprite.getSprite({
			src: Loader.Sprite.SRC.PLAYER,
			name: 'mushroom'
		})

		super({ path, x, y, sprite })
	}

	/**
	 * Trigger mushroom animation and activate it
	 */
	trigger() {
		this.#active = true
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