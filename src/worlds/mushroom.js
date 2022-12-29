import { Sprite } from '../core/sprite.js'
import { getSprite } from '../core/utils.js'

import SpritesData from '../../assets/sprites/player.json' assert {type: 'json'}

/**
 * @class
 * @extends Sprite
 */
export class Mushroom extends Sprite {
	#debug = false
	#active = false

	constructor({ x, y }) {
		const { src, sprites } = SpritesData

		const sprite = getSprite({ sprites, name: 'mushroom' })

		super({ src, x, y, sprite })
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