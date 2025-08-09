import SpriteText from "three-spritetext";
export default function createForceGraph3DSpriteText(node) {
	const sprite = new SpriteText(node.id);
	sprite.material.depthWrite = false; // make sprite background transparent
	// sprite.color = node.color;
	sprite.textHeight = 8;
	return sprite;
}