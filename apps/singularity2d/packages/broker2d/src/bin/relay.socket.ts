// import WebSocket from 'ws';
// import { WebSocketServer } from 'ws';

import { logger } from "../app";

// Your peer ID and discovered peers
let myPeerId = '';
const discoveredPeers: Set<string> = new Set();

// Step 1: Connect to the relay server
const relay = new WebSocket('ws://localhost:33333');

// Handle relay messages
relay.onmessage = (event) => {
  const data = JSON.parse(event.data.toString());
  switch (data.type) {
    case 'welcome':
      // Receive assigned peer ID from the relay server
      myPeerId = data.peerId;
      logger(`My peer ID: ${myPeerId}`);
      break;
    case 'peers':
      // Update discovered peers
      data.peerList.forEach((peerId: string) => {
        if (peerId !== myPeerId && !discoveredPeers.has(peerId)) {
          discoveredPeers.add(peerId);
          connectToPeer(peerId);
        }
      });
      break;
    default:
      logger(`Message from peer: ${data.message}`);
      break;
  }
};

// Step 3: Connect directly to other peers
const connectToPeer = (peerId: string) => {
  logger(`Connecting to peer: ${peerId}`);
  // const peerSocket = new WebSocket(`ws://localhost:33333`);
  // peerSocket.onopen = () => {
    // logger(`Connected to peer ${peerId}`);
    // peerSocket.send(JSON.stringify({ source: myPeerId,target: peerId, type:"message",message: `Hello, peer ${peerId}` }));
  // };
};
