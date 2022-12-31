import { PowerUp } from '../entities/power-up.js'

/**
 * @class
 * @extends PowerUp
 */
export class Mushroom extends PowerUp {
	/**
	 * @param {Object} param 
	 * @param {number} param.x
	 * @param {number} param.y
	 */
	constructor({ x, y }) {
		super({ x, y, type: PowerUp.TYPES.MUSHROOM })
	}
}