import { GameState } from './game-state.js'
import { timeout } from '../utilities/utils.js'
import { GameOverScreen } from '../screens/game-over.js'
import { LoadingScreen } from '../screens/loading.js'
import { MenuScreen } from '../screens/menu.js'
import { Screen } from '../screens/screen.js'

/**
 * @enum {string} - Names of the screens
 * @readonly
 */
export const ScreenNames = {
	menu: MenuScreen.Name,
	loading: LoadingScreen.Name,
	gameOver: GameOverScreen.Name,
}

/**
 * @class
 * @property {HTMLCanvasElement} canvas
 * @property {GameState} state
 */
export class RouterController {
	/**
	 * @type {Screen | null}
	 */
	#screen = null

	/**
	  * @param {Object} data
	  * @param {HTMLCanvasElement} data.canvas
	  * @param {GameState} data.state
	  */
	constructor({ canvas, state }) {
		this.canvas = canvas
		this.state = state
	}

	/**
	 * @param {ScreenNames} screen 
	 */
	push(screen) {
		if (this.#screen !== null) {
			this.#screen.dispose()
		}

		switch (screen) {
			case MenuScreen.Name:
				this.#screen = new MenuScreen({
					canvas: this.canvas,
					state: this.state,
				})
				break
			case LoadingScreen.Name:
				this.#screen = new LoadingScreen({
					canvas: this.canvas,
					state: this.state,
				})
				break
			case GameOverScreen.Name:
				this.#screen = new GameOverScreen({
					canvas: this.canvas,
					state: this.state,
				})
				break
			default:
				throw new Error(`Unknown screen: ${screen}`)
		}

		this.render()
	}

	/**
	 * Render the current screen and wait for 100ms before rendering.
	 */
	async render() {
		await timeout(100)

		if (this.#screen === null) {
			throw new Error('No screen to render')
		}

		this.#screen.render()
	}
}