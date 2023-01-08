import { Controls } from '../core/controls.js'
import { Sprite } from '../entities/sprite.js'
import { Game } from '../core/game.js'
import { Loader } from '../loaders/index.js'
import { Sound } from '../core/sound.js'
import { FireBall } from '../worlds/fireball.js'

/**
 * @class
 * @extends Sprite
 * 
 * @property {number} vy
 * @property {number} speed
 * @property {Controls} controls
 * @property {Player.STATES} state
 * @property {Player.POWER_UPS} power_up
 * @property {Array<Sprite>} tiles
 * @property {Array<FireBall>} fireballs
 */
export class Player extends Sprite {
	#debug = false

	/**
	* @readonly
	* @enum {string} States of the player
	* @property {string} IDLE - Player is idle (not moving)
	* @property {string} RUNNING - Player is running (moving horizontally)
	* @property {string} JUMPING - Player is jumping (moving vertically)
	*/
	static STATES = {
		IDLE: 'idle',
		RUNNING: 'run',
		JUMPING: 'jump',
	}

	/**
	 * @readonly
	 * @enum {string} Power ups of the player
	 * @property {string} NONE - Player has no power up
	 * @property {string} MUSHROOM - Player has a mushroom power up
	 * @property {string} FIRE_FLOWER - Player has a fire flower power up
	 * @property {string} STAR - Player has a star power up
	 */
	static POWER_UPS = {
		NONE: 'small',
		MUSHROOM: 'big',
		FIRE_FLOWER: 'fire',
		STAR: 'star',
	}

	/**
	 * @param {Object} data
	 * @param {Game} data.game
	 */
	constructor({ game }) {
		const state = Player.STATES.IDLE
		const powerUp = Player.POWER_UPS.NONE

		const { path, sprite } = Loader.Sprite.getSprite({
			name: `${state}-${powerUp}`,
			src: Loader.Sprite.SRC.PLAYER,
		})

		const height = game.ctx?.canvas.height || 0

		super({ path, x: 0, y: height - (32 + sprite.h), sprite })

		this.game = game

		this.vy = 0
		this.speed = 1.5

		this.controls = new Controls()
		this.controls.startListening()

		this.state = state
		this.powerUp = powerUp

		this.fireballs = []

		document.addEventListener('keydown', (e) => {
			if (e.code === 'Enter') {
				this.addFireBall()
			}
		})
	}

	/**
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw(ctx) {
		const { horizontal } = this.controls
		const flip = horizontal === Controls.DIRECTIONS.LEFT

		super.draw(ctx, flip)

		if (this.#debug) {
			this.drawBoxCollision(ctx)
		}

		this.fireballs.forEach((fireball) => fireball.draw(ctx))
	}

	updateSprite() {
		this.clearAnimation()

		if (this.state === Player.STATES.RUNNING) {
			const { animation } = Loader.Sprite.getAnimation({
				name: `${this.state}-${this.powerUp}`,
				src: Loader.Sprite.SRC.PLAYER,
			})

			this.setAnimation(animation)
		} else {
			const { sprite } = Loader.Sprite.getSprite({
				name: `${this.state}-${this.powerUp}`,
				src: Loader.Sprite.SRC.PLAYER,
			})

			this.sprite = sprite
		}
	}

	/**
	 * Switch debug mode to show grid
	 */
	toogleDebug() {
		this.#debug = !this.#debug
	}

	addFireBall() {
		if (this.powerUp === Player.POWER_UPS.FIRE_FLOWER) {
			const { horizontal } = this.controls

			const fireball = new FireBall({
				x: this.x + this.width / 2,
				y: this.y + 8,
				direction: horizontal || Controls.DIRECTIONS.RIGHT,
			})

			this.fireballs.push(fireball)

			Sound.play(Sound.Name.fireball)
		}
	}

	/**
	 * Expose params for debug
	 * @returns {PlayerDebugParams} params 
	 */
	get debugParams() {
		const axisX = Math.floor(this.x)
		const axisY = Math.floor(this.y)

		const coordX = Math.floor(this.x / 16)
		const coordY = Math.floor(this.y / 16)

		const { keys } = this.controls
		const arrows = keys.map((key) => Controls.AXIS[key].character).join(' ')

		return {
			axisX,
			axisY,
			coordX,
			coordY,
			state: this.state,
			arrows,
		}
	}
}