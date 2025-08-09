
import { decryptKeystoreJsonSync, HDNodeWallet, Mnemonic, SigningKey } from "ethers";
import MultiGraph from 'graphology';
import { MerkleTree } from "merkletreejs";
// import frontMatter from "front-matter";
// import * as mqtt from "mqtt";
import { io } from "socket.io-client";
import { MemoryBlockstore } from 'blockstore-core';
import { MemoryDatastore } from "datastore-core";
import { post, set, put, open } from "./test.functions";

const location = "http://127.0.0.1"

export function TestPeer({ identity, encryptedWallet, password, protocol, host, port, extendedKey }) {
    // const wallet = HDNodeWallet.fromExtendedKey(extendedKey);
    const keyStore = decryptKeystoreJsonSync(encryptedWallet, password)
    const signer = new SigningKey(keyStore.privateKey)
    // const wallet = HDNodeWallet.fromMnemonic(Mnemonic.fromEntropy(keyStore.mnemonic.entropy));
    const wallet = HDNodeWallet.fromExtendedKey(extendedKey)
    // console.log(`${bright}${magenta}${identity}'s Address${reset} ${yellow}${wallet.address}${reset} "Initializing"`);

    // const extendedKey = wallet.neuter().extendedKey;
    const blockstore = new MemoryBlockstore();
    const datastore = new MemoryDatastore();

    // const userEntry = formatMarkdown({attributes:user,body:""})
    const wallets = new Map([
        ["Vault2D", wallet.deriveChild(1).deriveChild(8001)],
        ["Chat2D", wallet.deriveChild(1).deriveChild(8002)],
        ["Ledger2D", wallet.deriveChild(1).deriveChild(8003)],
        ["Unity2D", wallet.deriveChild(1).deriveChild(8004)],
        ["Life2D", wallet.deriveChild(1).deriveChild(8005)],
        ["Marketplace2D", wallet.deriveChild(1).deriveChild(8006)],
        ["Knowledge2D", wallet.deriveChild(1).deriveChild(8007)],
        ["QuickWheelWash", wallet.deriveChild(1).deriveChild(8006).deriveChild(0)],
        ["Wash", wallet.deriveChild(1).deriveChild(8006).deriveChild(0).deriveChild(0)],
        ["Gloss", wallet.deriveChild(1).deriveChild(8006).deriveChild(0).deriveChild(1)],
        ["Clean", wallet.deriveChild(1).deriveChild(8006).deriveChild(0).deriveChild(2)],
        ["ScheduledDate", wallet.deriveChild(1).deriveChild(8006).deriveChild(0).deriveChild(3)]
    ]);
    const graph = new MultiGraph({ multi: true });
    // graph.import(groupData)
    // const user = createRandomUser()
    // graph.addNode(user._id,user);
    const merkleTree = new MerkleTree(graph.nodes())
    // console.log(`${bright}${magenta}${identity}'s Graph${reset} ${yellow}${wallet.address}${reset} Number of nodes ${graph.order}`);
    // console.log(`${bright}${magenta}${identity}'s Graph${reset} ${yellow}${wallet.address}${reset} Number of edges ${graph.size}`);
    // const client = mqtt.connect(`${protocol}://${host}`, {
    //     port,
    //     username: '',
    //     password: '',
    //     clean: true,
    //     clientId: wallet.extendedKey
    // })
    const socket = io(":8888")//8011")
    socket.on('connect', function () {
        console.log(identity, wallet.address, "connected", socket.id); // x8WIv7-mJelg7on_ALbx
        socket.emit("auth", wallet.extendedKey, {
            // merkleTree: merkleTree,
            merkleRoot: merkleTree.getRoot(),
            extendedKey: wallet.extendedKey,
            metaData: Array.from(graph.nodeEntries()).map((node) => {
                const expiration = 60 * 24 * 365;
                return Object.assign({}, { identity: node.attributes.title ?? node.node, expiration }, node.attributes)
            }),
            graph
        })
    })
    socket.on("auth", async function (topic, message) {
        console.log(identity, wallet.address); // x8WIv7-mJelg7on_ALbx
        console.log(topic + ": ",message);
    });
    // socket.on(extendedKey, async function (topic, message) {
    //     // console.log(bright, red, topic + ": ", reset, yellow, message.toString(), reset)
    //     const matter = frontMatter(message);
    //     const parsed = formatMarkdown(topic, {
    //         attributes: Object.assign({}, {
    //             // merkleTree: merkleTree,
    //             merkleRoot: merkleTree.getRoot(),
    //             auth: Array.from(wallets.entries()).map(([key, value]) => {
    //                 const expiration = 60 * 24 * 365;
    //                 return Object.assign({}, { identity: key, expiration }, value)
    //             }),
    //             metaData: Array.from(graph.nodeEntries()).map((node) => {
    //                 const expiration = 60 * 24 * 365;
    //                 return Object.assign({}, { identity: node.attributes.title ?? node.node, expiration }, node.attributes)
    //             }),
    //             graph,
    //         }), body: message
    //     })
    //     graph.addNode(parsed, matter.attributes ?? {})
    //     // if (matter.attributes.identity) {
    //     //     client.publish(matter.attributes.identity, parsed)
    //     // }
    // });
    socket.on("disconnect", () => {
        console.log(identity, wallet.address, "disconnected", socket.id); // x8WIv7-mJelg7on_ALbx
    });

    return () => {
        return {
            history: {
                extendedKey,
                // dht: {},
                merkleRoot: merkleTree.getRoot().toString(),
                graph
            },
            user: {
                identity,
                socket,
                signer,
                wallet,
                post: (data) => post(data, { blockstore, datastore }),
                set: (address, signature) => set(address, signature, { blockstore, datastore }),
                open: () => open({ blockstore, datastore }),
                put: (data) => put(data, { blockstore, datastore })
            },
            network: {
                protocol,//: "ws",
                host,//: "127.0.0.1",
                port,//: 8100 + Math.floor(Math.random() * 100),
                path: wallet.path ?? "m/369/1",
                query: `?address=${wallet.address}`
            }
        }
    }
}