import { Pipe } from './pipes.js'
import { Tile } from './tile.js'
import { LuckyBlock } from './lucky-block.js'
import { Sprite } from '../core/sprite.js'

import Level from '../../assets/levels/1-1.json' assert {type: 'json'}

/**
 * @class
 * @property {Array<Sprite>} tiles
 * @property {Array<Sprite>} tilesWithAnimation
 */
export class Map {
	/**
	 * @type {Array<Sprite>}
	 */
	#buffer = []
	/**
	 * @type {Array<Sprite>}
	*/
	#animations = []

	/**
	 * @param {Object} data
	 * @param {HTMLCanvasElement} data.canvas
	 */
	constructor({ canvas }) {
		this.tiles = []

		this.canvas = canvas

		const { floor, pipes, lucky, blocks } = Level

		// Floor
		for (let range of floor.ranges) {
			const { x, y, columns, rows } = range

			for (let i = 0; i < columns; i++) {
				for (let j = 0; j < rows; j++) {
					this.#buffer.push(new Tile({
						x: x * 16 + i * 16,
						y: y * 16 + j * 16,
						name: floor.sprite,
					}))
				}
			}
		}

		// Pipes
		for (const pipe of pipes.coord) {
			const { x, y } = pipe
			this.#buffer.push(new Pipe({ x: x * 16, y: y * 16 }))
		}

		// Lucky blocks
		for (const block of lucky.coord) {
			const { x, y } = block

			const luckyBlock = new LuckyBlock({ x: x * 16, y: y * 16 })

			this.#buffer.push(luckyBlock)
			this.#animations.push(luckyBlock)
		}

		// Blocks
		for (const block of blocks.coord) {
			const { x, y } = block
			this.#buffer.push(new Tile({ x: x * 16, y: y * 16, name: blocks.sprite }))
		}

		// Add only tiles that are visible on the screen
		this.tiles = this.#buffer.filter(tile => {
			return tile.x + tile.width > 0 && tile.x < this.canvas.width
		})
	}

	update() {
		this.#animations.forEach(tile => tile.update())
	}

	move() {
		// Add new tiles that are visible on the screen
		this.tiles = this.#buffer.filter(tile => {
			return tile.x + tile.width > 0 && tile.x < this.canvas.width + 5
		})

		// Remove tiles that are out of the screen
		this.tiles = this.tiles.filter(tile => {
			return tile.x + tile.width > 0
		})

		this.#buffer.forEach(tile => {
			tile.x -= 2
		})
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