import { Sprite } from '../core/sprite.js'
import { Loader } from '../loaders/index.js'

/**
 * @class
 * @extends Sprite
 */
export class Tile extends Sprite {
	/**
	 * @readonly
	 * @enum {string}
	 */
	static TYPE = {
		CONCRETE: 'concrete',
		BRICK: 'brick',
		METAL: 'metal',
		HARD: 'hard',
		LUCKY: 'lucky',
	}

	/**
	 * @param {Object} param 
	 * @param {number} param.x
	 * @param {number} param.y
	 * @param {string} param.name
	 * @param {boolean} [param.isSolid]
	 */
	constructor({ x, y, name, isSolid = true }) {
		const loader = Loader.Sprite

		if (isSolid) {
			const { path, sprite } = loader.getSprite({ src: loader.SRC.TILE, name })

			super({ path, x, y, sprite })
		} else {
			const { path, animation } = loader.getAnimation({ src: loader.SRC.TILE, name })

			super({ path, x, y, sprite: animation.frames[0] })

			this.setAnimation(animation)
		}
	}

	hit() {
		this.y = -100
	}
}