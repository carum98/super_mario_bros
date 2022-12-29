import { getSprites } from './utils.js'

import SpritesData from '../../assets/sprites/font.json' assert {type: 'json'}

export class Text {
	/**
	 * @param {Object} data
	 * @param {string} data.text
	 * @param {number} data.x
	 * @param {number} data.y
	 */
	constructor({ text, x, y }) {
		const { src, sprites } = SpritesData

		this.frames = getSprites({ sprites, names: text.split('') })

		this.text = text
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