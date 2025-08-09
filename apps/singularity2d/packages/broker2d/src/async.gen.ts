import { createServer, IncomingMessage, ServerResponse } from "http";
import { Server,WebSocket } from "ws";
import { logger } from "./app";

const peers = new Map<string, WebSocket>();

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

// SSE Server
const sseServer = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    if (req.url === "/peers") {
        res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        });

        for await (const update of peerStream()) {
            res.write(update);
        }
    } else {
        res.writeHead(404);
        res.end();
    }
});

sseServer.listen(5001, () => logger("SSE Server running on port 5001"));

const wss = new Server({ port: 5002 });

// WebSocket Server to manage peer connections
wss.on("connection", (ws) => {
    const peerId = `peer-${Math.random().toString(36).substr(2, 9)}`;
    peers.set(peerId, ws);

    logger(`New peer connected: ${peerId}`);

    ws.on("close", () => {
        peers.delete(peerId);
        logger(`Peer disconnected: ${peerId}`);
    });
});

logger("WebSocket Server running on port 5002");
