import MultiGraph from 'graphology';
import { HDNodeWallet } from "ethers";
import { EventEmitter } from 'node:events';
import { forceSimulation } from "d3-force-3d";
import * as d3 from "d3-force-3d";
import { EXTENDED_KEY, iEntity, ENTITY, iDefinitions, iIdentity, iPoint, VARIABLE, iNode, iLayer, iEdge, iGraph, iLink, iSCGCN } from '../index.types';
import { Worker, BroadcastChannel } from 'worker_threads';
import * as net from 'node:net';
import { Server } from 'socket.io';
import { ENVIRONMENT_BLOCK } from '../../../../unity2d/types/environment/environment'
import { createServer } from 'node:http';
import http from "node:http";
import url from "node:url";
import { blue, bright, reset } from '../../../../unity2d';
import { BGblue, BGyellow } from '../../../../unity2d/bin/console/console.colors';
import { Attributes } from 'graphology-types';
import { Edge, Layer } from '..';

export class UDPLayer extends Edge implements iLayer {
    declare definitions: iDefinitions & {
        properties: {
            source: [entity: string];
            target: [entity: string];
        },
        attributes: {
            index: [protocol: number];
            depth: [code: number];
        };
        events: {
            activate?: {
                [transform: string]: string[] | number[];
            }
            create?: {
                [entity: string]: [index: string, depth: string, address: string, script: string];
            };
        };
        references: {
            nodes?: {
                [entity: string]: [index: string, depth: string, address: string, script: string];
            }
            edges?: {
                [index: string]: [source: string, target: string]
            }
        };
    };
    private ipcPath: string;
    private ipc: net.Server;
    private ipcSocket: net.Socket;
    private ipcClientSockets: Set<net.Socket> = new Set();
    private ipcClients: Set<net.AddressInfo | {}> = new Set();
    async propagate(block: ENVIRONMENT_BLOCK) {
        const { definitions } = block;
        if (!definitions) return
        const { features } = definitions;
        if (!features) return
        const { ipc, udp, app, curl, html, io, ioHTTP, sse, ws } = features;
        if (!ipc) return;
        return new Promise((resolve, reject) => {
            try {
                const socketPath = this.ipcPath = '/tmp/my_unix_socket';  // This is the Unix socket file path

                // Create a client to connect to the server's Unix socket
                const client = this.ipcSocket = net.createConnection(socketPath, () => {
                    const address = client.address() as net.AddressInfo;
                    console.log(`${bright}${BGblue}${this.entity}' IPC Server${reset}: Client ${bright}${BGyellow}http://${address.address}:${address.port}${reset}: Connected`);
                    client.write('Hello from the client!');
                    resolve(client.address())
                });

                // Listen for data from the server
                client.on('data', (data) => {
                    const address = client.address() as net.AddressInfo;
                    console.log(`${bright}${BGblue}${this.entity}' IPC Server${reset}: Client ${bright}${BGyellow}http://${address.address}:${address.port}${reset} Sent Datagram:`, data);
                });
            } catch (error) {
                reject(error);
            }
        })
    }
    async activate(block: ENVIRONMENT_BLOCK) {
        const { definitions } = block;
        if (!definitions) return
        const { features } = definitions;
        if (!features) return
        const { ipc, udp, app, curl, html, io, ioHTTP, sse, ws } = features;
        if (!ipc) return;
        return new Promise((resolve, reject) => {
            try {
                const ipcFilePath = this.ipcPath = '/tmp/my_unix_socket';  // This is the Unix socket file path
                // Create a Unix socket server
                const server = this.ipc = net.createServer((ipcSocket) => {
                    this.ipcClientSockets.add(ipcSocket);
                    this.ipcClients.add(ipcSocket.address());
                    const address = ipcSocket.address() as net.AddressInfo;
                    console.log(`${bright}${BGblue}${this.entity}' IPC Server${reset}: Client ${bright}${BGyellow}http://${address.address}:${address.port}${reset}: Connected`);
                    // Respond to the client
                    ipcSocket.write('Hello from the server!');

                    ipcSocket.on('data', (data) => {
                        console.log(`${bright}${BGblue}${this.entity}' IPC Server${reset}: Client ${bright}${BGyellow}http://${address.address}:${address.port}${reset} Sent Datagram:`, data);
                    });
                });

                server.listen(ipcFilePath, () => {
                    console.log(`${bright}${BGblue}${this.entity}' IPC Server${reset}  Unix Socket ${bright}${BGyellow}http://${ipcFilePath}${reset}: Is listening`);
                    resolve("")
                });
            } catch (error) {
                reject(error);
            }
        })
    }
};
export class PhysicsLayer extends Layer implements iLayer {
    runSimulation() {
        if (!this.definitions?.properties?.nodes) throw Error("No Nodes");
        const nodes = this.definitions.properties.nodes
            //.filter(node => node?.attributes?.position)
            .map(node => {
                return node[0]
            });
        if (!this.definitions?.properties?.links) throw Error("No Nodes");
        const links = this.definitions.properties.links
            .filter(([source, target]) => nodes.includes(source) && nodes.includes(target))
            .map(([source, target]) => {
                return { source, target }
            });

        const simulation = d3.forceSimulation(nodes)
            .force("charge", d3.forceManyBody())
            .force("link", d3.forceLink(links))
            .force("center", d3.forceCenter());

        simulation.on("tick", () => {
            process.stdout.write(".");
        });
        simulation.on("end", () => {
            console.log(nodes)
            process.stdout.write(".");
        });
    }

    constructor() {
        super();
        this.runSimulation()
    }
}