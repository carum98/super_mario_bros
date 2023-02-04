import { Koopa } from '../characters/koopa.js'
import { Goomba } from '../characters/goomba.js'
import { BackgroundItem } from '../entities/background-item.js'
import { Pipe } from '../worlds/pipes.js'
import { Tile } from '../worlds/tile.js'
import { BigCoin } from '../worlds/big-coin.js'
import { LuckyBlock } from '../worlds/lucky-block.js'
import { Sprite } from '../entities/sprite.js'
import { Enemy } from '../entities/enemy.js'
import { Flag } from '../worlds/flag.js'
import { Entity } from '../entities/entity.js'
import { Sound } from './sound.js'

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

		/** @type {Array<GameLevelMap>} */
		this.maps = data.maps.map(item => new GameLevelMap(item))

		this.end = new Flag({
			x: data.end.x * 16,
			y: data.end.y * 16,
		})

		Object.freeze(this)
	}

	/**
	 * Get all tiles from all maps
	 * @returns {Array<Sprite>}
	 */
	get tiles() {
		return this.maps.map(map => ([
			...map.tiles.floor,
			...map.tiles.walls,
			...map.tiles.pipes,
			...map.tiles.lucky,
			...map.tiles.blocks,
		])).flat()
	}

	/**
	 * Get all background items from all maps
	 * @returns {Array<BackgroundItem>}
	 */
	get backgroundItems() {
		return this.maps.map(map => ([
			...map.tiles.background,
		])).flat()
	}

	/**
	 * Get all animations from all maps
	 * @returns {Array<Enemy>}
	 */
	get enemies() {
		return this.maps.map(map => ([
			...map.tiles.enemies,
		])).flat()
	}

	/**
	 * Get all coins from all maps
	 * @returns {Array<BigCoin>}
	 */
	get coins() {
		return this.maps.map(map => ([
			...map.tiles.coins,
		])).flat()
	}

	/**
	 * Get all tiles from all maps
	 * @returns {Array<Sprite>}
	 */
	get animations() {
		return this.maps.map(map => ([
			...map.tiles.lucky,
		])).flat()
	}

	/**
	 * Get all checkpoints from all maps
	 * @returns {Array<Entity>}
	 */
	get checkpoints() {
		return [
			this.end,
		]
	}
}

/**
 * @class GameLevelMap
 * @readonly
 */
export class GameLevelMap {
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
		this.music = Sound.Name[data.music]

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
		this.walls = this.#floor(data.wall)
		this.pipes = this.#pipes(data.pipes)
		this.lucky = this.#lucky(data.lucky, data.mushrooms)
		this.blocks = this.#blocks(data.blocks)
		this.enemies = this.#enamies(data.enemies)
		this.background = this.#background(data.background)
		this.coins = this.#coins(data.coins)

		Object.freeze(this)
	}

	/**
	 * @param {Object | undefined} data 
	 * @returns {Tile[]} items
	 */
	#floor(data) {
		const { ranges = [], sprite } = data || {}

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

	/**
	 * @param {Array | undefined} data 
	 * @returns {Pipe[]} items
	 */
	#pipes(data) {
		const items = []

		for (const { coord, sprite } of data || []) {
			for (const { x, y, transport } of coord) {
				items.push(new Pipe({
					x: x * 16,
					y: y * 16,
					name: sprite,
					transport,
				}))
			}
		}

		return items
	}

	/**
	 * @param {Array | undefined} data 
	 * @returns {Tile[]} items
	 */
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

	/**
	 * @param {Array | undefined} data 
	 * @returns {BackgroundItem[]} items
	 */
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

	/**
	 * @param {Array | undefined} data 
	 * @returns {Enemy[]} items
	 */
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

	/**
	 * @param {Object | undefined} data
	 * @param {Object} mushrooms
	 * @returns {LuckyBlock[]} items
	 */
	#lucky(data, mushrooms) {
		const { coord = [], sprite } = data || {}

		const items = []

		for (const lucky of coord) {
			const { x, y } = lucky

			const hasMusroom = mushrooms.coord.some(mushroom => mushroom.x === x && mushroom.y === y)

			const item = hasMusroom ? LuckyBlock.ITEM.MUSHROOM : LuckyBlock.ITEM.COIN

			items.push(new LuckyBlock({ x: x * 16, y: y * 16, name: sprite, item }))
		}

		return items
	}

	/**
	 * @param {Object} data 
	 * @returns {BigCoin[]} items
	 */
	#coins(data) {
		const { coord = [] } = data || {}

		const items = []

		for (const coin of coord) {
			const { x, y } = coin

			items.push(new BigCoin({ x: x * 16, y: y * 16 }))
		}

		return items
	}
}