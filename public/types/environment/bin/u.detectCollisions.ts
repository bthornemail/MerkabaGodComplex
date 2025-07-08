import * as THREE from 'three';

export default function detectCollisions(a: THREE.Matrix4, n: THREE.Matrix4[]) {
    const sphere = new THREE.Sphere();
    const collisions: THREE.Matrix4[] = [];
    sphere.applyMatrix4(a);
    // console.log(a, n);
    n.forEach((i) => {
      // console.log(a, i);
      const iSphere = new THREE.Sphere();
      iSphere.applyMatrix4(i);
      if (this.detectCollision(sphere, iSphere)) {
        return collisions.push(i);
      }
    })
    return collisions;
  };