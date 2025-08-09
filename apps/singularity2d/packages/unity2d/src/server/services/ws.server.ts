
import { WebSocketServer } from 'ws';
// Create a WebSocket server on port 3002
const wss = new WebSocketServer({ port: 3002 });

// Listen for connection events
wss.on('connection', (ws) => {
    console.log('Client connected');

    // Listen for messages from the client
    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);

        // Echo the message back to the client
        ws.send(`Echo: ${message}`);
    });

    // Handle connection close events
    ws.on('close', () => {
        console.log('Client disconnected');
    });

    // Handle errors
    ws.on('error', console.error);
});

console.log('WebSocket server is running on ws://localhost:3002');
export default wss