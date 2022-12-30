import { Controls } from '../core/controls.js'
import { Sprite } from '../entities/sprite.js'
import { Game } from '../core/game.js'
import { LuckyBlock } from '../worlds/lucky-block.js'
import { Tile } from '../worlds/tile.js'
import { Loader } from '../loaders/index.js'
import { Mushroom } from '../worlds/mushroom.js'
import { FireFlower } from '../worlds/fire-flower.js'

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
	}

	update() {
		const { keys } = this.controls
		const { map: { tiles } } = this.game
		const { bottom, top, right, left } = this.#collisions(tiles)

		const isJumping = keys.includes(Controls.DIRECTIONS.UP)
		const isMoving = keys.includes(Controls.DIRECTIONS.LEFT) || keys.includes(Controls.DIRECTIONS.RIGHT)

		const collideTop = Boolean(top)
		const collideBottom = Boolean(bottom)

		// --- Horizontal movement ---
		const direction = keys[0]

		if (isMoving && !collideTop) {
			const { x } = Controls.AXIS[direction]
			this.x += x * this.speed
		}

		// --- Vertical movement ---
		if (isJumping && collideBottom) {
			this.vy = this.powerUp === Player.POWER_UPS.NONE ? -5.5 : -8
		}

		this.y += this.vy

		if (!this.#collisions(tiles).bottom) {
			this.vy += this.powerUp === Player.POWER_UPS.NONE ? 0.2 : 0.4
		} else {
			this.vy = 0
		}

		// --- State ---
		let lastState = this.state

		if (collideBottom) {
			this.state = direction ? Player.STATES.RUNNING : Player.STATES.IDLE
		} else {
			this.state = Player.STATES.JUMPING
		}

		// --- Animation ---
		if (lastState !== this.state) {
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

		// --- Collision ---
		if (bottom && this.vy >= 0) {
			this.y = bottom.y - this.height
			this.vy = 0
		}

		if (top && isJumping) {
			this.y = top.y + top.height
			this.vy = 0

			if (top instanceof LuckyBlock && top.active) {
				top.hit()

				this.game.coins++
				this.game.score += 200

				const { item } = top

				if (item instanceof Mushroom) {
					this.game.entities.push(item)
				}

				if (item instanceof FireFlower) {
					this.game.entities.push(item)
				}
			} else if (top instanceof Tile && this.powerUp !== Player.POWER_UPS.NONE) {
				top.hit()

				this.game.score += 50
			}
		}

		if (direction) {
			if (right && direction === Controls.DIRECTIONS.RIGHT) {
				this.x = right.x - this.width
			}

			if (left && direction === Controls.DIRECTIONS.LEFT) {
				this.x = left.x + left.width
			}
		}

		// Limit player to canvas
		if (this.x < 0) {
			this.x = 0
		}

		// Update sprite
		super.update()
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

	/**
	 * Switch debug mode to show grid
	 */
	toogleDebug() {
		this.#debug = !this.#debug
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