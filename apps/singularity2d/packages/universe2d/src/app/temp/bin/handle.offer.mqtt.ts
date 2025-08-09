import { MqttClient } from "mqtt/*";
import { logger } from "../app";

export default async function handleOffer(offer: RTCSessionDescriptionInit,{client,receiveChannel}:{receiveChannel:RTCDataChannel,client: MqttClient}) {
    logger('Offer received');
    const remoteConnection = new RTCPeerConnection({
        iceServers: [
            { urls: 'stun:127.0.0.1:3478' }, // STUN
            {
                urls: 'turn:127.0.0.1:3478', // TURN
                username: 'webrtc',
                credential: 'securepassword'
            }
        ]
    });

    remoteConnection.onicecandidate = (event) => {
        if (event.candidate) {
            client.publish('webrtc/ice', JSON.stringify(event.candidate));
        }
    };

    remoteConnection.ondatachannel = (event) => {
        receiveChannel = event.channel;
        receiveChannel.onmessage = (event) => logger(`Received: ${event.data}`);
        receiveChannel.onopen = () => logger('Receive channel is open');
        receiveChannel.onclose = () => logger('Receive channel is closed');
    };

    await remoteConnection.setRemoteDescription(offer);
    const answer = await remoteConnection.createAnswer();
    await remoteConnection.setLocalDescription(answer);
    client.publish('webrtc/answer', JSON.stringify(answer));
    logger('Answer sent');
    return remoteConnection
}