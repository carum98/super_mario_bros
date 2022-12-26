import { Controls } from './controls.js'
import { Sprite } from './sprite.js'
import { getAnimation, getSprite } from './utils.js'

import SpritesData from './sprites/player.json' assert {type: 'json'}

/**
 * @class
 * @extends Sprite
 * 
 * @property {number} vy
 * @property {number} speed
 * @property {HTMLCanvasElement} canvas
 * @property {Controls} controls
 * @property {PlayerStates} state
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

	/**
	 * @param {Object} data
	 * @param {HTMLCanvasElement} data.canvas
	 */
	constructor({ canvas }) {
		const { src, sprites } = SpritesData

		const state = Player.STATES.IDLE

		const sprite = getSprite({ sprites, name: `${state}-small` })

		super({ src, x: 0, y: 0, sprite })

		this.vy = 0
		this.speed = 2

		this.controls = new Controls()
		this.controls.startListening()

		this.canvas = canvas
		this.state = state
	}

	update() {
		const { keys } = this.controls

		// Horizontal movement
		const direction = keys[0]

		if (direction) {
			const { x } = Controls.AXIS[direction]

			this.x += x * this.speed
		}

		// Vertical movement
		if (keys.includes(Controls.DIRECTIONS.UP) && this.onGround()) {
			this.vy = -8
		}

		this.y += this.vy

		if (!this.onGround()) {
			this.vy += 0.5
		} else {
			this.vy = 0
		}

		let lastState = this.state

		// State
		if (this.onGround()) {
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

		// Update sprite
		super.update()
	}

	onGround() {
		const { canvas } = this

		return this.y >= canvas.height - this.height - 32
	}
}