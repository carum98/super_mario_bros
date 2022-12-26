import { Sprite } from './sprite.js'
import { getSprite } from './utils.js'

import SpritesData from './sprites/tile.json' assert {type: 'json'}

/**
 * @class
 * @extends Sprite
 */
export class Tile extends Sprite {
	static TYPE = {
		CONCRETE: 'concrete',
		BRICK: 'brick',
		metal: 'metal',
		hard: 'hard',
	}

	/**
	 * @param {Object} data 
	 * @param {number} data.x
	 * @param {number} data.y
	 * @param {string} data.name
	 */
	constructor({ x, y, name }) {
		const { src, sprites } = SpritesData

		const sprite = getSprite({ sprites, name })

		super({ src, x, y, sprite })
	}
}