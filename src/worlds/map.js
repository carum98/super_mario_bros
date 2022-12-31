import { LuckyBlock } from './lucky-block.js'
import { Sprite } from '../entities/sprite.js'
import { BackgroundItem } from '../entities/background-item.js'
import { Loader } from '../loaders/index.js'
import { Enemy } from '../entities/enemy.js'

/**
 * @class
 * @property {Array<Sprite>} tiles
 * @property {Array<Enemy>} enemies
 * @property {HTMLCanvasElement} canvas
 */
export class Map {
	#debug = false

	/**
	 * @type {Array<Sprite>}
	 */
	#buffer = []
	/**
	 * @type {Array<Sprite>}
	*/
	#animations = []

	/**
	 * @type {Array<BackgroundItem>}
	 */
	#bufferBackgroundItems = []
	/**
	 * @type {Array<BackgroundItem>}
	 */
	#backgroundItems = []

	/**
	 * @param {Object} data
	 * @param {HTMLCanvasElement} data.canvas
	 * @param {{ world: number, level: number }} data.map
	 */
	constructor({ canvas, map }) {
		this.canvas = canvas

		/** @type {Array<Sprite>} */
		this.tiles = []
		/** @type {Array<Enemy>} */
		this.enemies = []

		this.#load(`${map.world}-${map.level}`)
	}

	/**
	 * Load level
	 * @param {string} level 
	 */
	async #load(level) {
		const { tiles, backgroundItems, animations, enemies } = await Loader.Level.get(level)

		this.#buffer = tiles
		this.#animations = animations
		this.#bufferBackgroundItems = backgroundItems
		this.enemies = enemies

		// Add only tiles that are visible on the screen
		this.tiles = this.#addTiles(this.#buffer)
		this.#backgroundItems = this.#addTiles(this.#bufferBackgroundItems)
	}

	/**
	 * Update tiles with animation
	 */
	update() {
		this.#animations.forEach(tile => tile.update())
		this.enemies.forEach(enemy => enemy.update(this.canvas, this.tiles))
	}

	/**
	 * Move all tiles to the left and add new tiles that are visible on the screen 
	 * and remove tiles that are out of the screen
	 */
	move() {
		// Add new tiles that are visible on the screen
		this.tiles = this.#addTiles(this.#buffer)

		// Remove tiles that are out of the screen
		this.tiles = this.#removeTiles(this.tiles)

		// Remove from buffer tiles that are already on the screen
		this.#buffer = this.#removeTiles(this.#buffer)

		// -------

		// Add new background items that are visible on the screen
		this.#backgroundItems = this.#addTiles(this.#bufferBackgroundItems)

		// Remove background items that are out of the screen
		this.#backgroundItems = this.#removeTiles(this.#backgroundItems)

		// Remove from buffer background items that are already on the screen
		this.#bufferBackgroundItems = this.#removeTiles(this.#bufferBackgroundItems);

		// -------

		// Move all tiles and background items to the left
		[...this.#buffer, ...this.#bufferBackgroundItems, ...this.enemies].forEach(item => {
			item.x -= 2
		})
	}

	/**
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw(ctx) {
		this.#backgroundItems.forEach(item => item.draw(ctx))
		this.tiles.forEach(tile => tile.draw(ctx))
		this.enemies.forEach(enemy => enemy.draw(ctx))

		// Draw grid
		if (this.#debug) {
			this.#drawGrid(ctx)
		}
	}

	/**
	 * @param {CanvasRenderingContext2D} ctx
	 */
	#drawGrid(ctx) {
		for (let i = 0; i < this.canvas.width; i += 16) {
			ctx.beginPath()
			ctx.moveTo(i, 0)
			ctx.lineTo(i, this.canvas.height)
			ctx.stroke()
		}

		for (let i = 0; i < this.canvas.height; i += 16) {
			ctx.beginPath()
			ctx.moveTo(0, i)
			ctx.lineTo(this.canvas.width, i)
			ctx.stroke()
		}
	}

	/**
	 * @template T
	 * @param {T[]} tiles 
	 * @returns {T[]}
	 */
	#addTiles(tiles) {
		// @ts-ignore
		return tiles.filter(tile => tile.x + tile.width > 0 && tile.x < this.canvas.width)
	}

	/**
	 * @template T
	 * @param {T[]} tiles 
	 * @returns {T[]}
	 */
	#removeTiles(tiles) {
		// @ts-ignore
		return tiles.filter(tile => tile.x + tile.width > 0)
	}

	/**
	 * Toogle all lucky blocks with mushrooms to fire flower
	 */
	toogleMushroomsToFireFlower() {
		this.#buffer.forEach(item => {
			if (item instanceof LuckyBlock) {
				item.toogleMushroomsToFireFlower()
			}
		})
	}

	/**
	 * Switch debug mode to show grid
	 */
	toogleDebug() {
		this.#debug = !this.#debug
	}

	/**
	 * Switch debug mode to all background items
	 */
	toogleBackgroundContainerDebug() {
		this.#bufferBackgroundItems.forEach(item => item.toogleDebug())
	}

	/**
	 * Switch debug mode to all coins
	 */
	toogleMushroosDebug() {
		this.#buffer.forEach(item => {
			if (item instanceof LuckyBlock) {
				item.debugMushroom()
			}
		})
	}

	/**
	 * Expose params for debug
	 * @returns {MapDebugParams} MapDebugParams
	 */
	get debugParams() {
		return {
			tiles: this.#buffer.length,
			visibleTiles: this.tiles.length,
			backgroundItems: this.#bufferBackgroundItems.length,
			visibleBackgroundItems: this.#backgroundItems.length,
			enemies: this.enemies.length,
			visibleEnemies: this.enemies.filter(enemy => enemy.isActive).length,
		}
	}
}