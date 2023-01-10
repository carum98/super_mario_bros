import { LoadingScreen } from '../screens/loading.js'
import { GameLoop } from '../core/game-loop.js'
import { MenuScreen } from '../screens/menu.js'
import { timeout } from '../utilities/utils.js'
import { Game } from './game.js'
import { GameState } from './game-state.js'
import { GameOverScreen } from '../screens/game-over.js'

/**
 * @class
 * @property {HTMLCanvasElement} canvas
 * @property {GameState} state
 * @property {GameLoop} loop
 * @property {Game | null} renderEngine
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

		this.renderEngine = null

		this.loop = new GameLoop(this.render.bind(this))

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
		}

		// Loading screen
		const loading = new LoadingScreen({
			canvas: this.canvas,
			state: this.state
		})

		await timeout(100)

		loading.render()

		await timeout(2000)

		// Game screen
		const game = new Game({
			canvas: this.canvas,
			state: this.state
		})

		this.renderEngine = game

		if (!this.loop.isRunning) {
			this.loop.start()
		}
	}

	async showMenu() {
		const menu = new MenuScreen({
			canvas: this.canvas
		})

		await timeout(100)

		menu.render()

		document.addEventListener('keypress', (event) => {
			if (event.key === 'Enter') {
				this.startLevel()
				menu.dispose()
			}
		}, { once: true })
	}

	async gameOver() {
		const page = new GameOverScreen({
			canvas: this.canvas,
			state: this.state
		})

		await timeout(100)

		page.render()

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
	}
}