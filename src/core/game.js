import { Map } from "../worlds/map.js"
import { Player } from "../characters/player.js"
import { Information } from "../ui/information.js"
import { Mushroom } from "../worlds/mushroom.js"
import { Sound } from "./sound.js"
import { PowerUp } from "../entities/power-up.js"
import { PlayerController } from "./player-controller.js"
import { GameState } from "./game-state.js"

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

		this.information = new Information({ state })

		this.entities = []

		this.music = Sound.backgroundMusic(Sound.Name.overworld)

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

		this.#renderEntities()

		// Check if player is out of the map
		// @ts-ignore
		if (this.player.y > this.ctx.canvas.height) {
			callbackStop()

			this.playerController.playerDeath()
		}
	}

	/**
	 * @param {{ map: string, direction: string, column: number? }} transport
	 */
	transport(transport) {
		this.map.moveToMap(transport)

		const currentMap = this.map.currentMap

		// Change background color
		this.map.canvas.style.background = currentMap.background

		// Change music
		this.music.pause()
		this.music = Sound.backgroundMusic(currentMap.music)
		this.music.play()

		// Change player position
		this.player.x = 2 * 16
		this.player.y = 2 * 16
	}

	#update() {
		this.playerController.update()
		this.map.update()
		this.information.update()

		if (this.ctx && !this.map.limit) {
			const middle = this.ctx.canvas.width / 2.5

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