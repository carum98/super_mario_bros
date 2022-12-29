import { GameLoop } from "./game-loop.js"
import { Game } from "./game.js"

/**
 * @class
 * @property {Game} game
 * @property {GameLoop} gameLoop
 */
export class Debug {
	/**
	 * @type {number}
	 */
	#intervalId = 0

	/**
	 * @type {boolean}
	 */
	#enable = false

	/**
	 * @type {HTMLDivElement | null}
	 */
	#element = null

	/**
	 * @param {Object} data
	 * @param {Game} data.game
	 * @param {GameLoop} data.gameLoop
	 */
	constructor({ game, gameLoop }) {
		this.game = game
		this.gameLoop = gameLoop
	}

	toogle() {
		if (this.#enable) {
			this.stop()
		} else {
			this.start()
		}
	}

	start() {
		this.#enable = true
		console.log('Debug mode enabled')

		this.#createElement()

		this.#startLoop()

		this.#listenEvents()
	}

	stop() {
		this.#enable = false
		console.log('Debug mode disabled')

		if (this.#element !== null) {
			this.#element.remove()
			this.#element = null
		}

		if (this.#intervalId !== 0) {
			clearInterval(this.#intervalId)
			this.#intervalId = 0
		}
	}

	#createElement() {
		const element = document.createElement('div')
		element.classList.add('debug')

		element.innerHTML = `
			<div class="debug__fps"></div>
			<div class="debug__game"></div>
			<div class="debug__player"></div>
			<div class="debug__map"></div>
			<button id="grid">Grid</button>
			<button id="player-collider">Player Colliders</button>
			<button id="background-container">Background containers</button>
			<button id="move-map">Move map to left</button>
			<button id="show-coins">Show coins</button>
			<button id="show-mushroom">Show mushroom</button>
		`

		document.body.appendChild(element)

		this.#element = element
	}

	#startLoop() {
		this.#intervalId = setInterval(this.#update.bind(this), 100)
	}

	#update() {
		if (this.#enable) {
			if (this.#element !== null) {
				const fpsContainer = this.#element.querySelector('.debug__fps')
				const player = this.#element.querySelector('.debug__player')
				const map = this.#element.querySelector('.debug__map')
				const game = this.#element.querySelector('.debug__game')

				if (fpsContainer !== null) {
					const { fps } = this.gameLoop.debugParams
					fpsContainer.innerHTML = `FPS: ${fps}`
				}

				if (player !== null) {
					const { axisX, axisY, coordX, coordY, state, arrows } = this.game.player.debugParams

					player.innerHTML = 'Player:'
					player.innerHTML += `<br />`
					player.innerHTML += `x:${axisX}, y:${axisY}`
					player.innerHTML += `<br />`
					player.innerHTML += `x:${coordX}, y:${coordY}`
					player.innerHTML += `<br />`
					player.innerHTML += `State: ${state}`
					player.innerHTML += `<br />`
					player.innerHTML += `Direction: ${arrows}`
				}

				if (map !== null) {
					const { visibleTiles, tiles, visibleBackgroundItems, backgroundItems } = this.game.map.debugParams

					map.innerHTML = 'Map:'
					map.innerHTML += `<br />`
					map.innerHTML += `Visible tiles: ${visibleTiles}`
					map.innerHTML += `<br />`
					map.innerHTML += `Buffer tiles: ${tiles}`
					map.innerHTML += `<br />`
					map.innerHTML += `Visible background: ${visibleBackgroundItems}`
					map.innerHTML += `<br />`
					map.innerHTML += `Buffer background: ${backgroundItems}`
				}

				if (game !== null) {
					const { timeDraw, timeUpdate } = this.game.debugParams

					game.innerHTML = 'Render:'
					game.innerHTML += `<br />`
					game.innerHTML += `Time update: ${timeUpdate}`
					game.innerHTML += `<br />`
					game.innerHTML += `Time draw: ${timeDraw}`
					game.innerHTML += `<br />`
				}
			}
		}
	}

	#listenEvents() {
		const gridButton = this.#element?.querySelector('#grid')
		const playerColliderButton = this.#element?.querySelector('#player-collider')
		const backgroundContainerButton = this.#element?.querySelector('#background-container')
		const moveMapButton = this.#element?.querySelector('#move-map')
		const showCoinsButton = this.#element?.querySelector('#show-coins')
		const showMushroomButton = this.#element?.querySelector('#show-mushroom')

		if (gridButton !== null) {
			gridButton?.addEventListener('click', (e) => {
				this.game.map.toogleDebug()

				// Remove focus from button
				// @ts-ignore
				playerColliderButton.blur()
				e.preventDefault()
			})
		}

		if (playerColliderButton !== null) {
			playerColliderButton?.addEventListener('click', (e) => {
				this.game.player.toogleDebug()

				// Remove focus from button
				// @ts-ignore
				playerColliderButton.blur()
			})
		}

		if (backgroundContainerButton !== null) {
			backgroundContainerButton?.addEventListener('click', (e) => {
				this.game.map.toogleBackgroundContainerDebug()

				// Remove focus from button
				// @ts-ignore
				backgroundContainerButton.blur()
			})
		}

		if (moveMapButton !== null) {
			moveMapButton?.addEventListener('click', (e) => {
				for (let i = 0; i < 8; i++) {
					this.game.map.move()
				}

				// Remove focus from button
				// @ts-ignore
				moveMapButton.blur()
			})
		}

		if (showCoinsButton !== null) {
			showCoinsButton?.addEventListener('click', (e) => {
				this.game.map.toogleCoinsDebug()

				// Remove focus from button
				// @ts-ignore
				showCoinsButton.blur()
			})
		}

		if (showMushroomButton !== null) {
			showMushroomButton?.addEventListener('click', (e) => {
				this.game.map.toogleMushroosDebug()

				// Remove focus from button
				// @ts-ignore
				showMushroomButton.blur()
			})
		}
	}
}