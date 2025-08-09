import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);

// const renderer = new THREE.WebGLRenderer();
// const controls = new OrbitControls(camera, renderer.domElement)

// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// camera.lookAt(0, 0, 0);
// camera.position.set(0, 0, 10);
// Define the radius and number of segments
export default function getSphere() {
    const radius = 1;
    const widthSegments = 64;
    const heightSegments = 32;

    // Generate vertices and indices for the sphere
    const indices: number[] = [];
    const scale = 255; // Scale factor for quantization
    const vertices: number[] = [];
    for (let phiIndex = 0; phiIndex <= heightSegments; phiIndex++) {
        const phi = phiIndex * Math.PI / heightSegments;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        for (let thetaIndex = 0; thetaIndex <= widthSegments; thetaIndex++) {
            const theta = thetaIndex * 2 * Math.PI / widthSegments;
            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);

            const x = cosTheta * sinPhi;
            const y = cosPhi;
            const z = sinTheta * sinPhi;

            // Quantize and scale the coordinates to fit within 0-255 range
            vertices.push(
                x * radius,//Math.round(x * scale), 
                y * radius,//Math.round(y * scale), 
                z * radius//Math.round(z * scale)
                // Math.round(x * scale), 
                // Math.round(y * scale), 
                // Math.round(z * scale)
            );
        }
    }

    for (let phiIndex = 0; phiIndex < heightSegments; phiIndex++) {
        for (let thetaIndex = 0; thetaIndex < widthSegments; thetaIndex++) {
            const first = (phiIndex * (widthSegments + 1)) + thetaIndex;
            const second = first + widthSegments + 1;

            indices.push(first, second, first + 1);
            indices.push(second, second + 1, first + 1);
        }
    }

    // Create a BufferGeometry
    const geometry = new THREE.BufferGeometry();

    // Set vertices and indices as attributes
    geometry.setAttribute('position', new THREE.BufferAttribute( 3));
    geometry.setIndex(indices);

    // Create material
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });

    // Create mesh and add to scene
    const sphere = new THREE.Mesh(geometry, material);
    return sphere;
}
// scene.add(sphere);

// // Output vertices to console log without "-0"
// console.log(vertices.map(v => v.toFixed(6)));


// // Add lights
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
// directionalLight.position.set(0, 1, 0);
// scene.add(directionalLight);

// function animate() {
// 	requestAnimationFrame( animate );
// 	scene.rotation.x += 0.001;
// 	scene.rotation.y += 0.001;
// 	scene.rotation.z += 0.001;
// 	// line.rotation.x += 0.01;
// 	// line.rotation.y += 0.01;
//     controls.update()
// 	renderer.render( scene, camera );
// }

// animate();