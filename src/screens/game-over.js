import { GameState } from '../core/game-state.js'
import { Information } from '../ui/information.js'
import { Text } from '../ui/text.js'

export class GameOverScreen {
	/**
	  * @param {Object} data
	  * @param {HTMLCanvasElement} data.canvas
	  * @param {GameState} data.state
	  */
	constructor({ canvas, state }) {
		this.canvas = canvas

		this.ctx = canvas.getContext('2d')

		this.information = new Information({ state })

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

		this.information.draw(ctx)

		this.text.draw(ctx)
	}
}