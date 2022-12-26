import { Controls } from "./controls.js"
import { Sprite } from "./sprite.js"

export class Player extends Sprite {
	constructor() {
		super({
			image: "assets/sprites.png",
			x: 0,
			y: 0,
			width: 16,
			height: 32,
			sprite: { x: 112, y: 88 }
		})

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
			this.vy = -8
		}

		this.y += this.vy

		if (!this.onGround()) {
			this.vy += 0.5
		} else {
			this.vy = 0
		}
	}

	onGround() {
		return this.y >= canvas.height - this.height - 32
	}
}