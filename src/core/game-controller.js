import { LoadingScreen } from '../screens/loading.js'
import { GameLoop } from '../core/game-loop.js'
import { MenuScreen } from '../screens/menu.js'
import { timeout } from '../utilities/utils.js'
import { Game } from './game.js'

/**
 * @class
 * @property {HTMLCanvasElement} canvas
 * @property {GameLoop} loop
 * @property {Game | null} renderEngine
 */
export class GameController {
	/**
	 * @param {Object} param 
	 * @param {HTMLCanvasElement} param.canvas 
	 */
	constructor({ canvas }) {
		this.canvas = canvas
		this.renderEngine = null

		this.loop = new GameLoop(this.render.bind(this))

		this.showMenu()
	}

	/**
	 * @param {Object} param 
	 * @param {number} param.world
	 * @param {number} param.level
	 */
	async startLevel({ world, level }) {
		if (this.loop.isRunning) {
			this.loop.stop()
		}

		// Loading screen
		const loading = new LoadingScreen({
			canvas: this.canvas,
			world,
			level,
		})

		await timeout(100)

		loading.render()

		await timeout(2000)

		// Game screen
		const game = new Game({
			canvas: this.canvas,
			world,
			level,
		})

		this.renderEngine = game

		if (!this.loop.isRunning) {
			this.loop.start()
		}
	}

	showMenu() {
		const menu = new MenuScreen({
			canvas: this.canvas
		})

		window.addEventListener('load', () => {
			menu.render()
		}, { once: true })

		document.addEventListener('keypress', (event) => {
			if (event.key === 'Enter') {
				this.startLevel({ world: 1, level: 1 })
				menu.dispose()
			}
		}, { once: true })
	}

	/**
	 * @param {Function} callbackStop — Stop de game engine
	 */
	render(callbackStop) {
		const stop = () => {
			callbackStop()

			setTimeout(() => {
				this.startLevel({ world: 1, level: 1 })
			}, 2000)
		}

		this.renderEngine?.render(stop)
	}
}