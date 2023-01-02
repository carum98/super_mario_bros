import { Text } from './text.js'
import { Sprite } from '../entities/sprite.js'
import { Loader } from '../loaders/index.js'
import { Game } from '../core/game.js'

export class Information {
	#interval = 0

	constructor() {
		this.texts = [
			new Text({
				text: 'MARIO',
				x: 16,
				y: 16,
			}),
			new Text({
				text: '000000',
				x: 16,
				y: 24,
			}),
			new Text({
				text: '×00',
				x: 96,
				y: 24,
			}),
			new Text({
				text: 'WORLD',
				x: 144,
				y: 16,
			}),
			new Text({
				text: '1-1',
				x: 152,
				y: 24,
			}),
			new Text({
				text: 'TIME',
				x: 208,
				y: 16,
			}),
			new Text({
				text: '000',
				x: 216,
				y: 24,
			})
		]

		const { path, animation } = Loader.Sprite.getAnimation({ src: Loader.Sprite.SRC.PLAYER, name: 'coin-score' })

		this.coin = new Sprite({ path, x: 88, y: 24, sprite: animation.frames[0] })
		this.coin.setAnimation(animation)
	}

	/**
	 * @param {Game} game 
	 */
	update(game) {
		this.coin.update()

		this.#interval = (this.#interval + 1) % 60

		if (this.#interval === 0) {
			game.timer -= 1

			const { score, coins, timer } = game

			this.texts[1].updateText(score.toString().padStart(6, '0'))
			this.texts[2].updateText('×' + coins.toString().padStart(2, '0'))
			this.texts[6].updateText(timer.toString().padStart(3, '0'))
		}
	}

	/**
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw(ctx) {
		this.texts.forEach((text) => text.draw(ctx))
		this.coin.draw(ctx)
	}
}