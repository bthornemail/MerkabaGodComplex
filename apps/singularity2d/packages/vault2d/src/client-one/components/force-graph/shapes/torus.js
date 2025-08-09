import * as THREE from 'three';
import { MeshBasicMaterial } from '../../../modules/three/src/materials/MeshBasicMaterial.js';
import { Mesh } from '../../../modules/three/src/objects/Mesh.js';
import { TorusGeometry } from '../../../modules/three/src/geometries/TorusGeometry.js';
export default function createForceGraph3DTorus(node) {
	const geometry = new TorusGeometry(4, 1, 8, 16, Math.PI * 2);
	const material = new MeshBasicMaterial({ color: 0xffffff });//, wireframe: true });
	const torus = new Mesh(geometry, material);
	return torus;
}