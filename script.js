import { Game } from './src/core/game.js'
import { GameLoop } from './src/core/game-loop.js'
import { Player } from './src/characters/player.js'
import { getCanvas, scaleCanvas } from './src/core/utils.js'
import { Debug } from './src/core/debug.js'

const canvas = getCanvas()

document.addEventListener('DOMContentLoaded', () => scaleCanvas(canvas))
window.addEventListener('resize', () => scaleCanvas(canvas))

const player = new Player({
	canvas,
})

const game = new Game({
	canvas,
	player,
})

const gameLoop = new GameLoop(game.render.bind(game))

gameLoop.start()

const debug = new Debug({ game, gameLoop })

debug.toogle()
