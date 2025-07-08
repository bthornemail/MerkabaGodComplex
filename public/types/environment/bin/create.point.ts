import * as THREE from 'three';
export default function createPoint(node: { id: string, x: number, y: number, z?: number }) {
    const geometry = new THREE.Object3D();
    geometry.name = node.id;
    geometry.position.x = node.x;
    geometry.position.y = node.y;
    geometry.position.z = node.z ?? node.x / node.y;
    return geometry;
  }