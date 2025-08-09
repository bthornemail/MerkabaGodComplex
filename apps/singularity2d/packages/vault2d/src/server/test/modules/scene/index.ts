import { HDNodeWallet, sha256 } from 'ethers';
import * as THREE from 'three';
import {MultiGraph} from "graphology";
import { MerkleTree } from 'merkletreejs';
import { EventEmitter } from 'node:events';
import { Socket } from 'node:dgram';
import { BLOCK } from '../environment/index.js';
import { Peer } from '../user/index.js';
import { Socket as NetSocket , Server as NetServer } from 'node:net';
import createNetSocket from 'server/test/bin/create.net.socket.js';
import createNetServer from 'server/test/bin/create.net.server.js';
import { Block } from 'server/modules/blockchain/index.js';
import { Content } from 'server/index.js';
import { iDefinitions } from 'server/types/interfaces.js';
import { CONTENT, DESCRIPTION, HEADER, PARAMETERS,  WEIGHT, FEATURE, ID, DEFINTIONS, PROPERTY  } from '../../../../server/types/types.js';

// import createEnvServer from '../../bin/create.server';
// import createSocket from '../../bin/create.socket';
// import { Socket, Server as NetServer } from 'node:net';
// import { BLOCK } from '../environment';
// import { Identity, Entity, Peer } from '../user';

export class BaseScene extends EventEmitter {
    width: number = 512;
    height: number = 512;

    /**
     * Initializes the Three.js scene, camera, and renderer.
     */
    scene: THREE.Scene = new THREE.Scene();

    // Set up a perspective camera with a field of view of 75 degrees,
    // aspect ratio matching the canvas, and near and far clipping planes.
    camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
        75,
        this.width / this.height,
        0.1,
        1000
    );
}
export class Scene extends BaseScene {
    user?: [Peer, NetServer];
    connections: Map<string, NetSocket> = new Map();
    peers: Map<Peer, BLOCK> = new Map();
    graph: MultiGraph = new MultiGraph();
    tree: MerkleTree = new MerkleTree([], sha256)
    // async addNode(snapshot: SNAPSHOT){
    //     const [extendedKey, root, graphData, signature]  = snapshot;
    //     this.graph.addNode(this.graph.nodes().length, snapshot);
    // };
    async initalize(phrase: string = "") {

        const wallet = HDNodeWallet.createRandom();
        const extendedKey = wallet.neuter().extendedKey;
        const definitions: DEFINTIONS = {
            attributes: [],
            events:[],
            properties: [
                ["extendedKey", [extendedKey]]
            ],
            references: []
        };
        const description: DESCRIPTION = {
            author: wallet.address,
            summary: "peer",
            description: "Peer Wallet",
            signature: wallet.signMessageSync(JSON.stringify(definitions)),
        };
        const header: HEADER = {hash: "",previous: "",signature: "",timestamp: Date.now()};
        const parameters: PARAMETERS = {features: [],weights: []};
        const content: CONTENT = new Content({header,parameters,description,definitions });
        // const [extendedKey,root, hash, signature] = new Block(content);
        const {entity,hash, signature} = new Block(content);
        
        const user = new Peer([extendedKey, this.tree.getRoot().toString("hex"), hash, signature]);
        const snapshot = await user.snapshot();
        this.user = [user, await createNetServer(snapshot)];
        return user;
    };
    async addPeers(phrases: string[] = []) {
        for (const phrase of phrases) {
            const wallet = HDNodeWallet.createRandom();
            const extendedKey = wallet.neuter().extendedKey;
            const definitions: DEFINTIONS = {
                attributes: [],
                events:[],
                properties: [
                    ["extendedKey", [extendedKey]]
                ],
                references: []
            }
            const description: DESCRIPTION = {
                author: wallet.address,
                summary: "peer",
                description: "Peer Wallet",
                signature: wallet.signMessageSync(JSON.stringify(definitions)),
            };
            const header: HEADER = {hash: "",previous: "",signature: "",timestamp: Date.now()};
            const parameters: PARAMETERS = {features: [],weights: []};
            const content: CONTENT = new Content({header,parameters,description, definitions });
            // const [extendedKey,root, hash, signature] = new Block(content);
            const {entity,hash, signature} = new Block(content);
            const peer = new Peer([extendedKey, this.tree.getRoot().toString("hex"), hash, signature]);
            const snapshot = await peer.snapshot();
            this.peers.set(peer, snapshot);
            this.connections.set(peer.extendedKey, await createNetSocket(snapshot));
        }
        return this.peers;
    }
    async addContent(content: CONTENT, getSignature: (hash: string) => Promise<string>) {
        const hash = sha256(this.tree.bufferify(`${content.definitions}`));
        // const hash = sha256(this.tree.bufferify(`${content[1]}:${content[2]}`));
        const signature = await getSignature(hash);
        this.graph.addNode(signature, content);
        return signature;
        // this.graph.addNode(this.graph.nodes().length, block);
    }

    async addBlock(block: BLOCK, getSignature: (hash: string) => Promise<string>) {
        const hash = sha256(this.tree.bufferify(`${block[1]}:${block[2]}`));
        const signature = await getSignature(hash);
        this.graph.addNode(signature, block);
        return signature;
        // this.graph.addNode(this.graph.nodes().length, block);
    }
    async addTransaction(source: BLOCK, target: BLOCK, getSignature: (hash: string) => Promise<string>) {
        const shash = sha256(this.tree.bufferify(`${source[1]}:${source[2]}`));
        const thash = sha256(this.tree.bufferify(`${target[1]}:${target[2]}`));
        if (!this.graph.hasNode(shash) && !this.graph.hasNode(thash)) throw new Error("No in graph");
        const hash = sha256(this.tree.bufferify(`${shash}:${thash}`));
        const signature = await getSignature(hash);
        this.graph.addEdgeWithKey(signature, shash, thash, { source, target, signature });
        // return [extendedKey, root, hash, signature];s
    }
    // async resolveTransaction(source: BLOCK, target: BLOCK, signature: string) {
    //     this.graph.addEdgeWithKey(this.graph.edges().length, source[0], target[0], { source, target, signature });
    // }
    // async revertTransaction(source: BLOCK, target: BLOCK, signature: string) {
    //     this.graph.addEdgeWithKey(this.graph.edges().length, source[0], target[0], { source, target, signature });
    // }
    // async confirmTransaction(source: BLOCK, target: BLOCK, signature: string) {
    //     this.graph.addEdgeWithKey(this.graph.edges().length, source[0], target[0], { source, target, signature });
    // }
};