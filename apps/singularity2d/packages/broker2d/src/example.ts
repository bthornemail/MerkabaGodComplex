import { logger } from "./app";

const logsElement = document.getElementById('logs') as HTMLPreElement;
const startButton = document.getElementById('start') as HTMLButtonElement;
const sendButton = document.getElementById('send') as HTMLButtonElement;

let localConnection: RTCPeerConnection;
let remoteConnection: RTCPeerConnection;
let sendChannel: RTCDataChannel;
let receiveChannel: RTCDataChannel;

startButton.addEventListener('click', async () => {
    logger('Starting WebRTC connection...');

    // Create local and remote peer connections
    localConnection = new RTCPeerConnection();
    remoteConnection = new RTCPeerConnection();

    // Set up ICE candidates exchange
    localConnection.onicecandidate = (event) => {
        if (event.candidate) {
            remoteConnection.addIceCandidate(event.candidate).catch(logger);
        }
    };

    remoteConnection.onicecandidate = (event) => {
        if (event.candidate) {
            localConnection.addIceCandidate(event.candidate).catch(logger);
        }
    };

    // Create a data channel on the local connection
    sendChannel = localConnection.createDataChannel('sendChannel');
    sendChannel.onopen = () => logger('Send channel is open');
    sendChannel.onclose = () => logger('Send channel is closed');

    // Set up the remote connection to receive the data channel
    remoteConnection.ondatachannel = (event) => {
        receiveChannel = event.channel;
        receiveChannel.onmessage = (event) => logger(`Received: ${event.data}`);
        receiveChannel.onopen = () => logger('Receive channel is open');
        receiveChannel.onclose = () => logger('Receive channel is closed');
    };

    // Create an offer and set it as the local description
    const offer = await localConnection.createOffer();
    await localConnection.setLocalDescription(offer);
    logger('Local description set');

    // Set the remote description and create an answer
    await remoteConnection.setRemoteDescription(offer);
    const answer = await remoteConnection.createAnswer();
    await remoteConnection.setLocalDescription(answer);
    logger('Remote description set');

    // Set the local description with the answer
    await localConnection.setRemoteDescription(answer);
    logger('Connection established');
});

sendButton.addEventListener('click', () => {
    if (sendChannel && sendChannel.readyState === 'open') {
        const message = 'Hello, WebRTC!';
        sendChannel.send(message);
        logger(`Sent: ${message}`);
    } else {
        logger('Send channel is not open');
    }
});
