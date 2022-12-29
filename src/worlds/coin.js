import { Sprite } from '../core/sprite.js'
import { getAnimation } from '../core/utils.js'

import SpritesData from '../../assets/sprites/player.json' assert {type: 'json'}

const emptySprite = { x: -20, y: -20, w: 16, h: 16 }

export class Coin extends Sprite {
	#debug = false
	#active = false

	constructor({ x, y }) {
		const { src, sprites, animations } = SpritesData

		super({ src, x, y, sprite: emptySprite })

		this.aimation = getAnimation({ sprites, animations, name: 'coin' })

		this.vy = 0
		this.limit = y
	}

	update() {
		if (this.#active) {
			this.y += this.vy
			this.vy += 0.2

			if (this.y >= this.limit) {
				this.y = this.limit
				this.vy = 0

				this.clearAnimation()

				this.sprite = emptySprite
				this.#active = false
			}

			super.update()
		}
	}

	hit() {
		this.#active = true

		const { frames, speed } = this.aimation

		this.vy = -4
		this.setAnimation({ frames, speed })
	}

	/**
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw(ctx) {
		if (this.#active) {
			super.draw(ctx)
		}

		if (this.#debug) {
			this.drawContainer(ctx)
		}
	}

	/**
	 * Switch debug mode to show grid
	 */
	toogleDebug() {
		this.#debug = !this.#debug
	}
}