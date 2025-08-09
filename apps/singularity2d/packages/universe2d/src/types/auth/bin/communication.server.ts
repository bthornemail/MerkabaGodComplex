import { WebSocketServer } from 'ws';
import { createServer, ServerResponse } from 'http';
import broadcastGraphUpdate from './broadcast.graph.update.js';
import handlePeerDiscovery from './handle.peer.discovery.js';
import handleWebAuthnRegistration from './handle.web.authn.registration.js';
import ngrok from 'ngrok';
import { MqttClient } from 'mqtt';
import dgram from 'dgram';
export async function communicationServer({ challenges, mqttClient, publicEndpoints,sseClients,udpServer,withNgrok }: {
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
    // Create HTTP server for WebSocket and SSE
    const httpServer = createServer();
    const wsServer = new WebSocketServer({ server: httpServer });

    // SSE (Server-Sent Events) setup for real-time updates
    // const sseClients = new Set<ServerResponse>();
    const sseServer = createServer((req, res) => {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });
        sseClients.add(res);
        req.on('close', () => sseClients.delete(res));
    });
    // WebSocket message handlers
    wsServer.on('connection', (ws) => {
        ws.on('message', (data) => {
            const message = JSON.parse(data.toString());
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
    });


    // // Track public endpoints for WebSocket and SSE
    // let publicEndpoints = {
    //     ws: 'ws://localhost:3000',
    //     sse: 'http://localhost:3001'
    // };

    // Start HTTP server with Ngrok tunneling
    httpServer.listen(3000, async () => {
        console.log('WS server on 3000');
        try {
            if(!withNgrok) throw new Error("withNgrok not set");
            
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

            console.log(`Public endpoints:
        WS: ${publicEndpoints.ws}
        SSE: ${publicEndpoints.sse}`);
            // Update UDP discovery responses with public endpoints
            udpServer.on('message', (msg: Buffer, rinfo:dgram.RemoteInfo) => {
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
    sseServer.listen(3001, () => console.log('SSE server on http://localhost:3001'));

}