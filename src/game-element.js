export class GameElement {
	constructor({ x, y, width, height }) {
		this.x = x
		this.y = y

		this.width = width
		this.height = height
	}

	draw(ctx) {
		ctx.fillRect(this.x, this.y, this.width, this.height)
	}

	conllidesWith(element) {
		return (
			this.x < element.x + element.width &&
			this.x + this.width > element.x &&
			this.y < element.y + element.height &&
			this.y + this.height > element.y
		)
	}
}