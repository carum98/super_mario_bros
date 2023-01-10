import { GameState } from '../core/game-state.js'
import { Text } from '../ui/text.js'
import { Screen } from './screen.js'

/**
 * @class
 * @extends Screen
 * @property {Text} text
 */
export class GameOverScreen extends Screen {
	/**
	 * Name of the screen
	 * @type {string}
	 */
	static Name = 'game-over'

	/**
	  * @param {Object} data
	  * @param {HTMLCanvasElement} data.canvas
	  * @param {GameState} data.state
	  */
	constructor({ canvas, state }) {
		super({ canvas, state })

		this.text = new Text({
			text: 'GAME OVER',
			x: canvas.width / 2 - 50,
			y: canvas.height / 2
		})
	}

	render() {
		const { ctx, canvas } = this

		if (ctx === null) return

		ctx.fillStyle = 'black'
		ctx.fillRect(0, 0, canvas.width, canvas.height)

		this.text.draw(ctx)

		super.render()
	}
}