import WebSocket, { WebSocketServer } from 'ws';
import { createServer, ServerResponse } from 'http';
import { randomBytes } from 'crypto';
import base64url from 'base64url';
import mqtt from "mqtt";
import ngrok from 'ngrok';
import dgram from 'dgram';
import { IncomingMessage } from 'http';
import { discoverySocket } from './src/bin/discovery.socket'
import { communicationServer } from './src/bin/communication.server';

// Create a client to interact with the router's UPnP service
// const client = upnp.createClient();

// Open a port (for example, opening port 12345 for incoming TCP traffic)

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
(async () => {
    const udpServer = await discoverySocket();
    const webServer = await communicationServer({ challenges, mqttClient, sseClients, udpServer, publicEndpoints, withNgrok: false });
    // Create a client to interact with the router's UPnP service
})();