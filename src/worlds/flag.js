import { Entity } from '../entities/entity.js'
import { Loader } from '../loaders/index.js'

/**
 * @class
 * @extends Entity
 */
export class Flag extends Entity {
	#interval = 0

	constructor({ x, y }) {
		super({ path: '', x, y, sprite: { x: 0, y: 0, w: 16, h: 176 } })

		const hoist = Loader.Sprite.getSprite({
			src: Loader.Sprite.SRC.TILE,
			name: 'flag-hoist'
		})

		const truck = Loader.Sprite.getSprite({
			src: Loader.Sprite.SRC.TILE,
			name: 'flag-truck'
		})

		const fly = Loader.Sprite.getSprite({
			src: Loader.Sprite.SRC.PLAYER,
			name: 'flag-fly'
		})

		const sprites = {
			hoist: hoist.sprite,
			truck: truck.sprite,
			fly: fly.sprite
		}

		this.sprites = sprites

		this.image = new Image()
		this.image.src = `assets/img/${hoist.path}`

		this.image2 = new Image()
		this.image2.src = `assets/img/${fly.path}`

		this.flyPosition = 1
		this.flyLimit = 9
	}

	update() {
		if (this.isActive) {
			this.#interval = (this.#interval + 1) % 60

			if (this.#interval % 5 === 0 && this.flyPosition < this.flyLimit) {
				this.flyPosition++
			}

			if (this.flyPosition === this.flyLimit) {
				this.deactivate()
			}
		}
	}

	/**
	 * @param {CanvasRenderingContext2D} ctx 
	 */
	draw(ctx) {
		const { image, image2, x: dx, y: dy, width: dw, height: dh } = this

		const { x: sxHoist, y: syHoist, w: swHoist, h: shHoist } = this.sprites.hoist
		const { x: sxTruck, y: syTruck, w: swTruck, h: shTruck } = this.sprites.truck
		const { x: sxFly, y: syFly, w: swFly, h: shFly } = this.sprites.fly

		const x = Math.round(dx)
		const y = Math.round(dy)

		ctx.save()

		// truck
		ctx.drawImage(image, sxTruck, syTruck, swTruck, shTruck, x, y, swTruck, shTruck)

		// hoist
		for (let i = 1; i < 10; i++) {
			ctx.drawImage(
				image,
				sxHoist,
				syHoist,
				swHoist,
				shHoist,
				x,
				y * i / 2 + 32,
				swHoist,
				shHoist
			)
		}

		// fly
		ctx.drawImage(image2, sxFly, syFly, swFly, shFly, x - 8, y + (this.flyPosition * shFly), swFly, shFly)

		ctx.restore()
	}
}