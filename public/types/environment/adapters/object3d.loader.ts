import * as THREE from 'three';
const scene = new THREE.Scene();
const scene1 = new THREE.Scene();
const tetrahedronGeometry = new THREE.TetrahedronGeometry();
const tetrahedronMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const innerSphereGeometry = new THREE.SphereGeometry(1);
const innerSphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });
const outerSphereGeometry = new THREE.SphereGeometry(2);
const outerSphereMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true });

// Set geometry attributes
// geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
// geometry.setIndex(indices);

// Create a mesh with the geometry and a basic material
const tetrahedron = new THREE.Mesh(tetrahedronGeometry, tetrahedronMaterial);
const innerSphere = new THREE.Mesh(innerSphereGeometry, innerSphereMaterial);
const outerSphere = new THREE.Mesh(outerSphereGeometry, outerSphereMaterial);
tetrahedron.userData = { id: tetrahedron.id}
// Add the mesh to the scene
scene.add(tetrahedron);

const geometry1 = new THREE.BoxGeometry(1, 1, 1);
const material1 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry1, material1);
cube.userData = { id: cube.id}
scene.add(cube);
const camera = new THREE.PerspectiveCamera(50, 1000 / 1000, 1, 500);
camera.position.set(0, 0, 5);

const loader = new THREE.ObjectLoader();
const object = loader.parse(JSON.parse(JSON.stringify(scene.clone(true).toJSON())))
scene1.copy(object);
console.log("scene.children.length",scene.children.length)
console.log("\n-----\n")
console.log("scene1.children.length",scene1.children.length)
// console.log(scene.children[0].userData.id === scene1.children[0].userData.id)
console.log("scene.children[1].userData.id === scene1.children[1].userData.id",scene.children[1].userData.id === scene1.children[1].userData.id)