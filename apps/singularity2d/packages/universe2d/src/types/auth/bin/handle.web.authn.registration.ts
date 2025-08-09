import { WebSocket} from 'ws';
import base64url from 'base64url';
import { randomBytes } from 'crypto';
/**
 * Handles WebAuthn registration by generating a challenge and sending registration options.
 * @param {WebSocket} ws - The WebSocket connection to send the response to.
 * @param {any} message - The incoming message containing registration details.
 */
export default async function handleWebAuthnRegistration(ws: WebSocket, message: any,{challenges}:{
    challenges:  Map<string, Buffer>
}) {
    console.log("Auth in progress")
    const challenge = randomBytes(32);
    challenges.set(challenge.toString('hex'), challenge);

    ws.send(JSON.stringify({
        type: 'webauthn-options',
        options: {
            challenge: base64url.encode(challenge),
            rp: { name: "Vault 2D" },
            user: {
                id: base64url.encode(randomBytes(16)),
                name: "contact@vault2d.com",
                displayName: "Admin User"
            },
            pubKeyCredParams: [
                { type: "public-key", alg: -7 }, // ES256
                { type: "public-key", alg: -257 } // RS256
            ],
            authenticatorSelection: {
                userVerification: "preferred",
                residentKey: "required"
            } as AuthenticatorSelectionCriteria
        }
    }));
}