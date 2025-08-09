import createNetSocket from "./create.net.socket.js";
import { WebSocket} from 'ws';
/**
 * Handles peer discovery by creating a socket connection and notifying the client.
 * @param {WebSocket} ws - The WebSocket connection to send the response to.
 * @param {any} message - The incoming message containing peer details (extendedKey, root, graphData, signature).
 */
export default async function handlePeerDiscovery(ws: WebSocket, message: any) {
    const socket = await createNetSocket([
        message.extendedKey,
        message.root,
        message.graphData,
        message.signature
    ]);
    socket.on('connect', () => {
        ws.send(JSON.stringify({
            type: 'peer-discovered',
            endpoint: socket.address()
        }));
    });
}