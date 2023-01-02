import { Information } from '../ui/information.js'
import { Text } from '../ui/text.js'

export class LoadingScreen {
	#mario = {
		x: 0,
		y: 88,
		w: 16,
		h: 16
	}

	constructor({ canvas, world, level }) {
		this.canvas = canvas
		this.world = world
		this.level = level

		this.ctx = canvas.getContext('2d')

		this.information = new Information()

		this.image = new Image()
		this.image.src = 'assets/img/sprites.png'

		const center = { x: canvas.width / 2, y: canvas.height / 2 }

		this.texts = [
			new Text({ text: `WORLD ${world}-${level}`, x: center.x - 35, y: center.y - 20 }),
			new Text({ text: '×', x: center.x, y: center.y }),
			new Text({ text: '3', x: center.x + 20, y: center.y }),
		]
	}

	render() {
		const { ctx, canvas, image } = this

		ctx.fillStyle = 'black'
		ctx.fillRect(0, 0, canvas.width, canvas.height)

		this.information.draw(ctx)

		const { x: xMario, y: yMario, w: wMario, h: hMario } = this.#mario

		ctx.drawImage(
			image,
			xMario, yMario, wMario, hMario,
			canvas.width / 2 - 30, canvas.height / 2 - 5, wMario, hMario
		)

		this.texts.forEach(text => text.draw(ctx))
	}
}