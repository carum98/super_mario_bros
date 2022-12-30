import { Sprite } from '../core/sprite.js'
import { Loader } from '../loaders/index.js'

/**
 * @class
 * @extends Sprite
 */
export class Pipe extends Sprite {
	/**
	 * @param {Object} param
	 * @param {number} param.x
	 * @param {number} param.y
	 */
	constructor({ x, y }) {
		const { path, sprite } = Loader.Sprite.getSprite({
			src: Loader.Sprite.SRC.TILE,
			name: 'pipe'
		})

		super({ path, x, y, sprite })
	}
}