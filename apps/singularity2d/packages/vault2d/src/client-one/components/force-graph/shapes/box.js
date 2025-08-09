export default function createForceGraph3DBox(node) {
    const geometry = new THREE.BoxGeometry(4, 4, 4);
    const material = new MeshBasicMaterial({ color: 0x0000ff });//, wireframe: true });
    const tetrahedron = new Mesh(geometry, material);
    return tetrahedron;
}