import dgram from 'dgram';
export async function discoverySocket() {
    // UDP discovery server for peer-to-peer communication
    const udpServer: dgram.Socket = dgram.createSocket('udp4');
    udpServer.bind(3702, () => console.log('UDP discovery on 3702'));
    udpServer.on('message', (msg, rinfo) => {
        udpServer.send(JSON.stringify({
            type: 'discovery-response',
            endpoints: {
                ws: 'ws://localhost:3000',
                sse: 'http://localhost:3001'
            }
        }), rinfo.port, rinfo.address);
    });
    return udpServer;
}