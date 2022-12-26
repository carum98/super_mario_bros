import { Sprite } from "./sprite.js";

export class Pipe extends Sprite {
	constructor({ x, y, sprite, width, height }) {
		super({
			image: "assets/tiles.png",
			x,
			y,
			width: 32,
			height: 32,
			sprite: { x: 0, y: 80 }
		});
	}
}