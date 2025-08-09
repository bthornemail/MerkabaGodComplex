import { logger } from "../app";

export default async function handleAnswer(answer: RTCSessionDescriptionInit,{localConnection}:{localConnection:RTCPeerConnection}) {
    logger('Answer received');
    await localConnection.setRemoteDescription(answer);
}