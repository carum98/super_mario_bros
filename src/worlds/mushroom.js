import { Player } from '../characters/player.js'
import { Sound } from '../core/sound.js'
import { Entity } from '../entities/entity.js'
import { Loader } from '../loaders/index.js'

/**
 * @class
 * @extends Entity
 */
export class Mushroom extends Entity {
	/**
	 * @param {Object} param 
	 * @param {number} param.x
	 * @param {number} param.y
	 */
	constructor({ x, y }) {
		const { path, sprite } = Loader.Sprite.getSprite({
			src: Loader.Sprite.SRC.PLAYER,
			name: 'mushroom'
		})

		super({ path, x, y, sprite })

		this.powerUp = Player.POWER_UPS.MUSHROOM
	}

	onCollide() {
		super.onCollide()

		Sound.play(Sound.Name.powerup)
	}
}