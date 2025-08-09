import dgram from 'dgram';
import quic from 'node-quic'
import { Socket } from 'node:net';
import { log } from './communication.server';

function getRandomPort(min: number = 30000, max: number = 39999) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
export async function discoverySocket() {
    // UDP discovery server for peer-to-peer communication
    const udpServer: dgram.Socket = dgram.createSocket('udp4');
    udpServer.bind(3702, () => log('UDP discovery on 3702'));
    udpServer.on('message', (msg, rinfo) => {
        const port = getRandomPort();
        const address = "0.0.0.0";
        const data = { h: "h" }
        quic.listen(port, address)
            .then(() => {
                log("Listdning");
            })               // called once server starts listening

            .onError((error: any) => {
                log(error)
            })       // called if there's an error with the listening.
            // There are three classes of error:
            //    * 'server error'
            //    * 'server session error'
            //    * 'server stream error'
            // An error will come out as an object with key
            // `class` containing one of the above. More information
            // will be in the error object.

            .onData(
                (data: any, stream: Socket, buffer: Buffer) => {
                    log(data);
                    stream.write("local data")
                }
            )                             // data here will be a stringified version of
        // whatever was sent using quic.send(), stream will have
        // two function properties: `write` and `end.`
        // Use stream.write(data) to return information to the
        // original sender. Note: stream.write will automatically
        // stringify any non-buffer data sent to it, but you will need
        // to parse your own data on the way out of `.onData` for
        // `quic.listen` and for `quic.send`.  Use `stream.end()`
        // if you don't need to send anything back. If you are working
        // with buffers directly and don't need anything stringified,
        // you can use the buffer argument.
            const proxy = "marketplace2d.com"

        udpServer.send(JSON.stringify({

            type: 'discovery-response',
            endpoints: {
                quic: `quic://${address}:${port}`,
                quicProxy: `quic://${proxy}:${port}`,
                ws: 'ws://localhost:3000',
                sse: 'http://localhost:3001'
            }
        }), rinfo.port, rinfo.address);
        quic.send(port, proxy, data)  // Send data to a listening server. `data` is automatically
            // stringified, but will need to be parsed manually on receive.

            .then(() => { log("worked") })               // called after the stream is written

            .onError((error: any) => { log(error) })       // called on error. The error classes for `quic.send` are:
            //   * 'client stream error'

            .onData((data: any, buffer: Buffer) => {
                log(data);
                //        data += "bye";
                //        quic.send(port, address, data);
            }) // `data` is populated by whatever the receiving server deems

    });
    return udpServer;
}