import { Map } from "../worlds/map.js"
import { Player } from "../characters/player.js"
import { Information } from "../ui/information.js"
import { Mushroom } from "../worlds/mushroom.js"
import { Sound } from "./sound.js"
import { PowerUp } from "../entities/power-up.js"
import { PlayerController } from "./player-controller.js"
import { GameState, INCREASE_SCORE } from "./game-state.js"

/**
 * @class
 * @property {CanvasRenderingContext2D} ctx
 * @property {Player} player
 * @property {Map} map
 * @property {Information} information
 * @property {GameState} state
 * @property {Entity[]} entities
 * @property {number} timer
 */
export class Game {
	#timeUpdate = 0
	#timeDraw = 0
	#timeStart = 0

	/**
	 * @param {Object} data
	 * @param {HTMLCanvasElement} data.canvas
	 * @param {GameState} data.state
	 */
	constructor({ canvas, state }) {
		const now = performance.now()

		this.ctx = canvas.getContext('2d')

		this.state = state

		this.map = new Map({
			canvas,
			map: {
				level: this.state.level,
				world: this.state.world,
			}
		})

		this.player = new Player({ game: this })

		this.timer = 400

		this.information = new Information()

		this.entities = []

		this.music = new Audio('assets/sounds/music.mp3')
		this.music.loop = true
		this.music.volume = 0.2

		window.addEventListener('focus', () => this.music.play())
		window.addEventListener('blur', () => this.music.pause())

		this.playerController = new PlayerController({
			player: this.player,
			map: this.map,
			game: this
		})

		if (this.music.paused) {
			this.music.play()
		}

		this.#timeStart = performance.now() - now
	}

	/**
	 * @param {Function} callbackStop - Stop de game engine
	 */
	render(callbackStop) {
		const now = performance.now()
		this.#update()
		this.#timeUpdate = performance.now() - now

		const now2 = performance.now()
		this.#draw()
		this.#timeDraw = performance.now() - now2

		this.#checkCollision()

		this.#renderEntities()

		// Check if player is out of the map
		// @ts-ignore
		if (this.player.y > this.ctx.canvas.height) {
			callbackStop()
		}
	}

	#update() {
		this.playerController.update()
		this.map.update()
		this.information.update(this)

		if (this.ctx) {
			const middle = this.ctx.canvas.width / 3

			if (this.player.x > middle) {
				this.map.move()
				this.player.x = middle

				// Move power ups with the map
				if (this.entities.some((entity) => entity.isActive)) {
					const powerUps = this.entities.filter((entity) => entity instanceof PowerUp)

					powerUps.forEach((powerUp) => powerUp.x -= 2)
				}
			}
		}
	}

	#draw() {
		const { ctx, player, map, information } = this
		if (!ctx) return

		// Clear canvas
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

		// Draw game elements
		map.draw(ctx)
		player.draw(ctx)
		information.draw(ctx)
	}

	#renderEntities() {
		// Remove inactive entities
		this.entities = this.entities.filter((entity) => entity.isActive)

		if (this.entities.some((entity) => entity.isActive)) {
			this.entities.forEach((entity) => {
				if (entity instanceof Mushroom) {
					entity.move(this.map.tiles)
				} else {
					entity.update()
				}
			})

			this.entities.forEach((entity) => entity.draw(this.ctx))
		}
	}

	#checkCollision() {
		const { player, entities, map } = this

		if (entities.length !== 0) {
			entities.forEach((entity) => {
				if (player.conllidesWith(entity)) {
					entity.onCollide()

					// Remove entity from array
					const index = entities.indexOf(entity)
					entities.splice(index, 1)

					// Add power up to player
					if (entity.powerUp) {
						player.powerUp = entity.powerUp
					}

					// Change all mushrooms to fire flower
					if (entity instanceof Mushroom) {
						this.map.toogleMushroomsToFireFlower()
					}
				}
			})
		}
		const enemies = map.enemies.filter((enemy) => enemy.isActive)

		if (enemies.length !== 0) {
			enemies.forEach((enemy) => {
				if (player.conllidesWith(enemy)) {
					enemy.onCollide()

					const playerIsDead = enemy.checkCollidePosition(player)

					if (playerIsDead) {
						player.died()

						this.state.decreaseLife()

						this.#gameOver()
					} else {
						enemy.killed()

						this.state.increaseScore(INCREASE_SCORE.ENEMY)

						Sound.play(Sound.Name.stomp)
					}

					// Remove enemy from array
					const index = map.enemies.indexOf(enemy)
					map.enemies.splice(index, 1)
				}

				// Check if enemy collide with player fireball
				if (player.fireballs.some((fireball) => fireball.conllidesWith(enemy))) {
					enemy.onCollide()

					enemy.killed()

					this.state.increaseScore(INCREASE_SCORE.ENEMY)

					Sound.play(Sound.Name.stomp)

					// Remove enemy from array
					const index = map.enemies.indexOf(enemy)
					map.enemies.splice(index, 1)
				}
			})
		}

		map.checkpoints.forEach((checkpoint) => {
			if (player.conllidesWith(checkpoint)) {
				checkpoint.activate()

				this.#reachGoal()
			}
		})
	}

	/**
	 * Game over, stop music and play sound die
	 */
	#gameOver() {
		this.music.pause()

		Sound.play(Sound.Name.die)
	}

	#reachGoal() {
		this.music.pause()

		Sound.play(Sound.Name.goal)
	}

	/**
	 * Expose params for debug
	 * @returns {GameDebugParams} GameDebugParams
	 */
	get debugParams() {
		return {
			timeUpdate: this.#timeUpdate.toFixed(5) + 'ms',
			timeDraw: this.#timeDraw.toFixed(5) + 'ms',
			timeStart: this.#timeStart.toFixed(5) + 'ms',
			entities: this.entities.length,
			visibleEntities: this.entities.filter((enemy) => enemy.isActive).length,
		}
	}
}