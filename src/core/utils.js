/**
 * @throws {Error} If no canvas is found
 * 
 * @returns {HTMLCanvasElement} Canvas
 */
export function getCanvas() {
	const canvas = document.querySelector('canvas')

	if (!canvas) {
		throw new Error('No canvas found')
	}

	return canvas
}

/**
 * @param {HTMLCanvasElement} canvas 
 */
export function scaleCanvas(canvas) {
	const contentWidth = canvas.width
	const contentHeight = canvas.height

	const availableWidth = window.innerWidth
	const availableHeight = window.innerHeight

	const scale = Math.max(availableWidth / contentWidth, availableHeight / contentHeight) / 2;

	canvas.style.scale = scale.toString()
}

/**
 * @param {Object} data
 * @param {Array<Sprites>} data.sprites
 * @param {string} data.name
 * 
 * @throws {Error} If no sprite is found
 * 
 * @returns {Frame} Frame
 */
export function getSprite({ sprites, name }) {
	const frame = sprites.find(s => s.name === name)?.frame

	if (!frame) {
		throw new Error(`No sprite found with name ${name}`)
	}

	return frame
}

/**
 * @param {Object} data
 * @param {Array<Sprites>} data.sprites
 * @param {Array<Animations>} data.animations
 * @param {string} data.name
 * 
 * @throws {Error} If no animation is found
 * 
 * @returns {{ frames: Frame[], speed: number }} Animation
 */
export function getAnimation({ sprites, animations, name }) {
	const animation = animations.find(s => s.name === name)

	if (!animation) {
		throw new Error(`No animation found with name ${name}`)
	}

	const frames = animation.frames.map(frame => getSprite({ sprites, name: frame }))

	return {
		frames,
		speed: animation.speed,
	}
}

/**
 * @param {Object} data
 * @param {Array<Sprites>} data.sprites
 * @param {Array<Patterns>} data.patterns
 * @param {string} data.name
 * 
 * @throws {Error} If no animation is found
 * 
 * @returns {Frame[][]} Animation
 */
export function getPattern({ sprites, patterns, name }) {
	const pattern = patterns.find(s => s.name === name)

	if (!pattern) {
		throw new Error(`No pattern found with name ${name}`)
	}

	return pattern.frames.map(row => row.map(frame => getSprite({ sprites, name: frame })))
}
