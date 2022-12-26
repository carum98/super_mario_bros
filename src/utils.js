/**
 * @returns HTMLCanvasElement
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
 * @param {string} url 
 * @returns Promise<Object>
 */
export async function getJSON(url) {
	const response = await fetch(url)
	return await response.json()
}
