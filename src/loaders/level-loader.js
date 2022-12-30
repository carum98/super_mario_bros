import { BackgroundItem } from '../core/background-item.js'
import { Sprite } from '../core/sprite.js'
import { LuckyBlock } from '../worlds/lucky-block.js'
import { Pipe } from '../worlds/pipes.js'
import { Tile } from '../worlds/tile.js'

export class LevelLoader {
	/**
	 * @param {string} level
	 * @returns {Promise<{ tiles: Array<Sprite>, backgroundItems: Array<BackgroundItem>, animations: Array<Sprite> }>}
	 */
	static async get(level) {
		const data = await import(`../../assets/levels/${level}.json`, { assert: { type: "json" } })

		const { floor, pipes, lucky, blocks, background, mushrooms } = data.default

		const tiles = []
		const backgroundItems = []
		const animations = []

		// Floor
		for (let range of floor.ranges) {
			const { x, y, columns, rows } = range

			for (let i = 0; i < columns; i++) {
				for (let j = 0; j < rows; j++) {
					tiles.push(new Tile({
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
			tiles.push(new Pipe({ x: x * 16, y: y * 16 }))
		}

		// Lucky blocks
		for (const block of lucky.coord) {
			const { x, y } = block

			const hasMusroom = mushrooms.coord.some(mushroom => mushroom.x === x && mushroom.y === y)

			const item = hasMusroom ? LuckyBlock.ITEM.MUSHROOM : LuckyBlock.ITEM.COIN

			const luckyBlock = new LuckyBlock({ x: x * 16, y: y * 16, item })

			tiles.push(luckyBlock)
			animations.push(luckyBlock)
		}

		// Blocks
		for (const { coord, sprite } of blocks) {
			for (const block of coord) {
				const { x, y } = block
				tiles.push(new Tile({ x: x * 16, y: y * 16, name: sprite }))
			}
		}

		// Background items
		for (const { coord, name, type } of background) {
			for (const item of coord) {
				const { x, y } = item
				backgroundItems.push(new BackgroundItem({ x: x * 16, y: y * 16, name, type }))
			}
		}

		return {
			tiles,
			backgroundItems,
			animations,
		}
	}
}