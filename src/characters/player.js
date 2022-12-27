import { Controls } from '../core/controls.js'
import { Sprite } from '../core/sprite.js'
import { getAnimation, getSprite } from '../core/utils.js'

import SpritesData from '../../assets/sprites/player.json' assert {type: 'json'}

/**
 * @class
 * @extends Sprite
 * 
 * @property {number} vy
 * @property {number} speed
 * @property {Controls} controls
 * @property {PlayerStates} state
 * @property {Array<Sprite>} tiles
 */
export class Player extends Sprite {
	/**
	* @enum {string}
	*/
	static STATES = {
		IDLE: 'idle',
		RUNNING: 'run',
		JUMPING: 'jump',
	}

	constructor() {
		const { src, sprites } = SpritesData

		const state = Player.STATES.IDLE

		const sprite = getSprite({ sprites, name: `${state}-small` })

		super({ src, x: 0, y: 0, sprite })

		this.vy = 0
		this.speed = 2

		this.controls = new Controls()
		this.controls.startListening()

		this.state = state
	}

	/**
	 * @param {Array<Sprite>} tiles
	 */
	// @ts-ignore
	update(tiles) {
		const { keys } = this.controls
		const { bottom, top, right, left } = this.#collisions(tiles)

		// Horizontal movement
		const direction = keys[0]

		if (direction) {
			const { x } = Controls.AXIS[direction]
			this.x += x * this.speed
		}

		// Vertical movement
		if (keys.includes(Controls.DIRECTIONS.UP) && !!bottom) {
			this.vy = -8
		}

		this.y += this.vy

		if (!this.#collisions(tiles).bottom) {
			this.vy += 0.5
		} else {
			this.vy = 0
		}

		// State
		let lastState = this.state

		if (!!bottom) {
			this.state = direction ? Player.STATES.RUNNING : Player.STATES.IDLE
		} else {
			this.state = Player.STATES.JUMPING
		}

		// Animation
		if (lastState !== this.state) {
			this.setAnimation(
				getAnimation({ ...SpritesData, name: `${this.state}-small` })
			)
		}

		// Collision
		if (bottom && this.vy >= 0) {
			this.y = bottom.y - this.height
			this.vy = 0
		}

		if (direction) {
			if (right && direction === Controls.DIRECTIONS.RIGHT) {
				this.x = right.x - this.width
			}

			if (left && direction === Controls.DIRECTIONS.LEFT) {
				this.x = left.x + left.width
			}

			if (top && direction === Controls.DIRECTIONS.UP) {
				this.y = top.y + top.height
				this.vy = 0
			}
		}

		// Update sprite
		super.update()
	}

	/**
	 * @param {Array<Sprite>} tiles
	 * @returns {{bottom: Sprite | undefined, top: Sprite | undefined, left: Sprite | undefined, right: Sprite | undefined}}}
	 */
	#collisions(tiles) {
		const { x, y, width, height } = this

		const right = { x: x + width, y: y + height / 4, width: width / 4, height: height / 2 }
		const bottom = { x: x + width / 4, y: y + height, width: width / 2, height: height / 4 }
		const top = { x: x + width / 4, y: y - height / 4, width: width / 2, height: height / 4 }
		const left = { x: x - width / 4, y: y + height / 4, width: width / 4, height: height / 2 }

		return {
			bottom: this.#collideBox(bottom, tiles),
			top: this.#collideBox(top, tiles),
			left: this.#collideBox(left, tiles),
			right: this.#collideBox(right, tiles),
		}
	}

	/**
	 * @param {Object} box 
	 * @param {Array<Sprite>} tiles 
	 * @returns {Sprite | undefined}
	 */
	#collideBox(box, tiles) {
		return tiles.find((tile) => this.#collideTile(box, tile))
	}

	/**
	 * @param {Object} box 
	 * @param {Sprite} tile 
	 * @returns {boolean}
	 */
	#collideTile(box, tile) {
		return (
			box.x < tile.x + tile.width &&
			box.x + box.width > tile.x &&
			box.y < tile.y + tile.height &&
			box.y + box.height > tile.y
		)
	}
}