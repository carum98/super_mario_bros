import { Goomba } from '../characters/goomba.js'
import { Player } from '../characters/player.js'
import { Sprite } from '../entities/sprite.js'
import { Loader } from '../loaders/index.js'
import { LuckyBlock } from '../worlds/lucky-block.js'
import { Map } from '../worlds/map.js'
import { Pipe } from '../worlds/pipes.js'
import { Tile } from '../worlds/tile.js'
import { Controls, KEY_CODES } from './controls.js'
import { INCREASE_SCORE } from './game-state.js'
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

		if (this.player.animation) {
			this.#runAnimation()
			return
		}

		this.#movement()
		this.#handleDoubleJump()
		this.#boundaries()
		this.#state()
		this.#collideWithEnemy()
		this.#collideWithCoin()

		this.#fireballMovement()
		this.#fireballCollisions()

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
	 * Handle fireballs movements.
	 */
	#fireballMovement() {
		const { player: { fireballs }, map: { tiles } } = this

		if (fireballs.length === 0) return

		fireballs.forEach((fireball) => fireball.update(tiles))
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

		if (player.x + player.width > this.map.canvas.width - 5) {
			player.x = this.map.canvas.width - player.width - 5
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

		if (bottom instanceof Pipe && keys.includes(Controls.DIRECTIONS.DOWN)) {
			this.#moveInsidePipe(bottom.transport)
		}
	}

	/**
	 * @param {Sprite} block 
	 */
	#collideWithBlocks(block) {
		const { player } = this

		if (block instanceof LuckyBlock && block.active) {
			block.hit()

			this.game.state.increaseCoins()
			this.game.entities.push(block.getItem())
		} else if (block instanceof Tile && !(block instanceof LuckyBlock) && player.powerUp !== Player.POWER_UPS.NONE) {
			block.hit()

			this.game.state.increaseScore(INCREASE_SCORE.COIN)

			Sound.play(Sound.Name.break)
		} else {
			Sound.play(Sound.Name.bump)
		}
	}

	/**
	 * Check if the player is colliding with an enemy.
	 * Remove the enemy if it is dead or is out of the screen.
	 */
	#collideWithEnemy() {
		const { player, game, map } = this

		const enemies = map.enemies.filter((enemy) => enemy.isActive)

		if (enemies.length === 0) return

		enemies.forEach((enemy) => {
			if (player.conllidesWith(enemy)) {
				enemy.onCollide()

				const killEnemy = enemy.checkCollidePosition(player)

				if (killEnemy) {
					game.state.increaseScore(INCREASE_SCORE.ENEMY)

					Sound.play(Sound.Name.stomp)

					// Small jump
					player.vy = -2

					if (enemy instanceof Goomba) {
						enemy.killed().then(() => this.map.enemies.splice(this.map.enemies.indexOf(enemy), 1))
					}
				} else if (player.powerUp === Player.POWER_UPS.NONE) {
					this.playerDeath()
				} else {
					player.damage()

					Sound.play(Sound.Name.powerdown)
				}
			}

			// Remove enemy if is out of the screen
			if (enemy.x + enemy.width < 0) {
				this.map.enemies.splice(this.map.enemies.indexOf(enemy), 1)
			}
		})
	}

	/**
	 * Handle player death.
	 */
	playerDeath() {
		// Prevent loop
		if (this.player.animation === Player.ANIMATIONS.DEAD) return

		Sound.play(Sound.Name.die)
		this.player.animation = Player.ANIMATIONS.DEAD

		// Small jump
		this.player.vy = -3.5

		const { sprite } = Loader.Sprite.getSprite({
			name: 'dead',
			src: Loader.Sprite.SRC.PLAYER,
		})
		this.player.sprite = sprite

		// Change the game status
		this.game.state.decreaseLife()
		this.game.music.pause()
	}

	/**
	 * @param {string} type - 'in' | 'out'
	 * @param {string} direction - 'top' | 'down' | 'left' | 'right'
	 * @returns {Promise<void>}
	 */
	pipeAnimation(type, direction) {
		Sound.play(Sound.Name.pipeTravel)

		return new Promise((resolve) => {
			if (type === 'in') {
				this.player.animation = Player.ANIMATIONS.PIPE_IN
			}

			if (type === 'out') {
				this.player.animation = Player.ANIMATIONS.PIPE_OUT
			}

			setTimeout(() => {
				this.player.animation = null
				resolve()
			}, 200)
		})
	}

	reachedFlag() {
		if (this.player.animation === Player.ANIMATIONS.SLIDING_DOWN) return

		this.player.state = Player.STATES.SLIDING

		this.player.updateSprite()

		this.player.animation = Player.ANIMATIONS.SLIDING_DOWN

		this.player.x += 12
	}

	/**
	 * Handler fireball collisions with enemies.
	 */
	#fireballCollisions() {
		const { player, map, game } = this

		const fireballs = player.fireballs
		if (fireballs.length === 0) return

		const enemies = map.enemies.filter((enemy) => enemy.isActive)
		if (enemies.length === 0) return

		enemies.forEach((enemy) => {
			if (player.fireballs.some((fireball) => fireball.conllidesWith(enemy))) {
				enemy.onCollide()

				enemy.killed()

				game.state.increaseScore(INCREASE_SCORE.ENEMY)

				Sound.play(Sound.Name.stomp)

				// Remove enemy from array
				const index = map.enemies.indexOf(enemy)
				map.enemies.splice(index, 1)
			}
		})
	}

	#collideWithCoin() {
		const { map, player } = this

		const coins = map.coins.filter((coin) => coin.isActive)

		if (coins.length === 0) return

		coins.forEach((coin) => {
			if (player.conllidesWith(coin)) {
				coin.deactivate()

				this.game.state.increaseCoins()
			}
		})
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

	#runAnimation() {
		switch (this.player.animation) {
			case Player.ANIMATIONS.DEAD:
				this.#diedAnimation()
				break
			case Player.ANIMATIONS.PIPE_IN:
				this.#inPipeAnimation()
				break
			case Player.ANIMATIONS.PIPE_OUT:
				this.#outPipeAnimation()
				break
			case Player.ANIMATIONS.SLIDING_DOWN:
				this.#slideDownAnimation()
				break
		}
	}

	#diedAnimation() {
		const { player } = this

		player.y += player.vy
		player.vy += 0.2
	}

	#inPipeAnimation() {
		const { player } = this

		player.y += player.vy
		player.vy += 0.2
	}

	#outPipeAnimation() {
		const { player } = this

		player.y += player.vy
		player.vy += 0.2
	}

	#slideDownAnimation() {
		const { player } = this

		const { bottom } = this.#collisions

		if (bottom) {
			player.x = bottom.x + 16
			player.animation = null

			this.#controls.loadMacros([
				{ key: KEY_CODES.ArrowRight, time: 900 }
			])
		} else {
			player.y += player.vy
			player.vy += 0.1
		}
	}

	/**
	 * @param {{ x: number, y: number, direction: string } | undefined} transport
	 */
	async #moveInsidePipe(transport) {
		if (!transport) return

		const { x, y, direction } = transport

		await this.pipeAnimation(direction, 'left')

		const style = this.map.canvas.style

		// Change background color
		style.background = direction === 'out' ? '#5d95fc' : '#000'

		// Change background music
		this.game.music.pause()

		if (direction === 'out') {
			this.game.music = Sound.backgroundMusic(Sound.Name.overworld)
		} else {
			this.game.music = Sound.backgroundMusic(Sound.Name.background)
		}

		this.game.music.play()

		this.map.moveTo(x - this.map.column)

		this.player.x = 2 * 16
		this.player.y = y * 16
	}
}