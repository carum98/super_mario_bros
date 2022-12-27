import { Tile } from './tile.js'

export class LuckyBlock extends Tile {
	constructor({ x, y }) {
		super({ x, y, name: Tile.TYPE.LUCKY, isSolid: false })
	}
}