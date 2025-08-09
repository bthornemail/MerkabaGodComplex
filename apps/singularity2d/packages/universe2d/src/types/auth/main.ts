import { WebSocket, WebSocketServer } from 'ws';
import { createServer, ServerResponse } from 'http';
import { randomBytes } from 'crypto';
import base64url from 'base64url';
import mqtt from "mqtt";
import createNetSocket from '../../bin/create.net.socket.js'; // From <source_id data="create.socket.ts" />
import ngrok from 'ngrok';
import dgram from 'dgram';
import { discoverySocket } from './bin/discovery.server.js';
import { communicationServer } from './bin/communication.server.js';
// Store WebAuthn challenges in-memory (replace with a database in production)
const challenges = new Map<string, Buffer>();

// SSE (Server-Sent Events) setup for real-time updates
const sseClients = new Set<ServerResponse>();
// MQTT client for publishing graph updates
const mqttClient = mqtt.connect("ws://localhost:3883");

// // Track public endpoints for WebSocket and SSE
let publicEndpoints = {
    ws: 'ws://localhost:3000',
    sse: 'http://localhost:3001'
};
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
    const webServer = await communicationServer({challenges,mqttClient,sseClients,udpServer,publicEndpoints});
    const socket = new WebSocket("ws://localhost:3000");
})();
(async()=>{
    const socket = new WebSocket("ws://localhost:3000");
    socket.once("open",()=>{
        socket.send(JSON.stringify({type:"webauthn-register",challenges}))
    });
    socket.on("message",(message)=>{
        const data = JSON.parse(message.toString());
        switch (data.type) {
            case "webauthn-options":
                const options = data.options;
                // socket.send(JSON.stringify({type:"webauthn-register",challenges}))
                break;
        
            default:
                break;
        }
        // socket.close()
    })
})();