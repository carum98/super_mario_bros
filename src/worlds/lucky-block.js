import { getSprite } from '../core/utils.js'
import { Tile } from './tile.js'
import { Coin } from './coin.js'
import { Mushroom } from './mushroom.js'

import SpritesData from '../../assets/sprites/tile.json' assert {type: 'json'}

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

	hit() {
		if (this.active) {
			this.vy = -2

			this.sprite = getSprite({ sprites: SpritesData.sprites, name: Tile.TYPE.METAL })
			this.clearAnimation()

			this.item.trigger()
		}

		this.active = false
	}

	debugCoin() {
		if (this.item instanceof Coin) {
			this.item.toogleDebug()
		}
	}

	debugMushroom() {
		if (this.item instanceof Mushroom) {
			this.item.toogleDebug()
		}
	}
}