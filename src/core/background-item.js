import { getPattern, getSprite } from './utils.js'

import SpritesData from '../../assets/sprites/tile.json' assert {type: 'json'}

/**
 * @class
 * @property {Frame[][]} frames
 */
export class BackgroundItem {
	static TYPE = {
		CLOUD: 'cloud',
	}

	/**
	 * @param {Object} data
	 * @param {number} data.x
	 * @param {number} data.y
	 * @param {string} data.type
	 * @param {string} data.name
	 */
	constructor({ x, y, type, name }) {
		const { src, sprites, patterns } = SpritesData

		this.frames = type === 'sprites' ? [[getSprite({ sprites, name })]] : getPattern({ sprites, patterns, name })

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
		const { image, x, y } = this

		ctx.save()

		for (let i = 0; i < this.frames.length; i++) {
			const row = this.frames[i]

			for (let j = 0; j < row.length; j++) {
				const preFrame = row[j - 1]
				const frame = row[j]

				if (j === 0 && i > 0) {
					const { w: preW, h: preH } = row[i - 1]
					const { x: sx, y: sy, w: sw, h: sh } = frame

					ctx.drawImage(image, sx, sy, sw, sh, x + preW * j, y + preH * i, sw, sh)
				} else if (preFrame) {
					const { w: preW, h: preH } = row[j - 1]
					const { x: sx, y: sy, w: sw, h: sh } = frame

					ctx.drawImage(image, sx, sy, sw, sh, x + preW * j, y + preH * i, sw, sh)
				} else {
					const { x: sx, y: sy, w: sw, h: sh } = frame
					ctx.drawImage(image, sx, sy, sw, sh, x, y, sw, sh)
				}
			}
		}

		ctx.restore()
	}
}