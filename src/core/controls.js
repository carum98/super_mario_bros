/**
 * @enum {String}
 * @readonly
 */
export const DIRECTIONS = {
	LEFT: 'left',
	RIGHT: 'right',
	UP: 'up',
	DOWN: 'down',
}

/**
 * @enum {String}
 * @readonly
 */
export const KEY_CODES = {
	ArrowLeft: 'ArrowLeft',
	ArrowRight: 'ArrowRight',
	ArrowUp: 'ArrowUp',
	ArrowDown: 'ArrowDown',
	KeyA: 'KeyA',
	KeyD: 'KeyD',
	KeyW: 'KeyW',
	KeyS: 'KeyS',
	Space: 'Space',
}

/**
 * @enum {DIRECTIONS}
 * @readonly
 */
const KEYS = {
	[KEY_CODES.ArrowLeft]: DIRECTIONS.LEFT,
	[KEY_CODES.ArrowRight]: DIRECTIONS.RIGHT,
	[KEY_CODES.ArrowUp]: DIRECTIONS.UP,
	[KEY_CODES.ArrowDown]: DIRECTIONS.DOWN,
	[KEY_CODES.KeyA]: DIRECTIONS.LEFT,
	[KEY_CODES.KeyD]: DIRECTIONS.RIGHT,
	[KEY_CODES.KeyW]: DIRECTIONS.UP,
	[KEY_CODES.KeyS]: DIRECTIONS.DOWN,
	[KEY_CODES.Space]: DIRECTIONS.UP,
}

/**
 * @enum {{x: number, y: number, character: string}}
 * @readonly
 */
const AXIS = {
	[DIRECTIONS.LEFT]: { x: -1, y: 0, character: '←' },
	[DIRECTIONS.RIGHT]: { x: 1, y: 0, character: '→' },
	[DIRECTIONS.UP]: { x: 0, y: -1, character: '↑' },
	[DIRECTIONS.DOWN]: { x: 0, y: 1, character: '↓' },
}

export class Controls {
	/**
	 * @type {Array<String>}
	 */
	keys = []

	/**
	 * @type {String | null}
	 */
	horizontal = null

	static DIRECTIONS = DIRECTIONS
	static AXIS = AXIS
	static KEYS = KEYS

	/**
	 * Starts listening to keyboard events and updates the keys array
	 */
	startListening() {
		window.addEventListener('keydown', this.#onKeyDown.bind(this))
		window.addEventListener('keyup', this.#onKeyUp.bind(this))
	}

	/**
	 * Stops listening to keyboard events
	 */
	stopListening() {
		window.removeEventListener('keydown', this.#onKeyDown.bind(this))
		window.removeEventListener('keyup', this.#onKeyUp.bind(this))
	}

	/**
	 * Runs a macro, load a sequence of keys to run programmatically.
	 * @param {{ key: KEY_CODES[], time: number }[]} macro
	 */
	loadMacros(macro) {
		for (let i = 0; i < macro.length; i++) {
			const { key, time } = macro[i]

			setTimeout(() => {
				this.#onKeyDown(new KeyboardEvent('keydown', { code: key }))

				setTimeout(() => {
					this.#onKeyUp(new KeyboardEvent('keyup', { code: key }))
				}, time)
			}, time * i)
		}
	}

	/**
	 * @param {KeyboardEvent} event
	 * @returns {void}
	 */
	#onKeyDown(event) {
		if (Object.keys(KEYS).includes(event.code) && !this.keys.includes(KEYS[event.code])) {
			const key = KEYS[event.code]

			this.keys.push(key)

			if (key === DIRECTIONS.LEFT || key === DIRECTIONS.RIGHT) {
				this.horizontal = key
			}
		}

		// Prevent multiple jumps when holding space bar
		if (event.repeat && event.code === 'Space') {
			this.keys.splice(this.keys.indexOf(KEYS[event.code]), 1)
		}
	}

	/**
	 * @param {KeyboardEvent} event
	 * @returns {void}
	 */
	#onKeyUp(event) {
		const key = KEYS[event.code]
		if (this.keys.includes(key)) {
			this.keys.splice(this.keys.indexOf(key), 1)
		}
	}
}