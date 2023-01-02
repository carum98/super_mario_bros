import { Game } from './src/core/game.js'
import { GameLoop } from './src/core/game-loop.js'
import { getCanvas, scaleCanvas } from './src/utilities/utils.js'
import { Debug } from './src/utilities/debug.js'
import { Landing } from './src/ui/landing.js'

const canvas = getCanvas()

const game = new Game({
	canvas,
	world: 1,
	level: 1,
})

const menu = new Landing({
	canvas
})

const gameLoop = new GameLoop(() => {
	game.render()
})

const debug = new Debug({
	game,
	gameLoop
})

document.addEventListener('DOMContentLoaded', () => scaleCanvas(canvas))
window.addEventListener('resize', () => scaleCanvas(canvas))

// Wait for all images to load
window.addEventListener('load', () => {
	menu.render()

	document.addEventListener('keypress', (event) => {
		if (event.key === 'Enter') {
			gameLoop.start()
			debug.toogle()
		}
	}, { once: true })
}, { once: true })
