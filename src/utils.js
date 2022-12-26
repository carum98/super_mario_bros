export function scaleCanvas() {
	const contentWidth = canvas.width
	const contentHeight = canvas.height

	const availableWidth = window.innerWidth
	const availableHeight = window.innerHeight

	const scale = Math.max(availableWidth / contentWidth, availableHeight / contentHeight) / 2;

	canvas.style.scale = scale
}