import { createServer, IncomingMessage, ServerResponse } from "node:http";
import ngrok from 'ngrok';

export default function logger(withNgrok?: boolean) {
    // Store connected peers and their IDs
    const peers: Map<string, WebSocket> = new Map();
    const sseClients = new Set<ServerResponse>();
    // const publicEndpoints: {
    //     ws: string,
    //     sse: string
    // } = {
    //     ws: "ws://127.0.0.0.1:30000",
    //     sse: "http://127.0.0.0.1:3000"
    // }
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
    // Start HTTP server with Ngrok tunneling
    // const httpServer = createServer();
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

    //         // // Update UDP discovery responses with public endpoints
    //         // udpServer.on('message', (msg, rinfo) => {
    //         //     udpServer.send(JSON.stringify({
    //         //         type: 'discovery-response',
    //         //         endpoints: publicEndpoints
    //         //     }), rinfo.port, rinfo.address);
    //         // });

    //     } catch (err) {
    //         console.error('Ngrok tunnel failed:', err);
    //     }
    // });

    // Start SSE server
    sseServer.listen(3001, async () => {
        console.log('SSE server on 3001')
        if (withNgrok) {
            // Tunnel SSE server
            const sseUrl = await ngrok.connect({
                addr: 3001,
                authtoken: '7pokcWyw8pGbxw6daKiYE_3xPiaTA2qpLnDhtLooBk1',
                proto: 'http'
            });
        }
    });

}