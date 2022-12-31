import { PowerUp } from '../entities/power-up.js'

export class FireFlower extends PowerUp {
	constructor({ x, y }) {
		super({ x, y, type: PowerUp.TYPES.FIRE_FLOWER })
	}
}