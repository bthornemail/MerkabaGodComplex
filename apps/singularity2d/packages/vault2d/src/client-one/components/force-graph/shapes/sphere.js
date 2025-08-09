import { MeshBasicMaterial } from '../../../modules/three/src/materials/MeshBasicMaterial.js';
import { SphereGeometry } from '../../../modules/three/src/geometries/SphereGeometry.js';
import { Mesh } from '../../../modules/three/src/objects/Mesh.js';
export default function createForceGraph3DSphere(node) {
    const geometry = new SphereGeometry(4, 32 / 2, 64 / 2);
    const material = new MeshBasicMaterial({ color: 0x00ff00 });//, wireframe: true });
    const sphere = new Mesh(geometry, material);
    return sphere;
}