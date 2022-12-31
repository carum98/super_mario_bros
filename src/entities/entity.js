import { Sprite } from './sprite.js'

export class Entity extends Sprite {
	#debug = false
	#active = false

	get isActive() {
		return this.#active
	}

	/**
	 * Activate entity
	 */
	activate() {
		this.#active = true
	}

	/**
	 * Deactivate entity
	 */
	deactivate() {
		this.#active = false
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
	 * @param {boolean} [flip] - Flip the sprite horizontally
	 */
	draw(ctx, flip) {
		if (this.#active) {
			super.draw(ctx, flip)
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