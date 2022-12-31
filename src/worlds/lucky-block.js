import { Tile } from './tile.js'
import { Mushroom } from './mushroom.js'
import { Loader } from '../loaders/index.js'
import { FireFlower } from './fire-flower.js'
import { Entity } from '../entities/entity.js'
import { Coin } from './coin.js'

/**
 * @class
 * @extends Tile
 * @property {boolean} active
 * @property {number} vy
 * @property {number} limit
 * @property {LuckyBlock.ITEM} item
 */
export class LuckyBlock extends Tile {
	/**
	 * @enum {string}
	 * @readonly
	 */
	static ITEM = {
		COIN: 'coin',
		MUSHROOM: 'mushroom',
		FIRE_FLOWER: 'fire-flower',
	}

	/**
	 * @param {Object} param 
	 * @param {number} param.x
	 * @param {number} param.y
	 * @param {ITEM} param.item
	 */
	constructor({ x, y, item }) {
		super({ x, y, name: Tile.TYPE.LUCKY, isSolid: false })

		this.active = true

		this.vy = 0
		this.limit = y

		this.type = item
	}

	update() {
		if (!this.active) {
			this.y += this.vy
			this.vy += 0.5

			if (this.y >= this.limit) {
				this.y = this.limit
				this.vy = 0
			}
		}

		super.update()
	}

	/**
	 * Get item from lucky block
	 * @returns {Entity}
	 */
	getItem() {
		const x = this.x
		const y = this.y - this.height

		if (this.type === LuckyBlock.ITEM.MUSHROOM) {
			return new Mushroom({ x, y })
		}

		if (this.type === LuckyBlock.ITEM.FIRE_FLOWER) {
			return new FireFlower({ x, y })
		}

		return new Coin({ x, y })
	}

	/**
	 * Start lucky block animation and trigger item
	 */
	hit() {
		if (this.active) {
			this.vy = -2

			const { sprite } = Loader.Sprite.getSprite({
				src: Loader.Sprite.SRC.TILE,
				name: Tile.TYPE.METAL
			})

			this.sprite = sprite

			this.clearAnimation()
		}

		this.active = false
	}

	/**
	 * Toggle item between [Mushroom] and [FireFlower]
	 */
	toogleMushroomsToFireFlower() {
		if (this.type === LuckyBlock.ITEM.COIN) return

		if (this.type === LuckyBlock.ITEM.MUSHROOM) {
			this.type = LuckyBlock.ITEM.FIRE_FLOWER
		} else {
			this.type = LuckyBlock.ITEM.MUSHROOM
		}
	}
}