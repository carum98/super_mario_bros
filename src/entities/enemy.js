
import { Player } from '../characters/player.js'
import { Controls } from '../core/controls.js'
import { MovementController } from '../core/movement.js'
import { Entity } from './entity.js'
import { Sprite } from './sprite.js'

export class Enemy extends Entity {
	#dead = false
	direction = Controls.DIRECTIONS.LEFT

	/**
	 * @param {HTMLCanvasElement} canvas 
	 * @param {Array<Sprite>} tiles
	 * @override
	 */
	// @ts-ignore
	update(canvas, tiles) {
		if (this.isActive && !this.#dead) {
			this.#move(tiles)

			super.update()
		} else {
			if (this.x < canvas.width) {
				this.trigger()
			}
		}

		// Check if enemy is out of canvas
		if (this.x < -this.width) {
			this.#dead = true
		}
	}

	/**
	 * If the enemy is killed, it will be marked as dead and will not be updated
	 */
	killed() {
		this.#dead = true

		this.clearAnimation()
	}

	/**
	   * @param {Player} player 
	   * @returns {boolean} true if player is killed, false if enemy is killed
	   */
	checkCollidePosition(player) {
		if (player.y + player.height < this.y + this.height / 2) {
			console.log('kill enemy')

			return false
		} else {
			console.log('kill player')

			return true
		}
	}

	/**
	 * @param {Array<Sprite>} tiles
	 */
	#move(tiles) {
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
	}
}