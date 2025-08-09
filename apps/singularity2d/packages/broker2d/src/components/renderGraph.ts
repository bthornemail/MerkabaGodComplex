// import mqtt from "../modules/mqtt/mqtt.esm.js"; // import connect from mqtt
// import * as ethers from "../modules/ethers/ethers.min.js";
// import { HDNodeWallet } from "../modules/ethers/ethers.min.js";
// import * as Merkletree from '../modules/merkletree/merkletree.js';
// import base64url from 'https://cdn.jsdelivr.net/npm/base64url@3.0.1/+esm'

import ForceGraph3D from "3d-force-graph";
import generateRandomBytes from "../bin/generate.random.bytes.js";
import { HDNodeWallet } from "ethers";
import { logger } from "../app.js";
import onNodeClick from "../bin/onNodeClick.js";
// import ForceGraph3D from "../modules/3d-force-graph/dist/3d-force-graph";
// import generateRandomBytes from "../bin/generate.random.bytes";

const extendedKeyInput = document.querySelector("#key") as HTMLInputElement;
const hostInput = document.querySelector("#host-url") as HTMLInputElement;
const hostExtendedKeyInput = document.querySelector("#host-address") as HTMLInputElement;
const graphElement = document.getElementById('graph') as HTMLDivElement;
const connectButton = document.querySelector("#connect") as HTMLButtonElement;
const createButton = document.querySelector("#create") as HTMLButtonElement;
const registerButton = document.querySelector("#register") as HTMLButtonElement;
const activateButton = document.querySelector("#activate") as HTMLButtonElement;
const canvasElement = document.querySelector("#canvas") as HTMLCanvasElement;
// import generateRandomBytes from "../bin/generate.random.bytes.js";
export default async function renderGraph({ user, client, domElement, tree }: any) {
    domElement.style.margin = "0 auto";
    const entity = HDNodeWallet.fromExtendedKey(user.extendedKey).deriveChild(0).extendedKey;
    const graph = new ForceGraph3D(domElement)
        .graphData({
            nodes: [Object.assign({ color: "yellow" }, { extendedKey: user.extendedKey })],
            links: []
        })
        .backgroundColor("rgba(0,0,0,0)")
        .width(domElement.clientWidth * .95)
        .height(domElement.clientHeight * .325)
        // .width(document.body.clientWidth)
        // .height(document.body.clientHeight)
        // .width(360)
        // .height(360)
        .nodeLabel("extendedKey")
        .nodeId("extendedKey")
        .onNodeClick((node)=>onNodeClick({ user, client, domElement, tree,node }))
        .onBackgroundClick(async () => {
            await canvasElement.requestFullscreen();
            // await document.documentElement.requestFullscreen();
            if ('keyboard' in navigator && 'lock' in <any>navigator.keyboard) {
                const keyBoard = navigator.keyboard as any
                // Supported!
                keyBoard.lock(); //ll keys
                // await navigator.keyboard.lock([
                //     "KeyW",
                //     "KeyA",
                //     "KeyS",
                //     "KeyD",
                //   ]);
                document.addEventListener('keydown', (event) => {
                    const isMinus = (event.code === 'Minus') && !(event.ctrlKey || event.metaKey);
                    const isPlus = (event.code === 'Equal') && event.shiftKey && !(event.ctrlKey || event.metaKey);
                    let {x,y,z} = graph.cameraPosition();
                    // let {x,y,z, lookAt} = graph.cameraPosition();
                    // let {lx,ly,lz,lw} = lookAt;
                    // alert(JSON.stringify([[{x,y,z}], [lookAt], [ms]]));
                    
                    if (isMinus) {
                        graph.cameraPosition({x,y,z: --z})//], [lookAt], 1000)
                        // Do something when the 'A' key was pressed, but only
                        // when not in combination with the command or control key.
                        keyBoard.unlock();
                    }
                    if (isPlus) {
                        graph.cameraPosition({x,y,z: ++z})//, [lookAt], [ms])
                        // Do something when the 'A' key was pressed, but only
                        // when not in combination with the command or control key.
                    } else {
                        keyBoard.unlock();
                    }
                });
            }
        })
        .cooldownTicks(100);
    graph.onEngineStop(() => graph.zoomToFit(400));

    // // Handle incoming MQTT messages
    // client.on("message", (topic: string, message: any) => {
    //     const data = JSON.parse(message.toString());
    //     logger("new mqtt message", topic, data)
    //     switch (topic) {
    //         case "webauthn/challenge":
    //             throw new Error("Not Implemented");
    //             handleChallenge(data);
    //             break;
    //         case "webauthn/attestation":
    //             throw new Error("Not Implemented");
    //             handleAttestation(data);
    //             break;
    //         case "webauthn/assertion":
    //             throw new Error("Not Implemented");
    //             handleAssertion(data);
    //             break;
    //     }
    // });
    // Periodic graph synchronization
    setInterval(() => {
        graph.graphData().nodes.forEach((node: any) => {
            client.publish(`${node.extendedKey}/sync`, JSON.stringify({
                // client.publish(`${node.protocol.host}:${node.protocol.port}/sync`, {
                merkleRoot: tree.getRoot().toString('hex'),
                nodes: graph.graphData().nodes,
                links: graph.graphData().links
            }));
        });
    }, 5000);
    // Periodic node validation

    setInterval(async () => {
        const challenge = generateRandomBytes(16);
        await client.publish(`${entity}"}/challenge`, challenge);
        // Expect signed response within timeframe
    }, 30000);
    return graph;
}