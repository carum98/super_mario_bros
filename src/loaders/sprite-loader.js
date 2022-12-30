import SpritesPlayer from '../../assets/sprites/player.json' assert {type: 'json'}
import SpritesTile from '../../assets/sprites/tile.json' assert {type: 'json'}
import SpritesFont from '../../assets/sprites/font.json' assert {type: 'json'}

import { getAnimation, getPattern, getSprite } from '../utilities/utils.js'

export class SpriteLoader {
	static #player = SpritesPlayer
	static #tile = SpritesTile
	static #font = SpritesFont

	/**
	 * @readonly
	 * @enum {string}
	 */
	static SRC = {
		PLAYER: 'player',
		TILE: 'tile',
		FONT: 'font',
	}

	/**
	 * @readonly
	 * @enum {string}
	 */
	static TYPE = {
		SPRITES: 'sprites',
		ANIMATIONS: 'animations',
		PATTERNS: 'patterns',
	}

	/**
	 * @param {Object} param 
	 * @param {SRC} param.src
	 * @param {string} param.name
	 * 
	 * @returns {{ path: string, sprite: Frame }} Frame
	 */
	static getSprite({ src, name }) {
		const { path, data } = this.#get({ src, name, type: this.TYPE.SPRITES })

		return {
			path,
			sprite: data,
		}
	}
	/**
	 * @param {Object} param 
	 * @param {SRC} param.src
	 * @param {string} param.name
	 * 
	 * @returns {{ path: string, animation: { frames: Frame[], speed: number } }} Animation
	 */
	static getAnimation({ src, name }) {
		const { path, data } = this.#get({ src, name, type: this.TYPE.ANIMATIONS })

		return {
			path,
			animation: data,
		}
	}

	/**
	 * @param {Object} param
	 * @param {SRC} param.src
	 * @param {string} param.name
	 * 
	 * @returns {{ path: string, pattern: Frame[][] }} Pattern
	 */
	static getPattern({ src, name }) {
		const { path, data } = this.#get({ src, name, type: this.TYPE.PATTERNS })

		return {
			path,
			pattern: data,
		}
	}

	/**
	 * @param {Object} param 
	 * @param {SRC} param.src
	 * @param {string} param.name
	 * @param {TYPE} param.type
	 * 
	 * @throws {Error} Sprite source not found
	 * 
	 * @returns {{ path: string, data: Object }}
	 */
	static #get({ src, name, type }) {
		const json = eval(`this.#${src}`)

		if (!json) {
			throw new Error(`SRC not found: ${src}`)
		}

		if (type === this.TYPE.SPRITES) {
			const data = getSprite({ sprites: json.sprites, name })

			return {
				path: json.src,
				data,
			}
		}

		if (type === this.TYPE.ANIMATIONS) {
			const data = getAnimation({ sprites: json.sprites, animations: json.animations, name })

			return {
				path: json.src,
				data,
			}
		}

		if (type === this.TYPE.PATTERNS) {
			const data = getPattern({ sprites: json.sprites, patterns: json.patterns, name })

			return {
				path: json.src,
				data,
			}
		}

		throw new Error(`Sprite type not found: ${type}`)
	}
}