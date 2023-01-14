import { Sound } from '../core/sound.js'
import { Entity } from '../entities/entity.js'
import { Loader } from '../loaders/index.js'

/**
 * @class
 * @extends Entity
 */
export class BigCoin extends Entity {
	/**
	 * @param {Object} data 
	 * @param {number} data.x
	 * @param {number} data.y
	 */
	constructor({ x, y }) {
		const { path, animation } = Loader.Sprite.getAnimation({
			src: Loader.Sprite.SRC.TILE,
			name: 'coin'
		})

		super({ path, x, y, sprite: animation.frames[0] })

		this.setAnimation(animation)

		this.activate()
	}

	deactivate() {
		Sound.play(Sound.Name.coin)

		super.deactivate()
	}
}