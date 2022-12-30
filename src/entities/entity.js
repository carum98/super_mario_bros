import { Sprite } from './sprite.js'

export class Entity extends Sprite {
	#debug = false
	#active = false

	get isActive() {
		return this.#active
	}

	/**
	 * Trigger mushroom animation and activate it
	 */
	trigger() {
		this.#active = true
	}

	/**
	 * When mushroom collide with player, it will be deactivated
	 */
	onCollide() {
		console.log('onCollide', this)
		this.#active = false
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