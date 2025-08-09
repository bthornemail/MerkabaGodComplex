import { MqttClient } from "mqtt/*";
import { logger } from '../app';
import generateHMAC from "./generate.hmac";

export default async function startHMACWebRTCConnection({client,sendChannel,localConnection}:{client: MqttClient,sendChannel?: RTCDataChannel,localConnection?:RTCPeerConnection} ){
    const secret = 'marketplace2d.com'; // Shared secret from turnserver.conf
    const username = Math.floor(Date.now() / 1000).toString(); // Timestamp-based username
    const password = await generateHMAC(secret, username); // Generate HMAC password

    logger(`Generated TURN credentials: Username=${username}, Password=${password}`);

    const iceServers = [
      {
        urls: 'turn:marketplace2d.com:3478',
        username: username,
        credential: password,
      },
    ];

    const config = { iceServers };
    const peerConnection = new RTCPeerConnection(config);

    logger("WebRTC PeerConnection created.");

    // Log connection state changes
    peerConnection.addEventListener("connectionstatechange", () => {
      logger(`Connection state: ${peerConnection.connectionState}`);
    });

    // Handle ICE candidate gathering
    peerConnection.addEventListener("icecandidate", (event) => {
      if (event.candidate) {
        logger(`New ICE candidate: ${JSON.stringify(event.candidate)}`);
      } else {
        logger("ICE candidate gathering complete.");
      }
    });
    peerConnection.addEventListener("icecandidateerror",(err: any)=>{
      throw new Error(err);
    });

    // Add a data channel
    const dataChannel = peerConnection.createDataChannel("chat");
    dataChannel.addEventListener("open", () => logger("Data channel is open."));
    dataChannel.addEventListener("message", (event) => logger(`Received message: ${event.data}`));

    // Create an offer
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    logger("Offer created and set as local description.");

    // Simulate signaling (replace this with actual signaling logic)
    logger("Simulating signaling...");
    setTimeout(async () => {
      const remoteOffer = new RTCSessionDescription(offer); // Echo back the offer as the answer
      await peerConnection.setRemoteDescription(remoteOffer);
      logger("Remote description set.");
    }, 1000);
  };