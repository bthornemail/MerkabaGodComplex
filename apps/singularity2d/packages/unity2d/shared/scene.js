
import { ethers, Wallet, HDNodeWallet } from "./modules/ethers/ethers.min.js";//"https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
import { io } from "./modules/socket.io/socket.io.esm.min.js";//"https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
import * as THREE from 'three';
let wallet = HDNodeWallet.createRandom();
// let wallet = HDNodeWallet.fromPhrase("roast thank tiny coach seat ensure cruel auto shaft finish fee resemble")
let socket = io(":3000", {
    auth: {
        token: wallet.address,
        signature: await wallet.signMessage("signature")
    }
});
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
function detectCollision(a, b) {
    return a.intersectsSphere(b)
};
function detectCollisions(a, n) {
    const sphere = new THREE.Sphere();
    const collisions = [];
    sphere.applyMatrix4(a);
    // console.log(a, n);
    n.forEach((i) => {
        // console.log(a, i);
        const iSphere = new THREE.Sphere();
        iSphere.applyMatrix4(i);
        if (detectCollision(sphere, iSphere)) {
            return collisions.push(i);
        }
    })
    return collisions;
};
function createTetrahedron(node) {
    const geometry = new THREE.TetrahedronGeometry(1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const tetrahedron = new THREE.Mesh(geometry, material);
    tetrahedron.name = node.id;
    tetrahedron.position.x = node.x;
    tetrahedron.position.y = node.y;
    tetrahedron.position.z = node.z ?? node.x / node.y;
    // console.log(tetrahedron.position.toArray());
    if (detectCollisions(tetrahedron.matrix, scene.children.map((child) => { return child.matrix })).includes(tetrahedron.matrix)) {
        // console.log(tetrahedron.scale.z + (node.z ?? node.x / node.y));
        tetrahedron.translateZ(tetrahedron.scale.z + (node.z ?? node.x / node.y));
    }
    // console.log(tetrahedron.position.toArray());
    tetrahedron.userData = node;
    // console.log(tetrahedron.userData);
    return tetrahedron;
}
function createLayer(node) {
    const geometry = new THREE.Group();
    geometry.position.x = node.x;
    geometry.position.y = node.y;
    geometry.position.z = node.z ?? node.x / node.y;
    // console.log(geometry.position.toArray());
    if (detectCollisions(geometry.matrix, scene.children.map((child) => { return child.matrix })).includes(geometry.matrix)) {
        // console.log(geometry.scale.z + (node.z ?? node.x / node.y));
        geometry.translateZ(geometry.scale.z + (node.z ?? node.x / node.y));
    }
    // console.log(geometry.position.toArray());
    geometry.userData = node;
    // console.log(geometry.userData);
    return geometry;
}
function createPoint(node) {
    const geometry = new THREE.Object3D();
    geometry.name = node.id;
    geometry.userData.topic = node.topic;
    geometry.userData.message = node.message;
    geometry.position.x = node.x;
    geometry.position.y = node.y;
    geometry.position.z = node.z ?? node.x / node.y;
    // console.log(geometry.position.toArray());
    if (detectCollisions(geometry.matrix, scene.children.map((child) => { return child.matrix })).includes(geometry.matrix)) {
        // console.log(geometry.scale.z + (node.z ?? node.x / node.y));
        geometry.translateZ(geometry.scale.z + (node.z ?? node.x / node.y));
    }
    // console.log(geometry.position.toArray());
    geometry.userData = node;
    // console.log(geometry.userData);
    return geometry;
}
function createPeer(node) {
    const geometry = new THREE.SphereGeometry(1, 32, 64);
    const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.name = HDNodeWallet.createRandom().address;
    sphere.position.x = node.x;
    sphere.position.y = node.y;
    sphere.position.z = node.z ?? node.x / node.y;
    // console.log(sphere.position.toArray());
    if (detectCollisions(sphere.matrix, scene.children.map((child) => { return child.matrix })).includes(sphere.matrix)) {
        // console.log(sphere.scale.z + (node.z ?? node.x / node.y));
        sphere.translateZ(sphere.scale.z + (node.z ?? node.x / node.y));
    }
    // console.log(sphere.position.toArray());
    sphere.userData = node;
    // console.log(sphere.userData);
    return sphere;
}
socket.on("tetrahedron", (node) => {
    const tetrahedron = createTetrahedron(node);
    scene.add(tetrahedron);
});
socket.on("point", (node) => {
    const point = createPoint(node);
    scene.add(point);
});
function animate() {
    renderer.render(scene, camera);
}
