import { HDNodeWallet, id, randomBytes, sha256 } from 'ethers';
import { MultiGraph } from 'graphology';
import { Attributes } from 'graphology-types';
// import WebSocket from 'ws';
// import { ServerResponse } from 'http';
// import mqtt from "mqtt";
// import Graphology from 'graphology';
// import { UniversalGraph, Universe2D,HDNodeAttributes } from './src/server/index';

// export type HDGraph = Graphology<HDNodeAttributes> ;
// (async () => {
//     const graph: UniversalGraph = new Graphology();
//     const entities: Map<string, any> = new Map([
//         ["challenges", new Set<Buffer>()],// Store WebAuthn challenges in-memory (replace with a database in production)
//         ["sseClients", new Set<ServerResponse>()], // SSE (Server-Sent Events) setup for real-time updates
//         ["mqttClient", new Set([
//             mqtt.connect("ws://localhost:3883")
//         ])],
//         ["udpServer", new Set()],
//         ["peers", new Set<WebSocket>()]
//     ]);

//     Array.from(entities).forEach(([entity, set], index: number) => {
//         console.log(entity)
//         if (!graph.hasNode(entity)) {
//             graph.addNode(entity, {
//                 index,
//                 depth: set?.size ?? 0
//             })
//         }
//         if (set && set.size > 0) {
//             Array.from(set).forEach((transform, depth: number) => {
//                 for (const transform of set) {
//                     graph.addNode(`m/${index}/${depth}`, {
//                         index,
//                         depth
//                     })
//                     graph.addEdge(entity, `m/${index}/${depth}`)
//                 }
//             });
//         }

//     });
//     const universe = new Universe2D({serializedGraph: graph.export()});
// })();
class PatriciaTrieNode {
    key: string;
    isEndOfWord: boolean;
    data: any;
    children: PatriciaTrieNode[];

    constructor(key: string) {
        this.key = key;
        this.isEndOfWord = false;
        this.data = null;
        this.children = [];
    }
}

class PatriciaTrie {
    root: PatriciaTrieNode;

    constructor(key?: string) {
        const challenge = randomBytes(32);
        const { path, publicKey, address, extendedKey,index, depth, fingerprint, parentFingerprint } = key ? HDNodeWallet.fromExtendedKey(key) : HDNodeWallet.createRandom(sha256(challenge), "m").neuter();
        this.root = new PatriciaTrieNode(path!);
        this.root.data = { path, extendedKey, publicKey, address, index, depth, fingerprint, parentFingerprint };
        console.log({challenge});
    }

    insert(path: string, data: any): void {
        let node = this.root;
        const segments = path.split('/');

        for (let segment of segments) {
            let found = false;
            for (let child of node.children) {
                if (child.key === segment) {
                    node = child;
                    found = true;
                    break;
                }
            }

            if (!found) {
                const newNode = new PatriciaTrieNode(segment);
                node.children.push(newNode);
                node = newNode;
            }
        }

        node.isEndOfWord = true;
        node.data = data;
    }

    search(path: string): any {
        let node = this.root;
        const segments = path.split('/');

        for (let segment of segments) {
            let found = false;
            for (let child of node.children) {
                if (child.key === segment) {
                    node = child;
                    found = true;
                    break;
                }
            }

            if (!found) {
                return null;
            }
        }

        return node.isEndOfWord ? node.data : null;
    }
}

class HybridGraph<Layer extends Attributes = Attributes> extends MultiGraph {
    patriciaTrie: PatriciaTrie;
    constructor(entity: string = "Brian", password: string = sha256(randomBytes(16)), path: string = "m", challenge: Uint8Array<ArrayBufferLike> = randomBytes(32)) {
        super();
        this.patriciaTrie = new PatriciaTrie();
        const wallet = HDNodeWallet.createRandom(password, path);
        // const wallet = !entity ? HDNodeWallet.createRandom(password, "m") : HDNodeWallet.fromExtendedKey(entity);
        const userId = randomBytes(16);
        const options = {
            challenge: challenge,
            rp: { name: "unity-2d" },
            user: {
                id: wallet.extendedKey,
                name: wallet.address,
                displayName: entity
            },
            pubKeyCredParams: [
                { type: "public-key", alg: -7 },  // ES256
                { type: "public-key", alg: -257 } // RS256
            ],
            authenticatorSelection: {
                userVerification: "preferred",
                residentKey: "required"
            }
        }
        // const encryptedData = "encrypted_wallet_data";
        this.registerEntity(entity, wallet.path!, options);
    }

    registerEntity(entity: string, walletPath: string, encryptedData: any) {
        // Add the entity as a graph node
        this.addNode(entity, { path: walletPath });

        // Insert the walletPath into the Patricia Trie
        this.patriciaTrie.insert(walletPath, encryptedData);
    }

    getWalletData(path: string): any {
        return this.patriciaTrie.search(path);
    }
}


const graph = new HybridGraph<any>();
console.log(graph.getWalletData("m")); // Should return "encrypted_wallet_data"
console.log(graph.getWalletData("m/369")); // Should return "encrypted_wallet_data"
// console.log(graph.patriciaTrie); // Should return "encrypted_wallet_data"
console.log(graph.patriciaTrie.root); // Should return "encrypted_wallet_data"