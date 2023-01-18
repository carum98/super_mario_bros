import { Koopa } from '../characters/koopa.js'
import { Goomba } from '../characters/goomba.js'
import { BackgroundItem } from '../entities/background-item.js'
import { Pipe } from '../worlds/pipes.js'
import { Tile } from '../worlds/tile.js'

/**
 * @class GameLevel
 * @readonly
 */
export class GameLevel {
	/**
	 * @param {Object} data
	 */
	constructor(data) {
		this.name = data.name
		this.colums = data.colums
		this.rows = data.rows
		this.maps = data.maps.map(item => new GameLevelMap(item))

		Object.freeze(this)
	}
}

/**
 * @class GameLevelMap
 * @readonly
 */
class GameLevelMap {
	/**
	 * @param {Object} data
	 */
	constructor(data) {
		this.name = data.name
		this.colums = data.colums
		this.rows = data.rows
		this.start = data.start
		this.end = data.end
		this.background = data.background
		this.music = data.music

		this.tiles = new GameLevelTiles(data.tiles)

		Object.freeze(this)
	}
}

/**
 * @class GameLevelTiles
 * @readonly
 */
class GameLevelTiles {
	/**
	 * @param {Object} data
	 */
	constructor(data) {
		this.floor = this.#floor(data.floor)
		this.pipes = this.#pipes(data.pipes)
		this.lucky = data.lucky
		this.blocks = this.#blocks(data.blocks)
		this.mushrooms = data.mushrooms
		this.enemies = this.#enamies(data.enemies)
		this.background = this.#background(data.background)
		this.checkpoints = data.checkpoints

		Object.freeze(this)
	}

	#floor(data) {
		const { ranges = [], sprite } = data

		const items = []

		for (const { x, y, columns, rows } of ranges) {
			for (let i = 0; i < columns; i++) {
				for (let j = 0; j < rows; j++) {
					items.push(new Tile({
						x: x * 16 + i * 16,
						y: y * 16 + j * 16,
						name: sprite,
					}))
				}
			}
		}

		return items
	}

	#pipes(data) {
		const { coord = [], sprite } = data

		const items = []

		for (const { x, y, transport } of coord) {
			items.push(new Pipe({
				x: x * 16,
				y: y * 16,
				name: sprite,
				transport,
			}))
		}

		return items
	}

	#blocks(data) {
		const items = []

		for (const { coord, sprite } of data || []) {
			for (const { x, y } of coord) {
				items.push(new Tile({
					x: x * 16,
					y: y * 16,
					name: sprite
				}))
			}
		}

		return items
	}

	#background(data) {
		const items = []

		for (const { coord, name, type } of data || []) {
			for (const { x, y } of coord) {
				items.push(new BackgroundItem({
					x: x * 16,
					y: y * 16,
					name,
					type
				}))
			}
		}

		return items
	}

	#enamies(data) {
		const items = []

		for (const { coord, name } of data || []) {
			for (const enemy of coord) {
				const { x, y } = enemy

				if (name === 'goomba') {
					items.push(new Goomba({ x: x * 16, y: y * 16 }))
				}

				if (name === 'koopa') {
					items.push(new Koopa({ x: x * 16, y: y * 16 }))
				}
			}
		}

		return items
	}
}