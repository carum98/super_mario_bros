import { Map } from "../worlds/map.js"
import { Player } from "../characters/player.js"
import { Information } from "../ui/information.js"
import { Mushroom } from "../worlds/mushroom.js"
import { Sound } from "./sound.js"
import { PowerUp } from "../entities/power-up.js"

/**
 * @class
 * @property {CanvasRenderingContext2D} ctx
 * @property {Player} player
 * @property {Map} map
 * @property {Information} information
 * @property {Entity[]} entities
 * @property {number} score
 * @property {number} coins
 * @property {string} level
 * @property {number} timer
 */
export class Game {
	#timeUpdate = 0
	#timeDraw = 0
	#timeStart = 0

	#muted = true

	/**
	 * @param {Object} data
	 * @param {HTMLCanvasElement} data.canvas
	 */
	constructor({ canvas }) {
		const now = performance.now()

		this.ctx = canvas.getContext('2d')

		this.map = new Map({ canvas, map: { world: 1, level: 1 } })
		this.player = new Player({ game: this })

		this.score = 0
		this.coins = 0
		this.level = '1 - 1'
		this.timer = 400
		this.gameOver = false

		this.information = new Information({ game: this })

		this.entities = []

		this.music = new Audio('assets/sounds/music.mp3')
		this.music.loop = true
		this.music.volume = 0.2

		if (!this.#muted) {
			window.addEventListener('focus', () => this.music.play())
			window.addEventListener('blur', () => this.music.pause())
		}

		this.#timeStart = performance.now() - now
	}

	render() {
		if (this.gameOver) {
			console.log('Game Over')
			return
		}

		const now = performance.now()
		this.#update()
		this.#timeUpdate = performance.now() - now

		const now2 = performance.now()
		this.#draw()
		this.#timeDraw = performance.now() - now2

		this.#checkCollision()

		this.#renderEntities()

		if (!this.#muted && this.music.paused && this.gameOver === false && this.player.x > 0) {
			this.music.play()
		}
	}

	#update() {
		this.player.update()
		this.map.update()
		this.information.update()

		if (this.ctx) {
			const middle = this.ctx.canvas.width / 4

			if (this.player.x > middle) {
				this.map.move()
				this.player.x = middle

				// Move power ups with the map
				if (this.entities.some((entity) => entity.isActive)) {
					const powerUps = this.entities.filter((entity) => entity instanceof PowerUp)

					powerUps.forEach((powerUp) => powerUp.x -= 2)
				}
			}

			// Check if player is out of the map
			if (this.player.y > this.ctx.canvas.height) {
				this.#gameOver()
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
						this.#gameOver()
					} else {
						enemy.killed()

						this.score += 100

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

					this.score += 100

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
		this.gameOver = true

		this.music.pause()

		Sound.play(Sound.Name.die)
	}

	#reachGoal() {
		this.gameOver = true

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