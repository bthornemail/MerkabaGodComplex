import * as THREE from 'three';
import getPositionOnSphere from './get.position.on.sphere';
export default function addLocationMarker(
    scene: THREE.Scene,
    radius: number,
    lat: number,
    lon: number,
    color: number = 0xff0000,
    size: number = 0.1
) {
    const markerGeometry = new THREE.SphereGeometry(size, 16, 16);
    const markerMaterial = new THREE.MeshBasicMaterial({ color });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);

    const position = getPositionOnSphere(radius, lat, lon);
    marker.position.copy(position);

    scene.add(marker);
    return marker;
}