import { WebSocketServer, WebSocket } from 'ws';
import { createServer, ServerResponse } from 'http';
import broadcastGraphUpdate from './broadcast.graph.update.js';
import handlePeerDiscovery from './handle.peer.discovery.js';
import handleWebAuthnRegistration from './handle.web.authn.registration.js';
import ngrok from 'ngrok';
import { MqttClient } from 'mqtt';
import dgram from 'dgram';
import { IncomingMessage } from 'http';
export async function communicationServer({ challenges, mqttClient, publicEndpoints, sseClients, udpServer, withNgrok }: {
    challenges: Map<string, Buffer>,
    mqttClient: MqttClient,
    sseClients: Set<ServerResponse>,
    udpServer: dgram.Socket,
    publicEndpoints: {
        ws: string,
        sse: string
    },
    withNgrok?: boolean
}) {
    // Store connected peers and their IDs
    const peers: Map<string, WebSocket> = new Map();
    // Async Generator to stream peer updates
    async function* peerStream() {
        let previousState = "";
        while (true) {
            const peerList = JSON.stringify(Array.from(peers.keys()));

            if (peerList !== previousState) {  // Only send when data changes
                previousState = peerList;
                yield `data: ${peerList}\n\n`;
            }

            await new Promise((resolve) => setTimeout(resolve, 100)); // Short delay to avoid blocking
        }
    }
    // Create HTTP server for WebSocket and SSE
    const httpServer = createServer();
    const wsServer = new WebSocketServer({ server: httpServer });

    // SSE (Server-Sent Events) setup for real-time updates
    // const sseClients = new Set<ServerResponse>();
    const sseServer = createServer(async (req: IncomingMessage, res: ServerResponse) => {
        switch (req.url) {
            case "/peers":
                res.writeHead(200, {
                    "Content-Type": "text/event-stream",
                    "Cache-Control": "no-cache",
                    "Connection": "keep-alive",
                });

                for await (const update of peerStream()) {
                    res.write(update);
                }
                break;
            case "add":
                res.writeHead(200, {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive'
                });
                const sendPeers = () => {
                    const peerList = Array.from(peers.keys());
                    res.write(JSON.stringify({ peers: peerList }));
                }
                sendPeers()
                const interval = setInterval(sendPeers, 5000);
                req.on('close', () => clearInterval(interval));
                sseClients.add(res);
                req.on('close', () => sseClients.delete(res));
                break;
            default:
                sseClients.add(res);
                res.writeHead(404);
                res.end();
                break;
        }
    });
    // WebSocket message handlers
    wsServer.on('connection', (ws) => {
        logger('New connection', ws.url);

        // Register the peer with a unique ID
        const peerId = `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        peers.set(peerId, ws);
        // Notify the peer of its ID
        ws.send(JSON.stringify({ type: 'welcome', peerId, url: ws.url }));

        // Broadcast the list of peers to everyone
        const broadcastPeers = () => {
            const peerList = Array.from(peers.keys());
            peers.forEach((peer) => {
                peer.send(JSON.stringify({ type: 'peers', peerList }));
            });
        };

        broadcastPeers();

        ws.on('message', (data) => {
            const message = JSON.parse(data.toString());
            logger(`Message from ${peerId}:`, message.toString());
            switch (message.type) {
                case 'webauthn-register':
                    handleWebAuthnRegistration(ws, message, { challenges });
                    break;
                case 'graph-update':
                    broadcastGraphUpdate(message.payload, { mqttClient, sseClients });
                    break;
                case 'peer-discovery':
                    handlePeerDiscovery(ws, message);
                    break;
                case 'edge-creation':
                    // TODO: Implement edge validation logic
                    // if(vault.verifyEdge(message.payload)) {
                    //     broadcastGraphUpdate(message.payload);
                    // }
                    break;
            }
        });
        // Remove peer on disconnection
        ws.on('close', () => {
            peers.delete(peerId);
            logger(`Peer ${peerId} disconnected`);
            broadcastPeers();
        });
    });


    // // Track public endpoints for WebSocket and SSE
    // let publicEndpoints = {
    //     ws: 'ws://localhost:3000',
    //     sse: 'http://localhost:3001'
    // };

    // Start HTTP server with Ngrok tunneling
    httpServer.listen(3000, async () => {
        logger('WS server on 3000');
        try {
            if (!withNgrok) throw new Error("withNgrok not set");

            // Tunnel WebSocket server
            const wsUrl = await ngrok.connect({
                addr: 3000,
                authtoken: '7pokcWyw8pGbxw6daKiYE_3xPiaTA2qpLnDhtLooBk1',
                proto: 'http'
            });
            publicEndpoints.ws = wsUrl.replace('http', 'ws');

            // Tunnel SSE server
            const sseUrl = await ngrok.connect({
                addr: 3001,
                authtoken: '7pokcWyw8pGbxw6daKiYE_3xPiaTA2qpLnDhtLooBk1',
                proto: 'http'
            });
            publicEndpoints.sse = sseUrl;

            logger(`Public endpoints:
        WS: ${publicEndpoints.ws}
        SSE: ${publicEndpoints.sse}`);
            // Update UDP discovery responses with public endpoints
            udpServer.on('message', (msg: Buffer, rinfo: dgram.RemoteInfo) => {
                udpServer.send(JSON.stringify({
                    type: 'discovery-response',
                    endpoints: publicEndpoints
                }), rinfo.port, rinfo.address);
            });
        } catch (err: any) {
            console.error('Ngrok tunnel failed:', err.message);
        }
    });

    // Start SSE server
    sseServer.listen(3001, () => logger('SSE server on http://localhost:3001'));
}