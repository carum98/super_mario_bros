import { Player } from '../characters/player.js'
import { Sprite } from '../entities/sprite.js'
import { LuckyBlock } from '../worlds/lucky-block.js'
import { Map } from '../worlds/map.js'
import { Tile } from '../worlds/tile.js'
import { Controls } from './controls.js'
import { Game } from './game.js'
import { MovementController } from './movement.js'
import { Sound } from './sound.js'

/**
 * @class
 * @property {Player} player
 * @property {Map} map
 * @property {Game} game
 */
export class PlayerController {
	/**
	 * @type {Controls}
	 */
	#controls = new Controls()

	/**
	 * @type {{ bottom: Sprite | undefined, top: Sprite | undefined, left: Sprite | undefined, right: Sprite | undefined }}
	 */
	#collisions = {
		bottom: undefined,
		top: undefined,
		left: undefined,
		right: undefined,
	}

	#jump = {
		count: 0,
		enabled: false,
	}

	/**
	 * @param {Object} param 
	 * @param {Player} param.player
	 * @param {Map} param.map
	 * @param {Game} param.game
	 */
	constructor({ player, map, game }) {
		this.player = player
		this.map = map
		this.game = game

		this.#controls.startListening()
	}

	update() {
		this.#collisions = MovementController.collisions(this.player, this.map.tiles)

		this.#movement()
		this.#handleDoubleJump()
		this.#boundaries()
		this.#state()

		this.player.fireballs.forEach((fireball) => fireball.update(this.map.tiles))
		this.player.update()
	}

	/**
	 * Move the player horizontally and vertically.
	 */
	#movement() {
		const { player } = this
		const { keys } = this.#controls

		const { bottom } = this.#collisions

		const moveHorizontal = keys.includes(Controls.DIRECTIONS.LEFT) || keys.includes(Controls.DIRECTIONS.RIGHT)
		const moveUp = keys.includes(Controls.DIRECTIONS.UP)

		const direction = keys[0]

		// --- Move horizontal ---
		if (moveHorizontal) {
			const { x } = Controls.AXIS[direction]
			player.x += x * player.speed
		}

		// --- Move vertical ---
		if (moveUp && bottom) {
			player.vy = player.powerUp === Player.POWER_UPS.NONE ? -3.5 : -4

			Sound.play(Sound.Name.jump)
		}

		// --- Gravity ---
		player.y += player.vy

		if (!bottom) {
			player.vy += player.powerUp === Player.POWER_UPS.NONE ? 0.2 : 0.3
		}
	}

	/**
	 * Check if the player is colliding with the map boundaries.
	 */
	#boundaries() {
		const { player } = this
		const { keys } = this.#controls

		const { bottom, top, right, left } = this.#collisions

		// --- Collision floor ---
		if (bottom && player.vy >= 0) {
			player.y = bottom.y - player.height
			player.vy = 0
		}

		// --- Collision ceiling ---
		if (top && player.vy <= 0) {
			player.y = top.y + top.height
			player.vy = 0

			this.#collideWithBlocks(top)
		}

		// --- Collision horizontal ---
		if (right && keys[0] === Controls.DIRECTIONS.RIGHT) {
			player.x = right.x - player.width
		}

		if (left && keys[0] === Controls.DIRECTIONS.LEFT) {
			player.x = left.x + left.width
		}

		// --- Limits ---
		if (player.x < 0) {
			player.x = 0
		}
	}

	/**
	 * Change the player state and if the state has changed, update the sprite.
	 */
	#state() {
		const { player } = this
		const { keys } = this.#controls

		const { bottom } = this.#collisions

		let lastState = player.state

		if (bottom) {
			player.state = keys[0] ? Player.STATES.RUNNING : Player.STATES.IDLE
		} else {
			player.state = Player.STATES.JUMPING
		}

		if (lastState !== player.state) {
			player.updateSprite()
		}
	}

	/**
	 * @param {Sprite} block 
	 */
	#collideWithBlocks(block) {
		const { player } = this

		if (block instanceof LuckyBlock && block.active) {
			block.hit()

			this.game.coins++
			this.game.score += 200

			this.game.entities.push(block.getItem())
		} else if (block instanceof Tile && !(block instanceof LuckyBlock) && player.powerUp !== Player.POWER_UPS.NONE) {
			block.hit()
			this.game.score += 50

			Sound.play(Sound.Name.break)
		} else {
			Sound.play(Sound.Name.bump)
		}
	}

	#handleDoubleJump() {
		const { player } = this
		const { keys } = this.#controls

		const moveUp = keys.includes(Controls.DIRECTIONS.UP)

		if (moveUp) {
			this.#jump.count++
		} else {
			this.#jump.count = 0
			this.#jump.enabled = false
		}

		if (this.#jump.count !== 0 && this.#jump.count >= 13 && !this.#jump.enabled) {
			this.#jump.enabled = true
			player.vy += player.powerUp === Player.POWER_UPS.NONE ? -2 : -3
		}
	}
}