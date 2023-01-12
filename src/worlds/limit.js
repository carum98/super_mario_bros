import { Entity } from '../entities/entity.js'

export class Limit extends Entity {
	constructor({ x, y }) {
		super({ path: '', x, y, sprite: { x: 0, y: 0, w: 16, h: 176 } })
	}
}