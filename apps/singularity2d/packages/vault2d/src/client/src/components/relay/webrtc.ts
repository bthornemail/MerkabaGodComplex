import mqtt from 'mqtt';

const logsElement = document.getElementById('logs') as HTMLPreElement;
const startButton = document.getElementById('start') as HTMLButtonElement;
const sendButton = document.getElementById('send') as HTMLButtonElement;

let localConnection: RTCPeerConnection;
let sendChannel: RTCDataChannel;
let receiveChannel: RTCDataChannel;

// MQTT client
const client = mqtt.connect('mqtt://broker.hivemq.com'); // Replace with your MQTT broker URL

client.on('connect', () => {
    log('Connected to MQTT broker');
    client.subscribe('webrtc/offer', (err) => {
        if (!err) log('Subscribed to webrtc/offer');
    });
    client.subscribe('webrtc/answer', (err) => {
        if (!err) log('Subscribed to webrtc/answer');
    });
    client.subscribe('webrtc/ice', (err) => {
        if (!err) log('Subscribed to webrtc/ice');
    });
});

client.on('message', (topic, message) => {
    const data = JSON.parse(message.toString());
    if (topic === 'webrtc/offer') {
        handleOffer(data);
    } else if (topic === 'webrtc/answer') {
        handleAnswer(data);
    } else if (topic === 'webrtc/ice') {
        handleICECandidate(data);
    }
});

function log(message: string) {
    logsElement.textContent += message + '\n';
}

startButton.addEventListener('click', async () => {
    log('Starting WebRTC connection...');

    // Create local peer connection with STUN server
    localConnection = new RTCPeerConnection({
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' } // Google's public STUN server
        ]
    });

    // Set up ICE candidates
    localConnection.onicecandidate = (event) => {
        if (event.candidate) {
            client.publish('webrtc/ice', JSON.stringify(event.candidate));
        }
    };

    // Create a data channel
    sendChannel = localConnection.createDataChannel('sendChannel');
    sendChannel.onopen = () => log('Send channel is open');
    sendChannel.onclose = () => log('Send channel is closed');

    // Handle incoming data channel
    localConnection.ondatachannel = (event) => {
        receiveChannel = event.channel;
        receiveChannel.onmessage = (event) => log(`Received: ${event.data}`);
        receiveChannel.onopen = () => log('Receive channel is open');
        receiveChannel.onclose = () => log('Receive channel is closed');
    };

    // Create an offer and send it via MQTT
    const offer = await localConnection.createOffer();
    await localConnection.setLocalDescription(offer);
    client.publish('webrtc/offer', JSON.stringify(offer));
    log('Offer sent');
});

async function handleOffer(offer: RTCSessionDescriptionInit) {
    log('Offer received');
    const remoteConnection = new RTCPeerConnection({
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' } // Google's public STUN server
        ]
    });

    remoteConnection.onicecandidate = (event) => {
        if (event.candidate) {
            client.publish('webrtc/ice', JSON.stringify(event.candidate));
        }
    };

    remoteConnection.ondatachannel = (event) => {
        receiveChannel = event.channel;
        receiveChannel.onmessage = (event) => log(`Received: ${event.data}`);
        receiveChannel.onopen = () => log('Receive channel is open');
        receiveChannel.onclose = () => log('Receive channel is closed');
    };

    await remoteConnection.setRemoteDescription(offer);
    const answer = await remoteConnection.createAnswer();
    await remoteConnection.setLocalDescription(answer);
    client.publish('webrtc/answer', JSON.stringify(answer));
    log('Answer sent');
}

async function handleAnswer(answer: RTCSessionDescriptionInit) {
    log('Answer received');
    await localConnection.setRemoteDescription(answer);
}

function handleICECandidate(candidate: RTCIceCandidateInit) {
    log('ICE candidate received');
    const iceCandidate = new RTCIceCandidate(candidate);
    localConnection.addIceCandidate(iceCandidate).catch(log);
}

sendButton.addEventListener('click', () => {
    if (sendChannel && sendChannel.readyState === 'open') {
        const message = 'Hello, WebRTC!';
        sendChannel.send(message);
        log(`Sent: ${message}`);
    } else {
        log('Send channel is not open');
    }
});