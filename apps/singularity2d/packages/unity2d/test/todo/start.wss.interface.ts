/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable no-console */
// import * as vm from 'node:vm'
// import path from 'node:path'
// import fs, { readFileSync, writeFileSync } from 'node:fs'
import WebSocket, { createWebSocketStream } from 'ws';
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    ws.on('message', function message(data) {
        console.log('received: %s', data);
    });

    ws.send('something');
});
const ws = new WebSocket('ws://localhost:8080/');

const duplex = createWebSocketStream(ws, { encoding: 'utf8' });

duplex.on('error', console.error);

duplex.pipe(process.stdout);
process.stdin.pipe(duplex);

