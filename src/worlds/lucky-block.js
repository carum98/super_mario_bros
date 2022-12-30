import { Tile } from './tile.js'
import { Coin } from './coin.js'
import { Mushroom } from './mushroom.js'
import { Loader } from '../loaders/index.js'

/**
 * @class
 * @extends Tile
 * @property {boolean} active
 * @property {number} vy
 * @property {number} limit
 * @property {Coin|Mushroom} item
 */
export class LuckyBlock extends Tile {
	/**
	 * @enum {string}
	 * @readonly
	 */
	static ITEM = {
		COIN: 'coin',
		MUSHROOM: 'mushroom',
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

		if (item === LuckyBlock.ITEM.MUSHROOM) {
			this.item = new Mushroom({ x, y: y - this.height })
		} else {
			this.item = new Coin({ x, y: y - this.height })
		}
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

		this.item.x = this.x
		this.item.update()

		super.update()
	}

	/**
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw(ctx) {
		super.draw(ctx)

		this.item.draw(ctx)
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

			this.item.trigger()
		}

		this.active = false
	}

	/**
	 * Toggle debug mode only if item is a [Coin]
	 */
	debugCoin() {
		if (this.item instanceof Coin) {
			this.item.toogleDebug()
		}
	}

	/**
	 * Toggle debug mode only if item is a [Mushroom]
	 */
	debugMushroom() {
		if (this.item instanceof Mushroom) {
			this.item.toogleDebug()
		}
	}
}