import { logger } from "../app";

export default async function handleICECandidate(candidate: RTCIceCandidateInit,{localConnection}: any) {
    logger('ICE candidate received');
    const iceCandidate = new RTCIceCandidate(candidate);
    localConnection.addIceCandidate(iceCandidate).catch(logger);
}