import { Sprite } from '../core/sprite.js'
import { getAnimation, getSprite } from '../core/utils.js'

import SpritesData from '../../assets/sprites/tile.json' assert {type: 'json'}

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
		LUCKY: 'lucky',
	}

	/**
	 * @param {Object} data 
	 * @param {number} data.x
	 * @param {number} data.y
	 * @param {string} data.name
	 * @param {boolean} [data.isSolid]
	 */
	constructor({ x, y, name, isSolid = true }) {
		const { src, sprites, animations } = SpritesData


		if (isSolid) {
			const sprite = getSprite({ sprites, name })

			super({ src, x, y, sprite })
		} else {
			const { frames, speed } = getAnimation({ sprites, animations, name })
			const sprite = frames[0]

			super({ src, x, y, sprite })

			this.setAnimation({ frames, speed })
		}
	}
}