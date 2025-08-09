import WebSocket, { WebSocketServer } from 'ws';
import dgram from 'dgram';
import quic from 'node-quic'
import { Socket } from 'node:net';
export type BROADCAST_MESSAGE = { type: string } & Record<string, any>
export default class Relay {
  constructor(options: WebSocket.ServerOptions = { port: 8080 }, broadcast: (...params: any[]) => BROADCAST_MESSAGE) {
    const wss = new WebSocketServer(options);
    const {
      host,
      port,
      // backlog,
      // server,
      // verifyClient,
      // handleProtocols,
      // path,
      // noServer,
      // clientTracking,
      // perMessageDeflate,
      // maxPayload,
      // skipUTF8Validation,
      // WebSocket,
    } = options;
    // const { address, family, port } = wss.address() as AddressInfo
    console.log(`Relay server running on ws://${host}:${port}`);

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
      // // Broadcast message of peers to everyone
      // const broadcastMessage = (peerId, message: string) => {
      //   const peerList = Array.from(peers.entries());
      //   peers.forEach((peer,id) => {
      //     if(id !== peerId) peer.send(JSON.stringify(broadcast()));
      //   });
      // };

      // broadcastPeers();

      // // Handle messages from peers
      socket.on('message', (message) => {
          console.log(`Message from ${peerId}:`, message.toString());
          // broadcastMessage(peerId,message.toString())
        peers.forEach((peer) => {
          peer.send(JSON.stringify(broadcast()));
        });
      });

      // Remove peer on disconnection
      socket.on('close', () => {
        peers.delete(peerId);
        console.log(`Peer ${peerId} disconnected`);
        broadcastPeers();
      });
    });

  }
}

function getRandomPort(min: number = 30000, max: number = 39999) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export async function discoverySocket() {
  // UDP discovery server for peer-to-peer communication
  const udpServer: dgram.Socket = dgram.createSocket('udp4');
  udpServer.bind(3702, () => console.log('UDP discovery on 3702'));
  udpServer.on('message', (msg, rinfo) => {
    const port = getRandomPort();
    const address = "0.0.0.0";
    const data = { h: "h" }
    quic.listen(port, address)
      .then(() => {
        console.log("Listdning");
      })               // called once server starts listening

      .onError((error: any) => {
        console.log(error)
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
          console.log(data);
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

      .then(() => { console.log("worked") })               // called after the stream is written

      .onError((error: any) => { console.log(error) })       // called on error. The error classes for `quic.send` are:
      //   * 'client stream error'

      .onData((data: any, buffer: Buffer) => {
        console.log(data);
        //        data += "bye";
        //        quic.send(port, address, data);
      }) // `data` is populated by whatever the receiving server deems

  });
  return udpServer;
}