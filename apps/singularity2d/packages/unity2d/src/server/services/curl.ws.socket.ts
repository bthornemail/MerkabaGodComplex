/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable no-console */
import __get_dirname from '../bin/commands/get.dir.name'
import { createServer, IncomingMessage } from 'node:http'
import * as readline from 'node:readline';

import WebSocket, { createWebSocketStream } from 'ws';

const ws = new WebSocket('ws://127.0.0.1:3002');
// const ws = new WebSocket('wss://websocket-echo.com/');

const duplex = createWebSocketStream(ws, { encoding: 'utf8' });

duplex.on('error', console.error);

duplex.pipe(process.stdout);
process.stdin.pipe(duplex);

export default class CurlInterface {
    name: string
    port: number
    buf0: Buffer
    rl?: readline.Interface
    server: any
    constructor({ port }: any = { port: 3020 }) {
        this.name = 'curl-node'
        this.port = port
        this.buf0 = Buffer.from([0])
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
                console.log(req.headers['user-agent']);
                var iv = setInterval(() => {
                    res.write(this.buf0)
                }, 100)
                rl.prompt()

                rl.on('line', (line: string) => {
                    // res.write(`server says: ${line}\n`)
                    // console.log(`client says: ${line}`)
                    // rl.write(`server says: ${line}\n`)
                    duplex.write(`server says: ${line}\n`)
                    rl.prompt()
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

(async () => {
    let ci = new CurlInterface();
    // console.log(ci.name)
})()