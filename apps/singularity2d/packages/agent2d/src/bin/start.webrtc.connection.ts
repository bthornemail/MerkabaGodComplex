import { MqttClient } from "mqtt/*";
import { logger } from '../app';

export default async function startWebRTCConnection({client,sendChannel,localConnection,receiveChannel}:{receiveChannel?: RTCDataChannel,client: MqttClient,sendChannel?: RTCDataChannel,localConnection?:RTCPeerConnection} ){
    logger('Starting WebRTC connection...');
    // Create local peer connection with STUN server
    localConnection = new RTCPeerConnection({
        iceServers: [
            { urls: 'stun:127.0.0.1:3478' }, // STUN
            {
                urls: 'turn:127.0.0.1:3478', // TURN
                username: 'webrtc',
                credential: 'securepassword'
            }
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
    sendChannel.onopen = () => logger('Send channel is open');
    sendChannel.onclose = () => logger('Send channel is closed');
    sendChannel.onerror = (err:any) => {throw new Error(err)};
    ;

    // Handle incoming data channel
    localConnection.ondatachannel = (event) => {
        receiveChannel = event.channel;
        receiveChannel.onmessage = (event) => logger(`Received: ${event.data}`);
        receiveChannel.onopen = () => logger('Receive channel is open');
        receiveChannel.onclose = () => logger('Receive channel is closed');
    };

    // Create an offer and send it via MQTT
    const offer = await localConnection.createOffer();
    await localConnection.setLocalDescription(offer);
    client.publish('webrtc/offer', JSON.stringify(offer));
    logger('Offer sent');
    return localConnection;
};