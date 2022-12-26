import { Sprite } from "./sprite.js"

export const TILE = {
	CONCRETE: { x: 0, y: 0 },
	BRICKS: { x: 16, y: 0 },
	EMPTY: { x: 32, y: 0 },
	HARD: { x: 48, y: 0 },
}

export class Tile extends Sprite {
	constructor({ x, y, sprite }) {
		super({ image: "assets/tiles.png", x, y, sprite, width: 16, height: 16 });
	}
}