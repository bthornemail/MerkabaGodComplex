/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable no-console */
// import * as vm from 'node:vm'
// import path from 'node:path'
// import fs, { readFileSync, writeFileSync } from 'node:fs'
import __get_dirname from '../../utils/__dirname.js'
import { Duplex, Readable, Transform, Writable } from 'node:stream'
// import assert from 'node:assert'
// import { createContext, runInContext } from 'node:vm'
// import { pipeline } from 'node:stream/promises'
// import { stdout } from 'node:process'
import { DAGCBOR, dagCbor } from '@helia/dag-cbor'
import { MemoryBlockstore } from 'blockstore-core'
import { Blocks } from 'helia'
import { createServer, IncomingMessage, RequestListener, ServerResponse } from 'node:http'
import readline from 'node:readline';
import { stdin, stdout } from 'node:process'
import { clearInterval, setInterval } from 'node:timers'
import { pipeline } from 'node:stream/promises'

import WebSocket, { createWebSocketStream } from 'ws';

const ws = new WebSocket('wss://websocket-echo.com/');

const duplex = createWebSocketStream(ws, { encoding: 'utf8' });

duplex.on('error', console.error);

duplex.pipe(process.stdout);
process.stdin.pipe(duplex);

export default class CurlInterface {
    private dag: DAGCBOR
    name: string
    context?: any
    store: Blocks
    data: any[] = []
    index: any
    indexLength: any = 0
    buf0: Buffer
    port: number
    rl?: readline.Interface
    server: any
    constructor({ port, blockstore }: any = { port: 30000, blockstore: new MemoryBlockstore() }) {
        this.name = 'curl-node'
        this.dag = dagCbor({ blockstore: blockstore })
        this.store = blockstore
        this.buf0 = Buffer.from([0])
        this.port = port
        const server = this.server = createServer((req: IncomingMessage, res: any/*ServerResponse*/) => {
            try {
                res.setHeader('content-type', 'multipart/octet-stream')
                res.write('Welcome to the Fun House\r\n')
                const rl = this.rl = readline.createInterface({
                    prompt: 'curl repl> '
                    , input: req
                    , output: res
                    , terminal: true
                })
                // log
                console.log(req.headers['user-agent'])

                // hack to thread stdin and stdout
                // simultaneously in curl's single thread
                var iv = setInterval(() => {
                    res.write(this.buf0)
                }, 100)
                rl.prompt()

                rl.on('line', (line: string) => {
                    if (line.trim().startsWith('./')) {
                        console.log(`Received command: ${line}`);
                        console.log('compleye')
                        const completions = '.help .error .exit .quit .q'.split(' ');
                        const hits = completions.filter((c) => c.startsWith(line));
                        // Show all completions if none found;
                        rl.write([hits.length ? hits : completions, line].join("\n") + "\n")
                        return rl.prompt()
                    }
                    if (line.trim().startsWith('#/')) {
                        console.log(`Received command: ${line}`);
                        console.log('compleye')
                        const completions = '.help .error .exit .quit .q'.split(' ');
                        const hits = completions.filter((c) => c.startsWith(line));
                        // Show all completions if none found;
                        rl.write([hits.length ? hits : completions, line].join("\n") + "\n")
                        return rl.prompt()
                    }
                    if (!line.trim().startsWith('.')) {
                        rl.write(`server says: ${line}\n`)
                        rl.prompt()
                    }
                });
                res.on('end', function () {
                    clearInterval(iv)
                })
                res.on('error', () => {
                    console.log('closed')
                })
            } catch (error) {
                console.log(error)
            }
        })
        try {
            server.listen(this.port, () => {
                console.log(`To connect: $ curl - sSNT.localhost: ${this.port}`)
            })
        } catch (error: any) {
            console.log(error)
        }
    }
}
