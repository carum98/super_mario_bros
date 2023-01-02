import { getCanvas, scaleCanvas } from './src/utilities/utils.js'
import { GameController } from './src/core/game-controller.js'

const canvas = getCanvas()

new GameController({ canvas })

document.addEventListener('DOMContentLoaded', () => scaleCanvas(canvas))
window.addEventListener('resize', () => scaleCanvas(canvas))
