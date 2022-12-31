import { GameElement } from '../entities/game-element.js'
import { Sprite } from '../entities/sprite.js'

export class MovementController {
	/**
	 * @param {Array<Sprite>} tiles
	 * @param {GameElement} element
	 * @returns {{bottom: Sprite | undefined, top: Sprite | undefined, left: Sprite | undefined, right: Sprite | undefined}}}
	 */
	static collisions(element, tiles) {
		const { x, y, width, height } = element

		const right = { x: x + width, y: y + height / 4, width: width / 4, height: height / 2 }
		const bottom = { x: x + width / 4, y: y + height, width: width / 2, height: height / 4 }
		const top = { x: x + width / 4, y: y - height / 4, width: width / 2, height: height / 4 }
		const left = { x: x - width / 4, y: y + height / 4, width: width / 4, height: height / 2 }

		return {
			bottom: this.#collideBox(bottom, tiles),
			top: this.#collideBox(top, tiles),
			left: this.#collideBox(left, tiles),
			right: this.#collideBox(right, tiles),
		}
	}

	/**
	 * @param {Object} box 
	 * @param {Array<Sprite>} tiles 
	 * @returns {Sprite | undefined}
	 */
	static #collideBox(box, tiles) {
		return tiles.find((tile) => this.#collideTile(box, tile))
	}

	/**
	 * @param {Object} box 
	 * @param {Sprite} tile 
	 * @returns {boolean}
	 */
	static #collideTile(box, tile) {
		return (
			box.x < tile.x + tile.width &&
			box.x + box.width > tile.x &&
			box.y < tile.y + tile.height &&
			box.y + box.height > tile.y
		)
	}
}