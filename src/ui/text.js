import { Loader } from "../loaders/index.js"

/**
 * @class
 * @property {Array<Frame>} frames
 * @property {number} x
 * @property {number} y
 * @property {HTMLImageElement} image
 */
export class Text {
	/**
	 * @param {Object} param 
	 * @param {string} param.text
	 * @param {number} param.x
	 * @param {number} param.y
	 */
	constructor({ text, x, y }) {
		let src = ''

		const loader = Loader.Sprite
		const sprites = []

		for (const name of text.split('')) {
			const { path, sprite } = loader.getSprite({ src: loader.SRC.FONT, name })

			sprites.push(sprite)
			src = path
		}

		this.frames = sprites

		this.x = x
		this.y = y

		this.image = new Image()
		this.image.src = `assets/img/${src}`
	}

	/**
	 * @param {CanvasRenderingContext2D} ctx
	 * @returns void
	 */
	draw(ctx) {
		ctx.save()

		this.frames.forEach((frame, index) => {
			ctx.drawImage(
				this.image,
				frame.x,
				frame.y,
				frame.w,
				frame.h,
				this.x + index * frame.w,
				this.y,
				frame.w,
				frame.h
			)
		})

		ctx.restore()
	}
}