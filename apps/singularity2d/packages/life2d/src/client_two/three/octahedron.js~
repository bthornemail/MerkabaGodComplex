import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Face } from 'three/addons/math/ConvexHull.js';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );

const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera,renderer.domElement)

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.lookAt(0,0,0);
camera.position.set(0,0,-50);

// Define vertices of the octahedron
const vertices1 = [
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, -1, 0),
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(0, 0, -1)
];
const vertices = new Float32Array( [
    0, 1, 1,
    0, 1, 0,
    0, 0, 1,
    1, 1, 0,
    1, 0, 0,
    1, 0, 1
] );
// Create faces of the octahedron using indices
const faces = new Float32Array([
    [0, 2, 4],
    [0, 4, 3],
    [0, 3, 5],
    [0, 5, 2],
    [1, 4, 2],
    [1, 3, 4],
    [1, 5, 3],
    [1, 2, 5]
]);

// Create geometry and add vertices
const geometry = new THREE.BufferGeometry();
//vertices.forEach(vertex => geometry.vertices.push(vertex));
geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
// Create faces
//faces.forEach(face => geometry.faces.push(new THREE.Face3(face[0], face[1], face[2])));

// Normalize the geometry to ensure correct lighting
//geometry.normalize();

// Create material
const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

// Create mesh and add to scene
const octahedron = new THREE.Mesh(geometry, material);
scene.add(octahedron);

// Add lights
//const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
//scene.add(ambientLight);

//const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
//directionalLight.position.set(0, 1, 0);
//scene.add(directionalLight);

// Render the scene
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
