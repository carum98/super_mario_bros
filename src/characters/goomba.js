import { Enemy } from '../entities/enemy.js'
import { Loader } from '../loaders/index.js'

/**
 * @class
 * @extends Enemy
 */
export class Goomba extends Enemy {
	constructor({ x, y }) {
		const { path, animation } = Loader.Sprite.getAnimation({
			src: Loader.Sprite.SRC.PLAYER,
			name: 'goomba'
		})

		const sprite = animation.frames[0]

		super({ path, x, y, sprite })

		this.setAnimation(animation)
	}
}