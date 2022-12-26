import { Pipe } from './pipes.js'
import { Tile, TILE } from './tile.js'

export class Map {
	constructor({ canvas }) {
		this.tiles = []

		// Floor
		for (let i = 0; i < canvas.width / 16; i++) {
			const x = i * 16

			this.tiles.push(...[
				new Tile({ x, y: canvas.height - 32, sprite: TILE.CONCRETE }),
				new Tile({ x, y: canvas.height - 16, sprite: TILE.CONCRETE }),
			])
		}

		// Pipes
		this.tiles.push(...[
			new Pipe({ x: 64, y: canvas.height - 64 }),
		])
	}

	draw(ctx) {
		this.tiles.forEach(tile => {
			tile.draw(ctx)
		})
	}
}