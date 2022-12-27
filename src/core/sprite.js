import { GameElement } from './game-element.js'

/**
 * @class
 * @extends GameElement
 * 
 * @property {HTMLImageElement} image
 * @property {Object} sprite
 */
export class Sprite extends GameElement {
	/**
	 * @type {Frame[]}
	 */
	#frames = []

	/**
	 * @type {number}
	 */
	#index = 0

	/**
	 * @type {number}
	 */
	#interval = 0

	/**
	 * @type {number}
	 */
	#speed = 0

	/**
	 * @param {Object} data
	 * @param {string} data.src
	 * @param {number} data.x
	 * @param {number} data.y
	 * @param {Frame} data.sprite
	 */
	constructor({ src, x, y, sprite }) {
		const { w: width, h: height } = sprite

		super({ x, y, width, height })

		this.image = new Image()
		this.image.src = `assets/img/${src}`

		this.sprite = sprite
	}

	/**
	 * Update the sprite animation frame
	 * 
	 * Only update the sprite if has more than one frame 
	 * and the interval is a multiple of the speed
	 */
	update() {
		this.#interval = (this.#interval + 1) % 60

		if (this.#frames.length > 0 && this.#interval % this.#speed === 0) {
			this.#index = (this.#index + 1) % this.#frames.length
			this.sprite = this.#frames[this.#index]
		}
	}

	/**
	 * @param {Object} data
	 * @param {Frame[]} data.frames
	 * @param {number} data.speed
	 */
	setAnimation({ frames, speed }) {
		this.#frames = frames
		this.#index = 0
		this.#speed = speed
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

	/**
	 * @param {CanvasRenderingContext2D} ctx
	 * @returns void
	*/
	drawBox(ctx) {
		ctx.save()

		const { x, y, width, height } = this
		ctx.strokeRect(x, y, width, height)

		ctx.strokeStyle = 'red'

		ctx.strokeRect(x + width, y, width, height) // right
		ctx.strokeRect(x, y + height, width, height) // bottom
		ctx.strokeRect(x, y - height, width, height) // top
		ctx.strokeRect(x - width, y, width, height) // left

		ctx.restore()
	}

	/**
	 * @param {CanvasRenderingContext2D} ctx
	 * @returns void
	*/
	drawBoxCollision(ctx) {
		ctx.save()

		const { x, y, width, height } = this

		ctx.strokeStyle = 'red'

		const right = { x: x + width, y: y + height / 4, width: width / 4, height: height / 2 }
		const bottom = { x: x + width / 4, y: y + height, width: width / 2, height: height / 4 }
		const top = { x: x + width / 4, y: y - height / 4, width: width / 2, height: height / 4 }
		const left = { x: x - width / 4, y: y + height / 4, width: width / 4, height: height / 2 }

		ctx.strokeRect(right.x, right.y, right.width, right.height)
		ctx.strokeRect(bottom.x, bottom.y, bottom.width, bottom.height)
		ctx.strokeRect(top.x, top.y, top.width, top.height)
		ctx.strokeRect(left.x, left.y, left.width, left.height)

		ctx.restore()
	}

}