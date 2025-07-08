import * as THREE from 'three';
export default function createTetrahedron(node: { id: string, x: number, y: number, z?: number }) {
    const geometry = new THREE.TetrahedronGeometry(1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const tetrahedron = new THREE.Mesh(geometry, material);
    tetrahedron.name = node.id;
    tetrahedron.position.x = node.x;
    tetrahedron.position.y = node.y;
    tetrahedron.position.z = node.z ?? node.x / node.y;
    tetrahedron.userData = node;
    return tetrahedron;
  }