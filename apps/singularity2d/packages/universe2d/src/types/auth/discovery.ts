import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

console.log('Relay server running on ws://localhost:8080');

// Store connected peers and their IDs
const peers: Map<string, WebSocket> = new Map();

wss.on('connection', (socket) => {
  console.log('New connection');
  
  // Register the peer with a unique ID
  const peerId = `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  peers.set(peerId, socket);
  
  // Notify the peer of its ID
  socket.send(JSON.stringify({ type: 'welcome', peerId }));

  // Broadcast the list of peers to everyone
  const broadcastPeers = () => {
    const peerList = Array.from(peers.keys());
    peers.forEach((peer) => {
      peer.send(JSON.stringify({ type: 'peers', peerList }));
    });
  };

  broadcastPeers();

  // Handle messages from peers
  socket.on('message', (message) => {
    console.log(`Message from ${peerId}:`, message.toString());
  });

  // Remove peer on disconnection
  socket.on('close', () => {
    peers.delete(peerId);
    console.log(`Peer ${peerId} disconnected`);
    broadcastPeers();
  });
});
