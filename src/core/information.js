import { Text } from './text.js'
import { Sprite } from './sprite.js'
import { getAnimation } from './utils.js'

import SpritesData from '../../assets/sprites/player.json' assert {type: 'json'}

export class Information {
	#interval = 0

	constructor({ game }) {
		this.game = game

		this.texts = [
			new Text({
				text: 'MARIO',
				x: 16,
				y: 16,
			}),
			new Text({
				text: 'WORLD',
				x: 144,
				y: 16,
			}),
			new Text({
				text: 'TIME',
				x: 208,
				y: 16,
			}),
			new Text({
				text: '1-1',
				x: 152,
				y: 24,
			})
		]

		this.values = this.#getValues()

		const { src, sprites, animations } = SpritesData
		const { frames, speed } = getAnimation({ sprites, animations, name: 'coin-score' })

		const sprite = frames[0]

		this.coin = new Sprite({ x: 88, y: 24, src, sprite })
		this.coin.setAnimation({ frames, speed })
	}

	update() {
		this.coin.update()

		this.#interval = (this.#interval + 1) % 60

		if (this.#interval === 0) {
			this.game.timer -= 1
			this.values = this.#getValues()
		}
	}

	/**
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw(ctx) {
		[...this.texts, ...this.values].forEach((text) => {
			text.draw(ctx)
		})

		this.coin.draw(ctx)
	}

	#getValues() {
		const score = new Text({
			text: this.game.score.toString().padStart(6, '0'),
			x: 16,
			y: 24,
		})

		const coins = new Text({
			text: '×' + this.game.coins.toString().padStart(2, '0'),
			x: 96,
			y: 24,
		})

		const time = new Text({
			text: this.game.timer.toString().padStart(3, '0'),
			x: 216,
			y: 24,
		});

		return [score, coins, time]
	}
}