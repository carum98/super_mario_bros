import { getCanvas, scaleCanvas } from './src/utilities/utils.js'
import { GameController } from './src/core/game-controller.js'
import { GameState } from './src/core/game-state.js'

const canvas = getCanvas()
const state = new GameState()

new GameController({ canvas, state })

document.addEventListener('DOMContentLoaded', () => scaleCanvas(canvas))
window.addEventListener('resize', () => scaleCanvas(canvas))
