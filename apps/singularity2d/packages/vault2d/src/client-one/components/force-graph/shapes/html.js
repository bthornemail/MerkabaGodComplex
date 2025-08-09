import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
export default function createForceGraph3DHTML(node) {
	const nodeEl = document.createElement("div");
	nodeEl.innerHTML = `<h1>${node.id}</h1><p>${Date.now()}</p>`;
	// nodeEl.textContent = node.id;
	nodeEl.style.color = "white";
	nodeEl.className = "node-label";
	return new CSS2DObject(nodeEl);
}