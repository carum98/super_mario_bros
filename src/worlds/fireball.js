import { Controls } from '../core/controls.js'
import { MovementController } from '../core/movement.js'
import { Sound } from '../core/sound.js'
import { GameElement } from '../entities/game-element.js'
import { Sprite } from '../entities/sprite.js'
import { Loader } from '../loaders/index.js'

export class FireBall extends Sprite {
	#active = true

	constructor({ x, y, direction }) {
		const { path, animation } = Loader.Sprite.getAnimation({
			src: Loader.Sprite.SRC.PLAYER,
			name: 'fireball'
		})

		super({ path, x, y, sprite: animation.frames[0] })

		this.setAnimation(animation)

		this.direction = Controls.DIRECTIONS.DOWN

		this.directionHorizontal = direction

		this.limit = y
	}

	/**
	 * @param {Sprite[]} tiles 
	 */
	// @ts-ignore
	update(tiles) {
		if (!this.#active) return

		const { bottom, top, right, left } = MovementController.collisions(this, tiles)

		if (bottom) {
			this.direction = Controls.DIRECTIONS.UP
		}

		if (top || this.limit >= this.y) {
			this.direction = Controls.DIRECTIONS.DOWN
		}

		if (left || right) {
			this.#active = false

			Sound.play(Sound.Name.bump)
		}

		const { y } = Controls.AXIS[this.direction]
		const { x } = Controls.AXIS[this.directionHorizontal]

		this.x += 2 * x
		this.y += 0.5 * y

		super.update()
	}

	/**
	 * @param {CanvasRenderingContext2D} ctx 
	 */
	draw(ctx) {
		if (!this.#active) return

		super.draw(ctx)
	}

	/**
	 * @param {GameElement} element 
	 * @returns boolean
	 */
	conllidesWith(element) {
		if (!this.#active) return false

		return super.conllidesWith(element)
	}
}