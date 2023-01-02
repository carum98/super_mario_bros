import { Game } from './src/core/game.js'
import { GameLoop } from './src/core/game-loop.js'
import { getCanvas, scaleCanvas } from './src/utilities/utils.js'
import { Debug } from './src/utilities/debug.js'
import { MenuScreen } from './src/screens/menu.js'
import { LoadingScreen } from './src/screens/loading.js'

const canvas = getCanvas()

const game = new Game({
	canvas,
	world: 1,
	level: 1,
})

const menu = new MenuScreen({
	canvas
})

const gameLoop = new GameLoop(() => {
	game.render()
})

const debug = new Debug({
	game,
	gameLoop
})

const loading = new LoadingScreen({
	canvas,
	world: 1,
	level: 1,
})

document.addEventListener('DOMContentLoaded', () => scaleCanvas(canvas))
window.addEventListener('resize', () => scaleCanvas(canvas))

// Wait for all images to load
window.addEventListener('load', () => {
	menu.render()

	document.addEventListener('keypress', (event) => {
		if (event.key === 'Enter') {
			loading.render()

			setTimeout(() => {
				gameLoop.start()
			}, 2000)
		}
	}, { once: true })
}, { once: true })
