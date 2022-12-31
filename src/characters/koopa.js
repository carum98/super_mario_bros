import { Controls } from '../core/controls.js'
import { Enemy } from '../entities/enemy.js'
import { Loader } from '../loaders/index.js'

/**
 * @class
 * @extends Enemy
 */
export class Koopa extends Enemy {
	constructor({ x, y }) {
		const { path, animation } = Loader.Sprite.getAnimation({
			src: Loader.Sprite.SRC.PLAYER,
			name: 'koopa'
		})

		const sprite = animation.frames[0]

		super({ path, x, y, sprite })

		this.setAnimation(animation)

		this.y -= 8
	}

	/**
	 * @param {CanvasRenderingContext2D} ctx 
	 */
	draw(ctx) {
		const flip = this.direction === Controls.DIRECTIONS.LEFT

		super.draw(ctx, flip)
	}
}