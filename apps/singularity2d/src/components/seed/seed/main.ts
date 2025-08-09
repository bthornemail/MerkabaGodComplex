import ollama from 'ollama'
import Graphology from 'graphology';
// import { SVGRenderer } from 'three/addons/renderers/SVGRenderer.js';
import * as THREE from 'three';
import * as d3 from "d3";
import { SerializedGraph } from 'graphology-types';

// const light = new Float64Array(universe,universe.byteLength % 2,universe.byteLength / 2);
// const dark = new Uint32Array(universe,universe.byteLength / 2,universe.byteLength / 2);;
// const heaven = new Uint16Array(light.buffer,light.byteLength % 2,light.byteLength / 2);
// const earth = new Uint8Array(light.buffer,light.byteLength / 2,light.byteLength / 2);
const data = {
    name: "Eve",
    children: [
        { name: "Cain" },
        { name: "Seth", children: [{ name: "Enos" }, { name: "Noam" }] },
        { name: "Abel" },
        { name: "Awan", children: [{ name: "Enoch" }] },
        { name: "Azura" }
    ]
};

    const scene = new THREE.Scene();
const seed = d3.hierarchy(data);
const clock = new ArrayBuffer(0);
const _clock = new Array(0);
const universe = new ArrayBuffer(144000); //Revelation
const _universe = new Array(144000); //Revelation
const light = new Uint32Array(universe);
const dark = new Uint32Array(universe);
const heaven = new Uint16Array(universe);
const earth = new Uint8Array(universe);
function Dodecahedron(universe: ArrayBuffer, count: ArrayBuffer): Promise<void> {
    return new Promise((resolve) => {
        console.log("universe", new Uint8Array(universe));
        console.log("pointer", new Uint8Array(count));
        setTimeout(resolve, 1300)
    });
}
function Icosahedron(universe: ArrayBuffer, count: ArrayBuffer): Promise<void> {
    return new Promise((resolve) => {
        console.log("universe", new Uint8Array(universe));
        console.log("pointer", new Uint8Array(count));

        setTimeout(resolve, 1300)
    });
}
function Octahedron(universe: ArrayBuffer, count: ArrayBuffer): Promise<void> {
    return new Promise((resolve) => {
        console.log("universe", new Uint16Array(universe));
        console.log("pointer", new Uint8Array(count));

        setTimeout(resolve, 1300)
    });
}
function Cube(universe: ArrayBuffer, count: ArrayBuffer): Promise<void> {
    return new Promise((resolve) => {
        console.log("universe", new Uint32Array(universe));
        console.log("pointer", new Uint8Array(count));

        setTimeout(resolve, 1300)
    });
}
async function Tetrahedron(universe: ArrayBuffer, clock: ArrayBuffer): Promise<void> {
    // const tree = d3.quadtree<any>(seed);
    const messages = [{ role: 'user', content: 'Why is the sky blue?' }];
    const message = { role: 'user', content: 'Why is the sky blue?' }
    const response = await ollama.chat({
        model: 'qwen3:1.7b',
        messages: [{ role: 'user', content: 'Why is the sky blue?' }],
    })
    console.log(response.message.content)
    return;
}
function Plane(universe: ArrayBuffer, count: ArrayBuffer): Promise<void> {
        const paths = [
        "axes.js",
        "channel.js",
        "context.js",
        "legends.js",
        "legends/ramp.js",
        "marks/density.js",
        "marks/dot.js",
        "marks/frame.js",
        "scales/diverging.js",
        "scales/index.js",
        "scales/ordinal.js",
        "stats.js",
        "style.js",
        "transforms/basic.js",
        "transforms/bin.js",
        "transforms/centroid.js",
        "warnings.js",
    ];
    let d1 = new Graphology()
    let d2 = new Graphology()
    const root = d3.stratify<SerializedGraph>()
    root([d1.export(),d2.export()])//.path((d) => d)(paths);
    return new Promise((resolve) => {
        console.log("universe", new Uint8Array(universe));
        console.log("pointer", new Uint8Array(count));
        setTimeout(resolve, 1300)
    });
}
function RayCaster(universe: ArrayBuffer, count: ArrayBuffer): Promise<void> {


    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    function onPointerMove(event: any) {

        // calculate pointer position in normalized device coordinates
        // (-1 to +1) for both components

        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

    }

    function render() {

        // update the picking ray with the camera and pointer position
        raycaster.setFromCamera(pointer, camera);

        // calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects(scene.children);

        for (let i = 0; i < intersects.length; i++) {

            intersects[i].object//.material.color.set(0xff0000);

        }

    }

    window.addEventListener('pointermove', onPointerMove);

    window.requestAnimationFrame(render);
    return new Promise((resolve) => {
        console.log("universe", new Uint8Array(universe));
        console.log("pointer", new Uint8Array(count));
        setTimeout(resolve, 1300)
    });
}
function Edge(universe: ArrayBuffer, count: ArrayBuffer): Promise<void> {
    // const geometry = new THREE.BoxGeometry(100, 100, 100);
    // const edges = new THREE.EdgesGeometry(geometry);
    // const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));
    // scene.add(line);
    const width = 12;
    const height = 12;
    const treemap = d3.treemap<any>();
    treemap.size([width, height]);
    treemap.padding(2);

    // Sum and sort the data.
    // seed.sum((d) => d.value);
    // seed.sort((a, b) => b.height - a.height || b.value - a.value);

    // Compute the treemap layout.
    treemap(seed);

    // Retrieve all descendant nodes.
    const nodes = seed.descendants();

    const bisector = d3.bisector((d) => d.Date);

    return new Promise((resolve) => {
        // Construct the treemap layout.
        console.log("universe", new Uint8Array(universe));
        console.log("pointer", new Uint8Array(count));
        setTimeout(resolve, 1300)
    });
}
function Sphere(universe: ArrayBuffer, count: ArrayBuffer): Promise<void> {
    
    return new Promise((resolve) => {
        console.log("universe", new Uint8Array(universe));
        console.log("pointer", new Uint8Array(count));
        setTimeout(resolve, 1300)
    });
}
function Point(universe: ArrayBuffer, clock: ArrayBuffer): Promise<void> {
    const tree = d3.treemap<any>()
    tree(seed)
    return new Promise((resolve) => {
        const reality = new Uint8Array(universe);
        reality.fill(1);
        const count = new Uint8Array(clock)
        count.set(reality.slice(0, 1));
        // const dimensions =  Array.from(new Uint8Array(clock))
        console.log("universe", new Uint8Array(universe));
        console.log("pointer", new Uint8Array(count));
        setTimeout(resolve, 1300)
    });
}
async function loop() {
    do {
        console.count(`Running loop size${clock.byteLength}`)

        let root = seed.copy();
        root.sum((d) => d.value ? 1 : 0);
        // console.log("Running loop", );
        if (clock.byteLength > 144000) await Sphere(new DataView(universe, 21, 144000).buffer, clock);
        else if (clock.byteLength >= 21) await Dodecahedron(new DataView(universe, 13, 21).buffer, clock);
        else if (clock.byteLength >= 13) await Icosahedron(new DataView(universe, 9, 13).buffer, clock);
        else if (clock.byteLength >= 9) await Octahedron(new DataView(universe, 7, 9).buffer, clock)
        else if (clock.byteLength >= 7) await Cube(new DataView(universe, 6, 7).buffer, clock)
        else if (clock.byteLength >= 6) await Tetrahedron(new DataView(universe, 5, 6).buffer, clock)
        else if (clock.byteLength >= 5) await Plane(new DataView(universe, 4, 5).buffer, clock)
        else if (clock.byteLength >= 4) await RayCaster(new DataView(universe, 3, 4).buffer, clock)
        else if (clock.byteLength >= 3) await Edge(new DataView(universe, 2, 3).buffer, clock)
        else if (clock.byteLength >= 2) await Sphere(new DataView(universe, 1, 2).buffer, clock);
        else await Point(new DataView(universe, 0, 1).buffer, clock);
        for (const descendant of root) {
            console.log(descendant);
        }
    } while (clock.byteLength < 144000);

}

loop();