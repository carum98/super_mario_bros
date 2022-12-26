import { Sprite } from '../core/sprite.js'
import { getSprite } from '../core/utils.js'

import SpritesData from '../../assets/sprites/tile.json' assert {type: 'json'}

/**
 * @class
 * @extends Sprite
 */
export class Pipe extends Sprite {
	/**
	 * @param {Object} data
	 * @param {number} data.x
	 * @param {number} data.y
	 */
	constructor({ x, y }) {
		const { src, sprites } = SpritesData

		const sprite = getSprite({ sprites, name: 'pipe' })

		super({ src, x, y, sprite })
	}
}