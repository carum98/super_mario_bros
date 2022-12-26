import { Pipe } from './pipes.js'
import { Tile } from './tile.js'

/**
 * @class
 * @property {Array<Sprite>} tiles
 */
export class Map {
	/**
	 * @param {Object} data
	 * @param {HTMLCanvasElement} data.canvas
	 */
	constructor({ canvas }) {
		this.tiles = []

		// Floor
		for (let i = 0; i < canvas.width / 16; i++) {
			const x = i * 16

			this.tiles.push(...[
				new Tile({ x, y: canvas.height - 32, name: Tile.TYPE.CONCRETE }),
				new Tile({ x, y: canvas.height - 16, name: Tile.TYPE.CONCRETE }),
			])
		}

		// Pipes
		this.tiles.push(...[
			new Pipe({ x: 64, y: canvas.height - 64 }),
		])
	}

	/**
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw(ctx) {
		this.tiles.forEach(tile => {
			tile.draw(ctx)
		})
	}
}