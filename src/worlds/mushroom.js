import { Controls } from '../core/controls.js'
import { MovementController } from '../core/movement.js'
import { PowerUp } from '../entities/power-up.js'
import { Sprite } from '../entities/sprite.js'

/**
 * @class
 * @extends PowerUp
 */
export class Mushroom extends PowerUp {
	direction = Controls.DIRECTIONS.RIGHT

	/**
	 * @param {Object} param 
	 * @param {number} param.x
	 * @param {number} param.y
	 */
	constructor({ x, y }) {
		super({ x, y, type: PowerUp.TYPES.MUSHROOM })
	}

	/**
	 * @param {Sprite[]} tiles 
	 */
	move(tiles) {
		const { bottom, left, right } = MovementController.collisions(this, tiles)

		if (!bottom) {
			this.direction = Controls.DIRECTIONS.DOWN
		}

		if (left) {
			this.direction = Controls.DIRECTIONS.RIGHT
		}

		if (right) {
			this.direction = Controls.DIRECTIONS.LEFT
		}

		const { x, y } = Controls.AXIS[this.direction]

		this.x += x / 2
		this.y += y

		super.update()
	}
}