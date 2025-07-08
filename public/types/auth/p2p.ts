import WebSocket from 'ws';
import { WebSocketServer } from 'ws';

// Your peer ID and discovered peers
let myPeerId = '';
const discoveredPeers: Set<string> = new Set();

// Step 1: Connect to the relay server
const relay = new WebSocket('ws://localhost:8080');

// Handle relay messages
relay.onmessage = (event: any) => {
  const data = JSON.parse(event.data);

  if (data.type === 'welcome') {
    // Receive assigned peer ID from the relay server
    myPeerId = data.peerId;
    console.log(`My peer ID: ${myPeerId}`);
  } else if (data.type === 'peers') {
    // Update discovered peers
    data.peerList.forEach((peerId: string) => {
      if (peerId !== myPeerId && !discoveredPeers.has(peerId)) {
        discoveredPeers.add(peerId);
        connectToPeer(peerId);
      }
    });
  }
};

// Step 2: Create a WebSocket server to accept direct peer connections
const peerServer = new WebSocketServer({ port: 8081 });
console.log('Peer server listening on ws://localhost:8081');

peerServer.on('connection', (socket) => {
  console.log('New direct peer connection established');

  socket.on('message', (message) => {
    console.log('Received from peer:', message.toString());
  });

  socket.send(JSON.stringify({ message: 'Hello from peer server!' }));
});

// Step 3: Connect directly to other peers
const connectToPeer = (peerId: string) => {
  console.log(`Connecting to peer: ${peerId}`);
  const peerSocket = new WebSocket(`ws://localhost:8081`);

  peerSocket.onopen = () => {
    console.log(`Connected to peer ${peerId}`);
    peerSocket.send(JSON.stringify({ message: `Hello, peer ${peerId}` }));
  };

  peerSocket.onmessage = (event: any) => {
    const data = JSON.parse(event.data);
    console.log(`Message from peer ${peerId}:`, data);
  };
};
