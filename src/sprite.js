import { GameElement } from './game-element.js'

export class Sprite extends GameElement {
	constructor({ image, x, y, sprite, width, height }) {
		super({ x, y, width, height })

		this.image = new Image()
		this.image.src = image

		this.sprite = sprite
	}

	draw(ctx) {
		const { image, x, y, width, height } = this
		const { x: sx, y: sy } = this.sprite

		ctx.drawImage(image, sx, sy, width, height, x, y, width, height)
	}
}