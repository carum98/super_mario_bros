import { Controls } from "./controls.js"

export class Game {
	constructor({ canvas, player }) {
		this.player = player
		this.player.y = canvas.height - this.player.height

		this.ctx = canvas.getContext('2d')

		this.controls = new Controls()
	}

	start() {
		this.controls.startListening()
	}

	render() {
		this.#update()
		this.#draw()
	}

	#update() {
		this.player.update(this.controls)
	}

	#draw() {
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)

		this.player.draw(this.ctx)
	}
}