import { WebSocketServer } from 'ws';
import { createServer, ServerResponse } from 'http';
import { randomBytes } from 'crypto';
import base64url from 'base64url';
import mqtt from "mqtt";
import createNetSocket from '../../bin/create.net.socket.js'; // From <source_id data="create.socket.ts" />
import ngrok from 'ngrok';
import dgram from 'dgram';
import { discoverySocket } from './bin/discovery.server.js';
import { communicationServer } from './bin/communication.server.js';

// Create HTTP server for WebSocket and SSE
// const httpServer = createServer();
// const wsServer = new WebSocketServer({ server: httpServer });

// Store WebAuthn challenges in-memory (replace with a database in production)
const challenges = new Map<string, Buffer>();

// SSE (Server-Sent Events) setup for real-time updates
const sseClients = new Set<ServerResponse>();
// const sseServer = createServer((req, res) => {
//     res.writeHead(200, {
//         'Content-Type': 'text/event-stream',
//         'Cache-Control': 'no-cache',
//         'Connection': 'keep-alive'
//     });
//     sseClients.add(res);
//     req.on('close', () => sseClients.delete(res));
// });

// MQTT client for publishing graph updates
const mqttClient = mqtt.connect("ws://localhost:3883");

// WebSocket message handlers
// wsServer.on('connection', (ws) => {
//     ws.on('message', (data) => {
//         const message = JSON.parse(data.toString());
//         switch (message.type) {
//             case 'webauthn-register':
//                 handleWebAuthnRegistration(ws, message);
//                 break;
//             case 'graph-update':
//                 broadcastGraphUpdate(message.payload);
//                 break;
//             case 'peer-discovery':
//                 handlePeerDiscovery(ws, message);
//                 break;
//             case 'edge-creation':
//                 // TODO: Implement edge validation logic
//                 // if(vault.verifyEdge(message.payload)) {
//                 //     broadcastGraphUpdate(message.payload);
//                 // }
//                 break;
//         }
//     });
// });

/**
 * Handles WebAuthn registration by generating a challenge and sending registration options.
 * @param {WebSocket} ws - The WebSocket connection to send the response to.
 * @param {any} message - The incoming message containing registration details.
 */
// async function handleWebAuthnRegistration(ws: WebSocket, message: any) {
//     const challenge = randomBytes(32);
//     challenges.set(challenge.toString('hex'), challenge);

//     ws.send(JSON.stringify({
//         type: 'webauthn-options',
//         options: {
//             challenge: base64url.default.encode(challenge),
//             rp: { name: "Your App Name" },
//             user: {
//                 id: base64url.default.encode(randomBytes(16)),
//                 name: "user@example.com",
//                 displayName: "User"
//             },
//             pubKeyCredParams: [
//                 { type: "public-key", alg: -7 }, // ES256
//                 { type: "public-key", alg: -257 } // RS256
//             ],
//             authenticatorSelection: {
//                 userVerification: "preferred",
//                 residentKey: "required"
//             } as AuthenticatorSelectionCriteria
//         }
//     }));
// }

/**
 * Handles peer discovery by creating a socket connection and notifying the client.
 * @param {WebSocket} ws - The WebSocket connection to send the response to.
 * @param {any} message - The incoming message containing peer details (extendedKey, root, graphData, signature).
 */
// async function handlePeerDiscovery(ws: WebSocket, message: any) {
//     const socket = await createNetSocket([
//         message.extendedKey,
//         message.root,
//         message.graphData,
//         message.signature
//     ]);
//     socket.on('connect', () => {
//         ws.send(JSON.stringify({
//             type: 'peer-discovered',
//             endpoint: socket.address()
//         }));
//     });
// }

/**
 * Broadcasts graph updates to all connected clients via MQTT and SSE.
 * @param {any} update - The graph update payload to broadcast.
 */
// function broadcastGraphUpdate(update: any) {
//     mqttClient.publish('graph/updates', JSON.stringify(update));
//     sseClients.forEach(client => {
//         client.write(`data: ${JSON.stringify(update)}\n\n`);
//     });
// }

// // Track public endpoints for WebSocket and SSE
// let publicEndpoints = {
//     ws: 'ws://localhost:3000',
//     sse: 'http://localhost:3001'
// };

// // Start HTTP server with Ngrok tunneling
// httpServer.listen(3000, async () => {
//     console.log('WS server on 3000');

//     try {
//         // Tunnel WebSocket server
//         const wsUrl = await ngrok.connect({
//             addr: 3000,
//             authtoken: '7pokcWyw8pGbxw6daKiYE_3xPiaTA2qpLnDhtLooBk1',
//             proto: 'http'
//         });
//         publicEndpoints.ws = wsUrl.replace('http', 'ws');

//         // Tunnel SSE server
//         const sseUrl = await ngrok.connect({
//             addr: 3001,
//             authtoken: '7pokcWyw8pGbxw6daKiYE_3xPiaTA2qpLnDhtLooBk1',
//             proto: 'http'
//         });
//         publicEndpoints.sse = sseUrl;

//         console.log(`Public endpoints:
//         WS: ${publicEndpoints.ws}
//         SSE: ${publicEndpoints.sse}`);

//         // Update UDP discovery responses with public endpoints
//         udpServer.on('message', (msg, rinfo) => {
//             udpServer.send(JSON.stringify({
//                 type: 'discovery-response',
//                 endpoints: publicEndpoints
//             }), rinfo.port, rinfo.address);
//         });

//     } catch (err) {
//         console.error('Ngrok tunnel failed:', err);
//     }
// });

// // Start SSE server
// sseServer.listen(3001, () => console.log('SSE server on 3001'));

// UDP discovery server for peer-to-peer communication
// const udpServer = dgram.createSocket('udp4');
// udpServer.bind(3702, () => console.log('UDP discovery on 3702'));
// udpServer.on('message', (msg, rinfo) => {
//     udpServer.send(JSON.stringify({
//         type: 'discovery-response',
//         endpoints: {
//             ws: 'ws://localhost:3000',
//             sse: 'http://localhost:3001'
//         }
//     }), rinfo.port, rinfo.address);
// });
(async()=>{
    const udpServer = await discoverySocket();
    const webServer = await communicationServer({challenges,mqttClient,sseClients,udpServer});
})();