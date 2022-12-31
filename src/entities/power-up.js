import { Player } from '../characters/player.js'
import { Sound } from '../core/sound.js'
import { Loader } from '../loaders/index.js'
import { Entity } from './entity.js'

/**
 * @class
 * @extends Entity
 * @property {Player.POWER_UPS} powerUp
 */
export class PowerUp extends Entity {
	/**
	 * @readonly
	 * @enum {Object} Types of power ups
	 * @property {string} name - Name of the power up
	 * @property {Player.POWER_UPS} powerUp - Name of the power up
	 * @property {boolean} isSolid - Whether the power up is solid
	 */
	static TYPES = {
		MUSHROOM: {
			name: 'mushroom',
			powerUp: Player.POWER_UPS.MUSHROOM,
			isSolid: true,
		},
		FIRE_FLOWER: {
			name: 'fire-flower',
			powerUp: Player.POWER_UPS.FIRE_FLOWER,
			isSolid: false,
		}
	}

	/**
	 * @param {Object} param
	 * @param {number} param.x
	 * @param {number} param.y
	 * @param {TYPES} param.type
	 */
	constructor({ x, y, type }) {
		const { name, powerUp, isSolid } = type

		if (isSolid) {
			const { path, sprite } = Loader.Sprite.getSprite({
				src: Loader.Sprite.SRC.PLAYER,
				name
			})

			super({ path, x, y, sprite })
		} else {
			const { path, animation } = Loader.Sprite.getAnimation({
				src: Loader.Sprite.SRC.PLAYER,
				name
			})

			super({ path, x, y, sprite: animation.frames[0] })

			this.setAnimation(animation)
		}

		this.powerUp = powerUp

		this.activate()
	}

	onCollide() {
		super.onCollide()

		Sound.play(Sound.Name.powerup)
	}
}