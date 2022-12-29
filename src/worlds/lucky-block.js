import { getSprite } from '../core/utils.js'
import { Tile } from './tile.js'
import { Coin } from './coin.js'

import SpritesData from '../../assets/sprites/tile.json' assert {type: 'json'}

export class LuckyBlock extends Tile {
	constructor({ x, y }) {
		super({ x, y, name: Tile.TYPE.LUCKY, isSolid: false })

		this.active = true

		this.vy = 0
		this.limit = y

		this.coin = new Coin({ x, y: y - this.height })
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

		this.coin.x = this.x
		this.coin.update()

		super.update()
	}

	/**
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw(ctx) {
		super.draw(ctx)

		this.coin.draw(ctx)
	}

	hit() {
		if (this.active) {
			this.vy = -2

			this.sprite = getSprite({ sprites: SpritesData.sprites, name: Tile.TYPE.METAL })
			this.clearAnimation()

			this.coin.hit()
		}

		this.active = false
	}

	debugCoin() {
		this.coin.toogleDebug()
	}
}