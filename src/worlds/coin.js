import { Sound } from '../core/sound.js'
import { Entity } from '../entities/entity.js'
import { Loader } from '../loaders/index.js'

/**
 * @class
 * @extends Entity
 * @property {number} vy
 * @property {number} limit
 */
export class Coin extends Entity {
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

		super({ path, x, y, sprite: animation.frames[0] })

		this.activate()

		this.vy = -4
		this.limit = y

		this.setAnimation(animation)

		Sound.play(Sound.Name.coin)
	}

	/**
	 * When coin reach the limit, it will stop moving and clear animation
	 */
	update() {
		this.y += this.vy
		this.vy += 0.2

		if (this.y >= this.limit) {
			this.y = this.limit
			this.vy = 0

			this.clearAnimation()

			this.deactivate()
		}

		super.update()
	}
}