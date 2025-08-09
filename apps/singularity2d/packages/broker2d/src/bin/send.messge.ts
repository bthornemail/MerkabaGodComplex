import { logger } from '../app';
export default async function sendMessage(sendChannel?: RTCDataChannel){
    if (sendChannel && sendChannel.readyState === 'open') {
        const message = 'Hello, WebRTC!';
        sendChannel.send(message);
        logger(`Sent: ${message}`);
    } else {
        logger('Send channel is not open');
    }
}