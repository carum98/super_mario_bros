import { GameLoop } from '../core/game-loop.js'
import { timeout } from '../utilities/utils.js'
import { Game } from './game.js'
import { GameState } from './game-state.js'
import { RouterController, ScreenNames } from './router-controller.js'

/**
 * @class
 * @property {HTMLCanvasElement} canvas
 * @property {GameState} state
 * @property {number} actualLevel
 * @property {GameLoop} loop
 * @property {Game | null} renderEngine
 * @property {RouterController} router
 */
export class GameController {
	/**
	 * @param {Object} param 
	 * @param {HTMLCanvasElement} param.canvas 
	 * @param {GameState} param.state
	 */
	constructor({ canvas, state }) {
		this.canvas = canvas

		this.state = state
		this.currentLevel = this.state.level

		this.renderEngine = null

		this.loop = new GameLoop(this.render.bind(this))

		this.router = new RouterController({ canvas, state })

		this.showMenu()
	}

	/**
	 * @param {Object} param 
	 * @param {number} param.world
	 * @param {number} param.level
	 */
	async startLevel() {
		if (this.loop.isRunning) {
			this.loop.stop()

			this.state.stopTimer()
		}

		// Loading screen
		this.router.push(ScreenNames.loading)

		await timeout(2000)

		// Game screen
		const game = new Game({
			canvas: this.canvas,
			state: this.state
		})

		this.renderEngine = game

		if (!this.loop.isRunning) {
			this.loop.start()

			this.state.startTimer()
		}
	}

	async showMenu() {
		this.router.push(ScreenNames.menu)

		document.addEventListener('keypress', ({ key }) => {
			if (key === 'Enter') this.startLevel()
		}, { once: true })
	}

	async gameOver() {
		this.router.push(ScreenNames.gameOver)

		await timeout(3000)

		this.showMenu()
	}

	/**
	 * @param {Function} callbackStop — Stop de game engine
	 */
	render(callbackStop) {
		const stop = () => {
			callbackStop()

			setTimeout(() => {
				if (this.state.lives > 0) {
					this.startLevel()
				} else {
					this.gameOver()
					this.state.reset()
				}
			}, 2000)
		}

		this.renderEngine?.render(stop)

		if (this.currentLevel !== this.state.level) {
			this.currentLevel = this.state.level

			this.startLevel()
		}
	}
}