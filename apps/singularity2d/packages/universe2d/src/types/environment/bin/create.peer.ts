import * as THREE from 'three';
import { verifyMessage, Wallet, HDNodeWallet } from "ethers";
export default function createPeer(node: { id: string, x: number, y: number, z?: number }) {
    const geometry = new THREE.SphereGeometry(1, 32, 64);
    const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.name = HDNodeWallet.createRandom().address;
    sphere.position.x = node.x;
    sphere.position.y = node.y;
    sphere.position.z = node.z ?? node.x / node.y;
    return sphere;
  }