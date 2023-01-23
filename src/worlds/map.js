import { LuckyBlock } from './lucky-block.js'
import { Sprite } from '../entities/sprite.js'
import { BackgroundItem } from '../entities/background-item.js'
import { Loader } from '../loaders/index.js'
import { Enemy } from '../entities/enemy.js'
import { Entity } from '../entities/entity.js'
import { DIRECTIONS } from '../core/controls.js'
import { BigCoin } from './big-coin.js'
import { GameLevelMap } from '../core/game-level.js'

/**
 * @class
 */
export class Map {
	#debug = false

	/**
	 * @type {Array<Sprite>}
	 */
	#bufferTiles = []

	/**
	 * @type {Array<BackgroundItem>}
	 */
	#bufferBackground = []

	/**
	 * @type {Array<BigCoin>}
	 */
	#bufferCoins = []

	/**
	 * @type {Array<Entity>}
	 */
	#bufferCheckpoints = []

	/**
	 * @type {Array<GameLevelMap>}
	 */
	#bufferMaps = []

	/**
	 * @param {Object} data
	 * @param {HTMLCanvasElement} data.canvas
	 * @param {{ world: number, level: number }} data.map
	 */
	constructor({ canvas, map }) {
		this.canvas = canvas

		/** @type {Array<Sprite>} */
		this.tiles = []
		/** @type {Array<BackgroundItem>} */
		this.backgroundItems = []
		/** @type {Array<Enemy>} */
		this.enemies = []
		/** @type {Array<BigCoin>} */
		this.coins = []
		/** @type {Array<Sprite>} */
		this.animations = []
		/** @type {Array<Entity>} */
		this.checkpoints = []

		this.#load(`${map.world}-${map.level}`)

		this.pixel = 0
		this.column = 0

		this.indexMap = 0
	}

	/**
	 * @returns {boolean}
	 */
	get limit() {
		return this.column + 16 > (this.#bufferMaps[this.indexMap]?.end || 0)
	}

	/**
	 * @returns {GameLevelMap}
	 */
	get currentMap() {
		return this.#bufferMaps[this.indexMap]
	}

	/**
	 * Load level
	 * @param {string} level 
	*/
	async #load(level) {
		const gameLevel = await Loader.Level.get(level)

		this.#bufferTiles = gameLevel.tiles
		this.#bufferBackground = gameLevel.backgroundItems
		this.#bufferCoins = gameLevel.coins
		this.#bufferCheckpoints = gameLevel.checkpoints

		this.animations = gameLevel.animations
		this.enemies = gameLevel.enemies

		this.#bufferMaps = gameLevel.maps

		this.#activateTiles()
	}

	/**
	 * Update tiles with animation
	 */
	update() {
		this.animations.forEach(tile => tile.update())
		this.enemies.forEach(enemy => enemy.update(this.canvas, this.tiles))
		this.coins.forEach(coin => coin.update())
		this.checkpoints.forEach(checkpoint => checkpoint.update())
	}

	/**
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw(ctx) {
		this.backgroundItems.forEach(tile => tile.draw(ctx))
		this.tiles.forEach(tile => tile.draw(ctx))
		this.enemies.forEach(enemy => enemy.draw(ctx))
		this.coins.forEach(coin => coin.draw(ctx))
		this.checkpoints.forEach(checkpoint => checkpoint.draw(ctx))

		// Draw grid
		if (this.#debug) {
			this.#drawGrid(ctx)
		}
	}

	/**
	 * Move all tiles to the left and add new tiles that are visible on the screen 
	 * and remove tiles that are out of the screen
	 */
	move() {
		// Keep only tiles that are visible on the screen
		this.#activateTiles()
		this.#deactivateTiles()

		// Move all tiles and background items to the left
		this.#moveAllItems(2, DIRECTIONS.LEFT)

		// Increase column every 16 pixels
		this.pixel += 2

		if (this.pixel >= 16) {
			this.pixel = 0
			this.column++
		}
	}

	/**
	 * @param {number} col 
	 */
	moveTo(col) {
		const relativeCol = col - this.column

		const x = 16 * relativeCol - this.pixel

		this.#moveAllItems(x, x >= 0 ? DIRECTIONS.LEFT : DIRECTIONS.RIGHT)

		this.column += relativeCol

		this.#activateTiles()
	}

	/**
	 * @param {{ map: string, direction: string, column: number? }} transport 
	 */
	moveToMap(transport) {
		const index = this.#bufferMaps.findIndex(map => map.name === transport.map)

		if (index !== -1) {
			this.indexMap = index

			const map = this.currentMap

			// Move the map to the start column of the map
			this.moveTo(transport.direction === 'in' ? map.start : transport.column)

			if (transport.direction === 'out') {
				this.#deactivateTiles()
			}
		}
	}

	/**
	 * Toogle all lucky blocks with mushrooms to fire flower
	 */
	toogleMushroomsToFireFlower() {
		this.#bufferTiles.forEach(item => {
			if (item instanceof LuckyBlock) {
				item.toogleMushroomsToFireFlower()
			}
		})
	}

	#activateTiles() {
		// Add new tiles that are visible on the screen
		this.tiles = this.#addTiles(this.#bufferTiles)

		// Add new background items that are visible on the screen
		this.backgroundItems = this.#addTiles(this.#bufferBackground)

		// Add new checkpoints that are visible on the screen
		this.checkpoints = this.#addTiles(this.#bufferCheckpoints)

		// Add new coins that are visible on the screen
		this.coins = this.#addTiles(this.#bufferCoins)
	}

	#deactivateTiles() {
		// Remove tiles that are out of the screen
		this.tiles = this.#removeTiles(this.tiles)

		// Remove from buffer tiles that are already on the screen
		this.#bufferTiles = this.#removeTiles(this.#bufferTiles)

		// Remove background items that are out of the screen
		this.backgroundItems = this.#removeTiles(this.backgroundItems)

		// Remove from buffer background items that are already on the screen
		this.#bufferBackground = this.#removeTiles(this.#bufferBackground)

		// Remove checkpoints that are out of the screen
		this.#bufferCheckpoints = this.#removeTiles(this.#bufferCheckpoints)

		// Remove from buffer checkpoints that are already on the screen
		this.checkpoints = this.#removeTiles(this.checkpoints)
	}

	/**
	 * @param {number} x 
	 * @param {DIRECTIONS} direction
	 */
	#moveAllItems(x, direction) {
		[...this.#bufferTiles, ...this.#bufferBackground, ...this.#bufferCoins, ...this.#bufferCheckpoints, ...this.enemies].forEach(item => {
			if (direction === DIRECTIONS.LEFT) {
				item.x -= Math.abs(x)
			}

			if (direction === DIRECTIONS.RIGHT) {
				item.x += Math.abs(x)
			}
		})
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

	// -- Debug -- //
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
		this.#bufferBackground.forEach(item => item.toogleDebug())
	}

	/**
	 * Expose params for debug
	 * @returns {MapDebugParams} MapDebugParams
	 */
	get debugParams() {
		return {
			tiles: this.#bufferTiles.length,
			visibleTiles: this.tiles.length,
			backgroundItems: this.#bufferBackground.length,
			visibleBackgroundItems: this.backgroundItems.length,
			enemies: this.enemies.length,
			visibleEnemies: this.enemies.filter(enemy => enemy.isActive).length,
			column: this.column,
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
}