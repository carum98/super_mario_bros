import { Controls } from './controls.js'
import { Sprite } from './sprite.js'
import SpritesData from './sprites/player.json' assert {type: 'json'}

/**
 * @class
 * @extends Sprite
 * 
 * @property {number} vy
 * @property {number} speed
 * @property {Controls} controls
 * @property {PlayerStates} state
 */
export class Player extends Sprite {
	/**
	* @enum {string}
	*/
	static STATES = {
		IDLE: 'idle',
		RUNNING: 'running',
		JUMPING: 'jumping',
	}

	constructor() {
		const { src, sprites } = SpritesData

		const sprite = sprites.find(s => s.name === 'idle-small')?.frame

		super({ src, x: 0, y: 0, sprite })

		this.vy = 0
		this.speed = 3

		this.controls = new Controls()
		this.controls.startListening()

		this.state = Player.STATES.IDLE
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

		// State
		if (this.onGround()) {
			if (direction) {
				this.state = Player.STATES.RUNNING
			} else {
				this.state = Player.STATES.IDLE
			}
		} else {
			this.state = Player.STATES.JUMPING
		}
	}

	onGround() {
		// @ts-ignore
		return this.y >= canvas.height - this.height - 32
	}
}