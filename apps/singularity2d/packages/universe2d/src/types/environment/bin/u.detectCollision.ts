import * as THREE from 'three';
export default function detectCollision(a: THREE.Sphere, b: THREE.Sphere) {
    return a.intersectsSphere(b)
  };