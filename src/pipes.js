import { Sprite } from './sprite.js'
import SpritesData from './sprites/tile.json' assert {type: 'json'}

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

		const sprite = sprites.find(s => s.name === 'pipe')?.frame

		super({ src, x, y, sprite })
	}
}