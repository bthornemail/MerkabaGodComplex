import * as THREE from 'three';
export default function getPositionOnSphere(
    radius: number,
    lat: number,
    lon: number
): THREE.Vector3 {
    // Convert to radians
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    // Calculate 3D coordinates
    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    return new THREE.Vector3(x, y, z);
}