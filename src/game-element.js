/**
 * @class
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 */
export class GameElement {
	/**
	 * @param {Object} data 
	 * @param {number} data.x
	 * @param {number} data.y
	 * @param {number} data.width
	 * @param {number} data.height
	 */
	constructor({ x, y, width, height }) {
		this.x = x
		this.y = y

		this.width = width
		this.height = height
	}

	/**
	 * @param {CanvasRenderingContext2D} ctx
	 * @returns void
	*/
	draw(ctx) {
		ctx.fillRect(this.x, this.y, this.width, this.height)
	}

	/**
	 * @param {GameElement} element 
	 * @returns boolean
	 */
	conllidesWith(element) {
		return (
			this.x < element.x + element.width &&
			this.x + this.width > element.x &&
			this.y < element.y + element.height &&
			this.y + this.height > element.y
		)
	}
}