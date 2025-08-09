/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable no-console */
// import * as vm from 'node:vm'
// import path from 'node:path'
// import fs, { readFileSync, writeFileSync } from 'node:fs'
import WebSocket, { createWebSocketStream } from 'ws';

const ws = new WebSocket('wss://websocket-echo.com/');

const duplex = createWebSocketStream(ws, { encoding: 'utf8' });

duplex.on('error', console.error);

duplex.pipe(process.stdout);
process.stdin.pipe(duplex);
