import { Sprite } from '../entities/sprite.js'
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
	 * @param {string} param.name
	 */
	constructor({ x, y, name }) {
		const { path, sprite } = Loader.Sprite.getSprite({
			src: Loader.Sprite.SRC.TILE,
			name
		})

		super({ path, x, y, sprite })
	}
}