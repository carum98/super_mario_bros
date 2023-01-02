import { Loader } from '../loaders/index.js'
import { Information } from '../ui/information.js'
import { Text } from '../ui/text.js'

export class MenuScreen {
	#hero = {
		x: 0,
		y: 128,
		width: 176,
		height: 88,
	}

	#tile = {
		x: 96,
		y: 128,
		width: 16,
		height: 32,
	}

	#mario = {
		x: 0,
		y: 88,
		w: 16,
		h: 16
	}

	#indicator = {
		x: 112,
		y: 208,
		w: 8,
		h: 8
	}

	constructor({ canvas }) {
		this.ctx = canvas.getContext('2d')

		this.information = new Information()

		this.x = 40
		this.y = 34

		this.image = new Image()
		this.image.src = 'assets/img/tiles.png'

		this.image2 = new Image()
		this.image2.src = `assets/img/sprites.png`

		this.texts = [
			new Text({ text: '@2022 CARUM98', x: 110, y: 123 }),
			new Text({ text: '1 PLAYER GAME', x: 80, y: 144 }),
			new Text({ text: '2 PLAYER GAME', x: 80, y: 154 }),
			new Text({ text: 'TOP -  000000', x: 80, y: 175 }),
		]

		this.indicatorPosition = 1

		this.tiles = []
		this.background = []

		this.#load()
		document.addEventListener('keydown', this.#moveIndicator.bind(this))
	}

	render() {
		const { ctx, image, image2 } = this

		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

		this.information.draw(ctx)
		this.texts.forEach(text => text.draw(ctx))

		this.tiles.forEach(item => item.draw(ctx))
		this.background.forEach(item => item.draw(ctx))

		const { x: xHero, y: yHero, width: wHero, height: hHero } = this.#hero
		const { x: xTile, y: yTile, width: wTile, height: hTile } = this.#tile
		const { x: xMario, y: yMario, w: wMario, h: hMario } = this.#mario
		const { x: xIndicator, y: yIndicator, w: wIndicator, h: hIndicator } = this.#indicator

		ctx.save()

		// Hero
		ctx.drawImage(
			image,
			xHero, yHero, wHero, hHero,
			this.x, this.y, wHero, hHero
		)

		ctx.drawImage(
			image,
			xTile, yTile, wTile, hTile,
			152, this.y, wTile, hTile
		)

		ctx.drawImage(
			image,
			xTile, yTile, wTile, hTile,
			168, this.y, wTile, hTile
		)

		// Indicator
		const indicatorY = this.texts[this.indicatorPosition].y

		ctx.drawImage(
			image2,
			xIndicator, yIndicator, wIndicator, hIndicator,
			this.x + 24, indicatorY, wIndicator, hIndicator
		)

		// Mario
		ctx.drawImage(
			image2,
			xMario, yMario, wMario, hMario,
			this.x, 16 * 12, wMario, hMario
		)

		ctx.restore()
	}

	async #load() {
		const { tiles, backgroundItems } = await Loader.Level.get('0-0')

		this.tiles = tiles
		this.background = backgroundItems
	}

	/**
	 * @param {KeyboardEvent} e 
	 */
	#moveIndicator(e) {
		if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
			if (e.key === 'ArrowUp') {
				this.indicatorPosition = 1
			}

			if (e.key === 'ArrowDown') {
				this.indicatorPosition = 2
			}

			this.render()
		}
	}

	/**
	 * Remove all events
	 */
	dispose() {
		document.removeEventListener('keydown', this.#moveIndicator)
	}
}