import { Loader } from '../loaders/index.js'
import { Sprite } from './sprite.js'

/**
 * @class
 * @extends Sprite
 * @property {Frame[][]} frames
 */
export class BackgroundItem extends Sprite {
	#debug = false

	/**
	 * @param {Object} data
	 * @param {number} data.x
	 * @param {number} data.y
	 * @param {string} data.type
	 * @param {string} data.name
	 * @param {number} [data.columns]
	 * @param {number} [data.rows]
	 */
	constructor({ x, y, type, name, columns, rows }) {
		const loader = Loader.Sprite

		const frames = []
		let path = ''

		if (type === loader.TYPE.SPRITES) {
			const data = loader.getSprite({ src: loader.SRC.TILE, name })

			frames.push([data.sprite])
			path = data.path
		} else if (type === loader.TYPE.RANGES) {
			if (!columns || !rows) throw new Error('Columns and rows are required for ranges.')

			const data = loader.getSprite({ src: loader.SRC.TILE, name })

			for (let i = 0; i < rows; i++) {
				const row = []

				for (let j = 0; j < columns; j++) {
					row.push(data.sprite)
				}

				frames.push(row)
			}


			path = data.path
		} else {
			const data = loader.getPattern({ src: loader.SRC.TILE, name })

			frames.push(...data.pattern)
			path = data.path
		}

		super({ path, x, y, sprite: frames[0][0] })

		this.frames = frames

		// Recalculate the width and height
		this.width = this.frames[0].reduce((acc, { w }) => acc + w, 0)
		this.height = this.frames.reduce((acc, row) => acc + row[0].h, 0)
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
					if (!row[i - 1]) {
						continue
					}

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

		if (this.#debug) {
			this.drawContainer(ctx)
		}
	}

	/**
	 * Switch debug mode to show grid
	 */
	toogleDebug() {
		this.#debug = !this.#debug
	}
}