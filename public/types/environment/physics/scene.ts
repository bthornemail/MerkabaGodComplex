
import * as THREE from 'three';
import { Vector3 } from 'three';
import { BaseEnvironment } from '..';
const window = {
    innerHeight: 1024,
    innerWidth: 1024
};
export type ITERATION = BigInt64Array;
export type IDENTITY = ArrayBuffer;
export type VALUE = ArrayBuffer;
export type BYTES = ArrayBuffer;
export type NODE = Array<[ITERATION, IDENTITY, VALUE, BYTES]> // Vector3

export type STEP = BigInt64Array;
export type ACTOR = ArrayBuffer;
export type ACTION = ArrayBuffer;
export type TIME = ArrayBuffer;
export type SPACE = ArrayBuffer;
export type CONTEXT = ArrayBuffer;
export type CONTENT = ArrayBuffer;
export type STATE = Array<[STEP, ACTOR, ACTION, CONTEXT]>;
export class Scene extends BaseEnvironment {
    // protected signer: SIGNER;
    // protected vault: VAULT;
    // protected eventListeners: { [event: string]: ((...args: any[]) => void)[]; };
    constructor() {
        super()

        const geometry = new THREE.TetrahedronGeometry();

        const scene = new THREE.Scene();
        // Set geometry attributes
        // geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        // geometry.setIndex(indices);

        // Create a mesh with the geometry and a basic material
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
        const tetrahedron = new THREE.Mesh(geometry, material);

        // Add the mesh to the scene
        scene.add(tetrahedron);

        const geometry1 = new THREE.BoxGeometry(1, 1, 1);
        const material1 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry1, material1);
        scene.add(cube);
        const camera = new THREE.PerspectiveCamera(50, 1000 / 1000, 1, 500);
        camera.position.set(0, 0, 100);
        camera.lookAt(0, 0, 0);

        const materiall = new THREE.LineBasicMaterial({ color: 0x0000ff });
        const points: Vector3[] = [];
        points.push(new Vector3(- 10, 0, 0));
        points.push(new Vector3(0, 10, 0));
        points.push(new Vector3(10, 0, 0));

        const geometryl = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometryl, materiall);
        scene.add(line);
        function Tick(): THREE.Group {
            const step = new THREE.Object3D();
            // scene.add(step);
            const actor = new THREE.Object3D();
            // scene.add(actor);
            const action = new THREE.Object3D();
            // scene.add(action);
            const context = new THREE.Object3D();
            // scene.add(context);
            const centroid = new THREE.Object3D();
            centroid.position.set(100, 100, 0);
            // scene.add(centroid);
            const group = new THREE.Group();
            group.add(step);
            group.add(actor);
            group.add(action);
            group.add(context);
            group.add(centroid);
            return group;
        }
        function Tock(): THREE.Group {
            const group = new THREE.Group();
            const iteration = new THREE.Object3D();
            const m = new THREE.Matrix4();
            // m.set(
            //     1, 1, 1,0,  // v0
            //     1, -1, -1,0,  // v1
            //     -1, 1, -1,0, // v2
            //     -0, -1, 1,0  // v3
            // );
            // [
            //     new TextEncoder().encode("ITERATION"),new TextEncoder().encode("ITERATION".length.toString()),new TextEncoder().encode("1"),new TextEncoder().encode(Date.now().toString()),
            //     new TextEncoder().encode("IDENTITY"),new TextEncoder().encode("service"),new TextEncoder().encode("service"),new TextEncoder().encode("service"),
            //     new TextEncoder().encode("VALUE"),new TextEncoder().encode("service"),new TextEncoder().encode("service"),new TextEncoder().encode("service"),
            //     new TextEncoder().encode("BYTES"),new TextEncoder().encode("service"),new TextEncoder().encode("service"),new TextEncoder().encode("service"),

            // ]
            // [
            //     new TextEncoder().encode("STEP"),new TextEncoder().encode("service"),new TextEncoder().encode("service"),new TextEncoder().encode("service"),
            //     new TextEncoder().encode("ACTOR"),new TextEncoder().encode("service"),new TextEncoder().encode("service"),new TextEncoder().encode("service"),
            //     new TextEncoder().encode("ACTION"),new TextEncoder().encode("service"),new TextEncoder().encode("service"),new TextEncoder().encode("service"),
            //     new TextEncoder().encode("CONTEXT"),new TextEncoder().encode("service"),new TextEncoder().encode("service"),new TextEncoder().encode("service"),

            // ]
            iteration.applyMatrix4(m)
            // scene.add(iteration);
            const identity = new THREE.Object3D();
            // scene.add(identity);
            const value = new THREE.Object3D();
            // scene.add(value);
            const bytes = new THREE.Object3D();
            // scene.add(bytes);
            const centroid = new THREE.Object3D();
            centroid.position.set(100, 100, 0);
            // scene.add(centroid);
            group.add(iteration);
            group.add(identity);
            group.add(value);
            group.add(bytes);
            group.add(centroid);
            return group;
        }

    }
}
export type KEY = string;
export type VERTEX = [TIME, ACTOR, ACTION, SPACE];
export type EDGE = [TIME, ACTOR] | [TIME, ACTION] | [TIME, SPACE] | [ACTOR, ACTION] | [ACTOR, SPACE] | [ACTION, SPACE];
export type FACE = [TIME, ACTOR, ACTION] | [TIME, ACTOR, SPACE] | [TIME, ACTION, SPACE,] | [ACTOR, ACTION, SPACE];


export interface SHAPE {
    verticies: [
        TIME,
        ACTOR,
        ACTION,
        SPACE,
    ],
    edges: [
        [TIME, ACTOR],
        [TIME, ACTION],
        [TIME, SPACE],
        [ACTOR, ACTION],
        [ACTOR, SPACE],
        [ACTION, SPACE]
    ];
    faces: [
        [TIME, ACTOR, ACTION],
        [TIME, ACTOR, SPACE],
        [TIME, ACTION, SPACE],
        [ACTOR, ACTION, SPACE]
    ];
    centroid: CONTENT
};