const DIRECTIONS = {
	LEFT: 'left',
	RIGHT: 'right',
	UP: 'up',
	DOWN: 'down',
}

const KEYS = {
	ArrowLeft: DIRECTIONS.LEFT,
	ArrowRight: DIRECTIONS.RIGHT,
	ArrowUp: DIRECTIONS.UP,
	ArrowDown: DIRECTIONS.DOWN,
	KeyA: DIRECTIONS.LEFT,
	KeyD: DIRECTIONS.RIGHT,
	KeyW: DIRECTIONS.UP,
	KeyS: DIRECTIONS.DOWN,
	Space: DIRECTIONS.UP,
}

const AXIS = {
	[DIRECTIONS.LEFT]: { x: -1, y: 0 },
	[DIRECTIONS.RIGHT]: { x: 1, y: 0 },
	[DIRECTIONS.UP]: { x: 0, y: -1 },
	[DIRECTIONS.DOWN]: { x: 0, y: 1 },
}

export class Controls {
	keys = []

	static DIRECTIONS = DIRECTIONS
	static AXIS = AXIS

	startListening() {
		window.addEventListener('keydown', this.#onKeyDown.bind(this))
		window.addEventListener('keyup', this.#onKeyUp.bind(this))
	}

	stopListening() {
		window.removeEventListener('keydown', this.#onKeyDown.bind(this))
		window.removeEventListener('keyup', this.#onKeyUp.bind(this))
	}

	#onKeyDown(event) {
		if (Object.keys(KEYS).includes(event.code) && !this.keys.includes(KEYS[event.code])) {
			this.keys.push(KEYS[event.code])
		}
	}

	#onKeyUp(event) {
		const key = KEYS[event.code]
		if (this.keys.includes(key)) {
			this.keys.splice(this.keys.indexOf(key), 1)
		}
	}
}