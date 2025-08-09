import * as THREE from 'three';
export type PUBLICATION = string;
export type SUBSCRIPTION = string;

export default function createPublication(source: string) {
    const tetrahedron = this.createTetrahedron({ id: source, x: 1, y: 1, z: 1 })
    tetrahedron.name = source;
    tetrahedron.userData = { subscriptions: [] }
    const subscriptions: Set<SUBSCRIPTION> = new Set();
    this.events.set(source, subscriptions);
    this.scene.add(tetrahedron);
    return [subscriptions, tetrahedron];
  }