import { Game } from './src/game.js'
import { GameLoop } from './src/game-loop.js'
import { Player } from './src/player.js'
import { getCanvas, scaleCanvas } from './src/utils.js'

const canvas = getCanvas()

document.addEventListener('DOMContentLoaded', () => scaleCanvas(canvas))
window.addEventListener('resize', () => scaleCanvas(canvas))

const player = new Player()

const game = new Game({
	canvas,
	player,
})

const gameLoop = new GameLoop(game.render.bind(game))

gameLoop.start()
