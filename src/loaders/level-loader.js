import { GameLevel } from '../core/game-level.js'

export class LevelLoader {
	/**
	 * @param {string} level
	 * @returns {Promise<GameLevel>}
	 */
	static async get(level) {
		const data = await import(`../../assets/levels/${level}.json`, { assert: { type: "json" } })

		return new GameLevel(data.default)
	}
}
