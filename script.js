import { Game } from './src/game.js'
import { GameLoop } from './src/game-loop.js'
import { Player } from './src/player.js'
import { scaleCanvas } from './src/utils.js'

const canvas = document.getElementById('canvas')

document.addEventListener('DOMContentLoaded', scaleCanvas)
window.addEventListener('resize', scaleCanvas)

const player = new Player()

const game = new Game({
	canvas,
	player,
})

const gameLoop = new GameLoop(game.render.bind(game))

gameLoop.start()
game.start()

// setTimeout(() => {
// 	gameLoop.stop()
// }, 4000)
