import { Player } from '../characters/player.js'
import { Entity } from '../entities/entity.js'
import { Loader } from '../loaders/index.js'

export class FireFlower extends Entity {
	constructor({ x, y }) {
		const { path, animation } = Loader.Sprite.getAnimation({
			src: Loader.Sprite.SRC.PLAYER,
			name: 'fire-flower'
		})

		const sprite = animation.frames[0]

		super({ path, x, y, sprite, })

		this.setAnimation(animation)

		this.powerUp = Player.POWER_UPS.FIRE_FLOWER
	}
}