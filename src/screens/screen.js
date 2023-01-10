import { GameState } from '../core/game-state.js'
import { Information } from '../ui/information.js'

/**
 * @class
 * @property {HTMLCanvasElement} canvas
 * @property {CanvasRenderingContext2D} ctx
 * @property {Information} information
 */
export class Screen {
	/**
	 * @param {Object} data
	 * @param {HTMLCanvasElement} data.canvas
	 * @param {GameState} data.state
	 */
	constructor({ canvas, state }) {
		this.canvas = canvas

		this.ctx = canvas.getContext('2d')

		this.information = new Information({ state })
	}

	/**
	 * @method
	 * @returns {void}
	 */
	render() {
		const { ctx } = this

		if (ctx === null) return

		this.information.draw(ctx)
	}

	/**
	 * @method
	 * @returns {void}
	 */
	dispose() {
		console.log('destroy')
	}
}