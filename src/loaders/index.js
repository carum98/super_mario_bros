import { LevelLoader } from './level-loader.js'
import { SpriteLoader } from './sprite-loader.js'

/**
 * @class
 * @property {SpriteLoader} Sprite
 * @property {LevelLoader} Level
 */
export class Loader {
	static Sprite = SpriteLoader
	static Level = LevelLoader
}