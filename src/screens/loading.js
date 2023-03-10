import { GameState } from '../core/game-state.js'
import { Text } from '../ui/text.js'
import { Screen } from './screen.js'

/**
 * @class
 * @extends Screen
 * @property {Image} image
 * @property {Information} information
 * @property {Text[]} texts
 */
export class LoadingScreen extends Screen {
	/**
	 * Name of the screen
	 * @type {string}
	 */
	static Name = 'Loading'

	#mario = {
		x: 0,
		y: 88,
		w: 16,
		h: 16
	}

	/**
	 * @param {Object} data
	 * @param {HTMLCanvasElement} data.canvas
	 * @param {GameState} data.state
	 */
	constructor({ canvas, state }) {
		super({ canvas, state })

		this.image = new Image()
		this.image.src = 'assets/img/sprites.png'

		const center = { x: canvas.width / 2, y: canvas.height / 2 }
		const { world, level, lives } = state

		this.texts = [
			new Text({ text: `WORLD ${world}-${level}`, x: center.x - 35, y: center.y - 20 }),
			new Text({ text: '×', x: center.x, y: center.y }),
			new Text({ text: `${lives}`, x: center.x + 20, y: center.y }),
		]
	}

	render() {
		const { ctx, canvas, image } = this

		if (ctx === null) return

		ctx.fillStyle = 'black'
		ctx.fillRect(0, 0, canvas.width, canvas.height)

		const { x: xMario, y: yMario, w: wMario, h: hMario } = this.#mario

		ctx.drawImage(
			image,
			xMario, yMario, wMario, hMario,
			canvas.width / 2 - 30, canvas.height / 2 - 5, wMario, hMario
		)

		this.texts.forEach(text => text.draw(ctx))

		super.render()
	}
}