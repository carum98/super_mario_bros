import { Controls } from "./controls.js"
import { GameElement } from "./game-element.js"

export class Player extends GameElement {
	constructor() {
		super({ x: 0, y: 0, width: 20, height: 40 })

		this.vy = 0
		this.speed = 3
	}

	update(controls) {
		const { keys } = controls

		// Horizontal movement
		const direction = keys[0]

		if (direction) {
			const { x } = Controls.AXIS[direction]

			this.x += x * this.speed
		}

		// Vertical movement
		if (keys.includes(Controls.DIRECTIONS.UP) && this.onGround()) {
			this.vy = -10
		}

		this.y += this.vy

		if (!this.onGround()) {
			this.vy += 0.5
		} else {
			this.vy = 0
		}
	}

	onGround() {
		return this.y >= canvas.height - this.height
	}
}