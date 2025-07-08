import * as THREE from 'three';

// const geometry = new THREE.BufferGeometry();

// const vertices = new Float32Array([
//     1,  1,  1,
//     1, -1, -1,
//     -1,  1, -1,
//     -1, -1,  1
// ]);

// const indices = [
//     0, 1, 2,
//     0, 1, 3,
//     0, 2, 3,
//     1, 2, 3
// ];

// geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
// geometry.setIndex(indices);

// // Create a mesh with the geometry and a basic material
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
// const tetrahedron = new THREE.Mesh(geometry, material);

// // Add the mesh to the scene
// scene.add(tetrahedron);
// const vertices = new Float32Array([
//     2, 2, 2,    // V0
//     2, -2, -2,  // V1
//     -2, 2, -2,  // V2
//     -2, -2, 2   // V3
// ]);

// const indices = [
//     0, 1, 2,  // Face 1: V0, V1, V2
//     0, 1, 3,  // Face 2: V0, V1, V3
//     0, 2, 3,  // Face 3: V0, V2, V3
//     1, 2, 3   // Face 4: V1, V2, V3
// ];
const vertices = new Float32Array([
    1.0,  1.0,  1.0, // v0
    1.0, -1.0, -1.0, // v1
   -1.0,  1.0, -1.0, // v2
   -1.0, -1.0,  1.0  // v3
]);

const indices = new Uint16Array([
    0, 1, 2,
    0, 1, 3,
    0, 2, 3,
    1, 2, 3
]);
function generateTetrahedron(inverse: boolean = false) {
    // Create an Object3D to define the points
    const object3D = new THREE.Object3D();

    // Define the vertices for a tetrahedron
    const vertices = !inverse ? [
        new THREE.Vector3(1, 1, 1),
        new THREE.Vector3(-1, -1, 1),
        new THREE.Vector3(-1, 1, -1),
        new THREE.Vector3(1, -1, -1)
    ]
        : [
            new THREE.Vector3(-1, -1, -1),
            new THREE.Vector3(-1, 1, 1),
            new THREE.Vector3(1, -1, 1),
            new THREE.Vector3(1, 1, -1)
        ];

    // Add vertices to the Object3D
    vertices.forEach(vertex => {
        const point = new THREE.Object3D();
        point.position.copy(vertex);
        object3D.add(point);
    });

    // Extract vertices from Object3D and convert to array
    const positions: number[] = [];
    object3D.children.forEach(child => {
        positions.push(child.position.x, child.position.y, child.position.z);
    });

    // Define the faces (indices) for the tetrahedron
    const indices = [
        0, 1, 2,
        0, 2, 3,
        0, 3, 1,
        1, 3, 2
    ];

    // Create a BufferGeometry and set its attributes
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);

    // Create a material
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    // Create a mesh with the geometry and material
    const tetrahedron = new THREE.Mesh(geometry, material);

    // Calculate the centroid of the tetrahedron
    const centroid = new THREE.Vector3();
    vertices.forEach(vertex => {
        centroid.add(vertex);
    });
    centroid.divideScalar(vertices.length);

    // Create vertices, indices, and faces for a sphere geometry
    const radius = 1;
    const widthSegments = 32;
    const heightSegments = 16;

    const spherePositions: number[] = [];
    const sphereIndices: number[] = [];
    const phiStart = 0;
    const phiLength = Math.PI * 2;
    const thetaStart = 0;
    const thetaLength = Math.PI;

    for (let y = 0; y <= heightSegments; y++) {
        const theta = thetaStart + y / heightSegments * thetaLength;
        for (let x = 0; x <= widthSegments; x++) {
            const phi = phiStart + x / widthSegments * phiLength;
            const vertexX = -radius * Math.cos(phi) * Math.sin(theta);
            const vertexY = radius * Math.cos(theta);
            const vertexZ = radius * Math.sin(phi) * Math.sin(theta);
            spherePositions.push(vertexX, vertexY, vertexZ);
        }
    }

    for (let y = 0; y < heightSegments; y++) {
        for (let x = 0; x < widthSegments; x++) {
            const v1 = (y * (widthSegments + 1)) + x;
            const v2 = v1 + widthSegments + 1;
            const v3 = v1 + 1;
            const v4 = v2 + 1;

            sphereIndices.push(v1, v2, v4);
            sphereIndices.push(v1, v4, v3);
        }
    }

    // Create BufferGeometry for the sphere
    const sphereGeometry = new THREE.BufferGeometry();
    sphereGeometry.setAttribute('position', new THREE.Float32BufferAttribute(spherePositions, 3));
    sphereGeometry.setIndex(sphereIndices);

    // Create a material for the sphere
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

    // Create a mesh for the sphere
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.copy(centroid);

    // Add the sphere to the tetrahedron
    tetrahedron.add(sphere);

    return { tetrahedron, centroid: sphere };
}


const vertexCount = vertices.length;
const indexCount = indices.length;
const vertexSize = vertexCount * 4; // 4 bytes per float
const indexSize = indexCount * 2; // 2 bytes per uint16

const bufferSize = vertexSize + indexSize;
const sharedBuffer = new SharedArrayBuffer(bufferSize);

const dataView = new DataView(sharedBuffer);

function writeVertices(vertices: Float32Array, dataView: DataView) {
    let offset = 0;
    for (let i = 0; i < vertices.length; i++) {
        dataView.setFloat32(offset, vertices[i], true); // little-endian
        offset += 4; // move to the next float32
    }
}

function writeIndices(indices: Uint16Array, dataView: DataView, offset: number) {
    for (let i = 0; i < indices.length; i++) {
        dataView.setUint16(offset, indices[i], true); // little-endian
        offset += 2; // move to the next uint16
    }
}

writeVertices(vertices, dataView);
writeIndices(indices, dataView, vertexSize);

function readVertices(dataView: DataView, count: number): Float32Array {
    const vertices = new Float32Array(count);
    let offset = 0;
    for (let i = 0; i < count; i++) {
        vertices[i] = dataView.getFloat32(offset, true); // little-endian
        offset += 4; // move to the next float32
    }
    return vertices;
}

function readIndices(dataView: DataView, count: number, offset: number): Uint16Array {
    const indices = new Uint16Array(count);
    for (let i = 0; i < count; i++) {
        indices[i] = dataView.getUint16(offset, true); // little-endian
        offset += 2; // move to the next uint16
    }
    return indices;
}

const readVerticesArray = readVertices(dataView, vertexCount);
const readIndicesArray = readIndices(dataView, indexCount, vertexSize);

console.log("Vertices:", readVerticesArray);
console.log("Indices:", readIndicesArray);
console.log(generateTetrahedron())

export type VERTICES = Array<[number,number,number]>
export type VERTICES_GENERATOR = AsyncGenerator<(vertices: Array<[number,number,number]>[])=>Promise<any>,SharedArrayBuffer,void> 