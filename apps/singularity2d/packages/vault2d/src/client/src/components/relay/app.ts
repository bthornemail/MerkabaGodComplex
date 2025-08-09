const logsElement = document.getElementById('logs') as HTMLPreElement;
const startButton = document.getElementById('start') as HTMLButtonElement;
const sendButton = document.getElementById('send') as HTMLButtonElement;

let localConnection: RTCPeerConnection;
let remoteConnection: RTCPeerConnection;
let sendChannel: RTCDataChannel;
let receiveChannel: RTCDataChannel;

function log(message: string) {
    logsElement.textContent += message + '\n';
}

startButton.addEventListener('click', async () => {
    log('Starting WebRTC connection...');

    // Create local and remote peer connections
    localConnection = new RTCPeerConnection();
    remoteConnection = new RTCPeerConnection();

    // Set up ICE candidates exchange
    localConnection.onicecandidate = (event) => {
        if (event.candidate) {
            remoteConnection.addIceCandidate(event.candidate).catch(log);
        }
    };

    remoteConnection.onicecandidate = (event) => {
        if (event.candidate) {
            localConnection.addIceCandidate(event.candidate).catch(log);
        }
    };

    // Create a data channel on the local connection
    sendChannel = localConnection.createDataChannel('sendChannel');
    sendChannel.onopen = () => log('Send channel is open');
    sendChannel.onclose = () => log('Send channel is closed');

    // Set up the remote connection to receive the data channel
    remoteConnection.ondatachannel = (event) => {
        receiveChannel = event.channel;
        receiveChannel.onmessage = (event) => log(`Received: ${event.data}`);
        receiveChannel.onopen = () => log('Receive channel is open');
        receiveChannel.onclose = () => log('Receive channel is closed');
    };

    // Create an offer and set it as the local description
    const offer = await localConnection.createOffer();
    await localConnection.setLocalDescription(offer);
    log('Local description set');

    // Set the remote description and create an answer
    await remoteConnection.setRemoteDescription(offer);
    const answer = await remoteConnection.createAnswer();
    await remoteConnection.setLocalDescription(answer);
    log('Remote description set');

    // Set the local description with the answer
    await localConnection.setRemoteDescription(answer);
    log('Connection established');
});

sendButton.addEventListener('click', () => {
    if (sendChannel && sendChannel.readyState === 'open') {
        const message = 'Hello, WebRTC!';
        sendChannel.send(message);
        log(`Sent: ${message}`);
    } else {
        log('Send channel is not open');
    }
});
