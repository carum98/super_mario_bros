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
	 * @param {{ map: string, direction: string, column: number, x: number, y: number }} [param.transport]
	 */
	constructor({ x, y, name, transport }) {
		const { path, sprite } = Loader.Sprite.getSprite({
			src: Loader.Sprite.SRC.TILE,
			name
		})

		super({ path, x, y, sprite })

		this.transport = transport
	}
}