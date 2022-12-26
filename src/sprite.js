import { GameElement } from './game-element.js'

/**
 * @class
 * @extends GameElement
 * 
 * @property {HTMLImageElement} image
 * @property {Object} sprite
 * @property {Object[]} frames
 * @property {number} index
 */
export class Sprite extends GameElement {
	/**
	 * @param {Object} data
	 * @param {string} data.src
	 * @param {number} data.x
	 * @param {number} data.y
	 * @param {Object} data.sprite
	 */
	constructor({ src, x, y, sprite }) {
		const { w: width, h: height } = sprite

		super({ x, y, width, height })

		this.image = new Image()
		this.image.src = `assets/${src}`

		this.sprite = sprite

		this.frames = []
		this.index = 0
	}

	update() {
		if (this.frames.length > 0) {
			this.index = (this.index + 1) % this.frames.length
			this.sprite = this.frames[this.index]
		}
	}

	/**
	 * @param {CanvasRenderingContext2D} ctx
	 * @returns void
	*/
	draw(ctx) {
		const { image, x, y, width, height } = this
		const { x: sx, y: sy, w: sw, h: sh } = this.sprite

		ctx.drawImage(image, sx, sy, sw, sh, x, y, width, height)
	}
}