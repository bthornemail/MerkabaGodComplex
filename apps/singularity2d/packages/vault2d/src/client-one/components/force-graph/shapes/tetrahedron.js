import { MeshBasicMaterial } from '../../../modules/three/src/materials/MeshBasicMaterial.js';
import { TetrahedronGeometry } from '../../../modules/three/src/geometries/TetrahedronGeometry.js';
import { Mesh } from '../../../modules/three/src/objects/Mesh.js';
export default function createForceGraph3DTetrahedron(node) {
    const geometry = new TetrahedronGeometry(4);
    const material = new MeshBasicMaterial({ color: 0xfff000 });//, wireframe: true });
    const tetrahedron = new Mesh(geometry, material);
    return tetrahedron;
}