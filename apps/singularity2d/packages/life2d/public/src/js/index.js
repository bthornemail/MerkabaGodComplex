import { readFileSync } from 'node:fs';
import { randomInt } from 'node:crypto';

import { mdns } from '@libp2p/mdns'
import { bootstrap } from '@libp2p/bootstrap'
import { kadDHT } from '@libp2p/kad-dht'

import { red, bright, custom, reset, blue, green, yellow } from './bin/consoleColors.js';
import { wallets, accounts } from '../data/test.wallets.js';

import createNode from './bin/create.node.js';

import Token from '../modules/Token.js';
import Marketplace from '../modules/Marketplace2d.js';
import AssetManager from '../modules/Asset.Manager.js';
import ServiceBoard from '../modules/Service.Board.js';
import ExamProctor from '../modules/Exam.Proctor.js';

import testCoin2d from './test/coin2d.js';
import testMarketplace2d from './test/marketplace2d.js';
import testClient from './test/client.js';
import testServer from './test/server.js';
import { writeFileSync } from 'node:fs';

const USERDATA = JSON.parse(readFileSync('./data/users.json', 'utf8'));
const config = {
    addresses: {
        // Swarm: ['/ip4/0.0.0.0/tcp/23232'],
        // swarm: process.argv[2] ? ['/ip4/0.0.0.0/tcp/32323'] : ['/ip4/0.0.0.0/tcp/23232'],
        listen: [
            // process.argv[2] && process.argv[2] === 1 ? '/ip4/0.0.0.0/tcp/32323' : '/ip4/0.0.0.0/tcp/23232',
            // '/ip4/127.0.0.1/tcp/' + randomInt(30000, 40000),
            // '/ip4/127.0.0.1/tcp/' + PORT,
            // '/ip4/0.0.0.0/tcp/' + PORT,
            '/ip4/0.0.0.0/tcp/' + randomInt(30000, 40000),
            '/ip4/0.0.0.0/tcp/' + randomInt(40000, 50000) + '/ws',

        ]
    },
    // peerId: await getPeerId(options),
    // connectionProtector: swarmKey ? preSharedKey({
    //     psk: swarmKey
    // }) : null,
    peerDiscovery: [
        mdns(),
        // bootstrap({
        //     list: [
        //         '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
        //         '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
        //         '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
        //         '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt'
        //         // multiaddr
        //     ]
        // }),
        kadDHT({
            kBucketSize: 20,
            clientMode: true           // Whether to run the WAN DHT in client or server mode (default: client mode)
            // clientMode: false           // Whether to run the WAN DHT in client or server mode (default: client mode)
        })
    ],
};
(async () => {
    const swarmKey = new TextEncoder().encode(readFileSync('./swarm.key', 'utf8')); //Load swarm key
    // console.log("Loaded Swarm Key");
    // console.log(swarmKey);
    if (process.argv[2]) {
        // Loads a client node by default that gets random wallet and peerid
        console.log("Loaded User", USERDATA[process.argv[2]].name)

        switch (process.argv[2] % 2 == 0) {
            case false:
                // Loads a user client node
                console.log("Loaded User Client Node");
                const userServerNode = await createNode({
                    config: {
                        addresses: {
                            // Swarm: ['/ip4/0.0.0.0/tcp/23232'],
                            // swarm: process.argv[2] ? ['/ip4/0.0.0.0/tcp/32323'] : ['/ip4/0.0.0.0/tcp/23232'],
                            listen: [
                                // process.argv[2] && process.argv[2] === 1 ? '/ip4/0.0.0.0/tcp/32323' : '/ip4/0.0.0.0/tcp/23232',
                                // '/ip4/127.0.0.1/tcp/' + randomInt(30000, 40000),
                                // '/ip4/127.0.0.1/tcp/' + PORT,
                                // '/ip4/0.0.0.0/tcp/' + PORT,
                                '/ip4/0.0.0.0/tcp/' + 30000,
                                '/ip4/0.0.0.0/tcp/' + 40000 + '/ws',

                            ]
                        }
                    }, swarmKey, peerId: USERDATA[process.argv[2]].peerId, privateKey: USERDATA[process.argv[2]].privateKey, key: USERDATA[process.argv[2]].key
                });
                const coin2dServer = new Token({ name: "Coin 2D", wallet: wallets[0], key: USERDATA[process.argv[2]].privateKey });
                await coin2dServer.connect(userServerNode);
                const assetManager = new AssetManager({ name: "Asset Manager", wallet: wallets[process.argv[2]], key: USERDATA[process.argv[2]].privateKey });
                const examProctor = new ExamProctor({ name: "Exam Proctor", wallet: wallets[process.argv[2]], key: USERDATA[process.argv[2]].privateKey });
                const serviceBoard = new ServiceBoard({ name: "Exam Proctor", wallet: wallets[process.argv[2]], key: USERDATA[process.argv[2]].privateKey });
                await assetManager.connect(userServerNode);
                await examProctor.connect(userServerNode);
                await serviceBoard.connect(userServerNode);
                await testServer(coin2dServer, assetManager, serviceBoard, examProctor)

                try {
                    const json = JSON.parse(readFileSync("./data/multiaddrs.json", "utf-8"));
                    setTimeout(console.log, 2000)
                    const _json = json.concat(userServerNode.libp2p.getMultiaddrs());
                    console.log(_json)
                    writeFileSync("./data/multiaddrs.json", JSON.stringify(_json))
                } catch (error) {
                    console.log(error)
                    writeFileSync("./data/multiaddrs.json", JSON.stringify(userServerNode.libp2p.getMultiaddrs()))
                }
                break;
            default:
                // Loads a user server node
                console.log("Loaded User Server Node");
                const serverNode = await createNode({
                    config: {
                        addresses: {
                            // Swarm: ['/ip4/0.0.0.0/tcp/23232'],
                            // swarm: process.argv[2] ? ['/ip4/0.0.0.0/tcp/32323'] : ['/ip4/0.0.0.0/tcp/23232'],
                            listen: [
                                // process.argv[2] && process.argv[2] === 1 ? '/ip4/0.0.0.0/tcp/32323' : '/ip4/0.0.0.0/tcp/23232',
                                // '/ip4/127.0.0.1/tcp/' + randomInt(30000, 40000),
                                // '/ip4/127.0.0.1/tcp/' + PORT,
                                // '/ip4/0.0.0.0/tcp/' + PORT,
                                '/ip4/0.0.0.0/tcp/' + 30001,
                                '/ip4/0.0.0.0/tcp/' + 40001 + '/ws',

                            ]
                        }
                    }, swarmKey, peerId: USERDATA[process.argv[2]].peerId, privateKey: USERDATA[process.argv[2]].privateKey, key: USERDATA[process.argv[2]].key
                });
                const coin2d = new Token({ name: "Coin 2D", wallet: wallets[0], key: USERDATA[process.argv[2]].privateKey });
                await coin2d.connect(serverNode);
                const marketplace2D = new Marketplace({ name: "Marketplace 2D", wallet: wallets[process.argv[2]], key: USERDATA[process.argv[2]].privateKey });
                marketplace2D.connect(serverNode);
                await testMarketplace2d(coin2d, marketplace2D);

                try {
                    const json = JSON.parse(readFileSync("./data/multiaddrs.json", "utf-8"));
                    setTimeout(console.log, 2000)
                    const _json = json.concat(serverNode.libp2p.getMultiaddrs());
                    // console.log(_json)
                    writeFileSync("./data/multiaddrs.json", JSON.stringify(_json))
                } catch (error) {
                    console.log(error)
                    writeFileSync("./data/multiaddrs.json", JSON.stringify(serverNode.libp2p.getMultiaddrs()))
                }
                break;
        }
        return console.log(serverNode.libp2p.getMultiaddrs());
    }
    // Loads a client node by default that gets random wallet and peerid
    console.log("Loaded Browser Client Node")
    const clientNode = await createNode({
        swarmKey
    });
    const assetManager = new AssetManager({ name: "Asset Manager" });
    const examProctor = new ExamProctor({ name: "Exam Proctor" });
    const serviceBoard = new ServiceBoard({ name: "Service Board" });
    const coin2d = new Token({ name: "Coin 2D" });
    await coin2d.connect(clientNode);
    await assetManager.connect(clientNode);
    await examProctor.connect(clientNode);
    await serviceBoard.connect(clientNode);
    await testClient(coin2d, assetManager, serviceBoard, examProctor);
    await testCoin2d(coin2d)
    try {
        const json = JSON.parse(readFileSync("./data/multiaddrs.json", "utf-8"));
        setTimeout(console.log, 2000)
        const _json = json.concat(clientNode.libp2p.getMultiaddrs());
        console.log(_json)
        writeFileSync("./data/multiaddrs.json", JSON.stringify(_json))
    } catch (error) {
        console.log(error)
        writeFileSync("./data/multiaddrs.json", JSON.stringify(clientNode.libp2p.getMultiaddrs()))
    }
    return console.log(clientNode.libp2p.getMultiaddrs());// await clientNode.libp2p.stop()
})()
