import WebSocket from 'ws';
import { ServerResponse } from 'http';
import mqtt from "mqtt";
import Graphology from 'graphology';
import { UniversalGraph, Universe2D,HDNodeAttributes } from './src/server/index';
import './src/server/main'
// import { HDNodeWallet } from 'ethers';
// const entity = HDNodeWallet.fromPhrase("fun dwarf until ghost ahead biology toilet gym obvious copper clarify pool").neuter();
// const entity2 = HDNodeWallet.fromPhrase("roast thank tiny coach seat ensure cruel auto shaft finish fee resemble").neuter();
// console.log({entity,entity2});

export type HDGraph = Graphology<HDNodeAttributes> ;
(async () => {
    const graph: UniversalGraph = new Graphology();
    const entities: Map<string, any> = new Map([
        ["challenges", new Set<Buffer>()],// Store WebAuthn challenges in-memory (replace with a database in production)
        ["sseClients", new Set<ServerResponse>()], // SSE (Server-Sent Events) setup for real-time updates
        ["mqttClient", new Set([
            mqtt.connect("ws://localhost:3883")
        ])],
        ["udpServer", new Set()],
        ["peers", new Set<WebSocket>()]
    ]);

    Array.from(entities).forEach(([entity, set], index: number) => {
        console.log(entity)
        if (!graph.hasNode(entity)) {
            graph.addNode(entity, {
                index,
                depth: set?.size ?? 0
            })
        }
        if (set && set.size > 0) {
            Array.from(set).forEach((transform, depth: number) => {
                for (const transform of set) {
                    console.log({transform});
                    graph.addNode(`m/${index}/${depth}`, {
                        index,
                        depth
                    })
                    graph.addEdge(entity, `m/${index}/${depth}`)
                }
            });
        }

    });
    new Universe2D({serializedGraph: graph.export()});
    // const universe = new Universe2D({serializedGraph: graph.export()});
})();