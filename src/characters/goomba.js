import { Enemy } from '../entities/enemy.js'
import { Loader } from '../loaders/index.js'
import { timeout } from '../utilities/utils.js'

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

	/**
	 * @override
	 * @returns {Promise<void>}
	 */
	killed() {
		super.killed()

		this.clearAnimation()

		const { sprite } = Loader.Sprite.getSprite({
			src: Loader.Sprite.SRC.PLAYER,
			name: 'goomba-dead'
		})

		this.sprite = sprite

		return timeout(200)
	}
}