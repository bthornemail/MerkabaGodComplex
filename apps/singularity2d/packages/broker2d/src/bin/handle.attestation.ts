import base64url from "base64url";
import { HDNodeWallet, ethers } from "ethers";
import {MerkleTree} from "merkletreejs";
import { MqttClient } from "mqtt";
import ForceGraph3D from '3d-force-graph';
import {MultiGraph} from "graphology";
export default async function handleAttestation({challengeResponse,client,tree,signer,graph}:{graph: any,signer: HDNodeWallet,tree: MerkleTree,client: MqttClient,challengeResponse: any}) {
	try {
		// Ensure challenge is defined
		const challenge = challengeResponse.challenge;
		const targetNode = challengeResponse.targetNode;
		const user = challengeResponse.user;
		if (!challenge) {
			throw new Error("Challenge is undefined. Please check the server response.");
		}
		if (!user) {
			throw new Error("User is undefined. Please check the server response.");
		}
		if (!targetNode) {
			throw new Error("Target Node is undefined. Please check the server response.");
		}
		if (!challenge) {
			throw new Error("Challenge is undefined. Please check the server response.");
		}


		const credential = window.localStorage.getItem("credential");
		if(!credential) throw new Error("No vial Credential");
		const merkleProof = window.localStorage.getItem("merkleProof");
		if(!merkleProof) throw new Error("No vial merkleProof");

		// Validation utilities
		function validateAttestation(credential: any, merkleProof: any, publicKey: string) {
			return ethers.verifyMessage(
				credential.response.clientDataJSON,
				merkleProof
			) === publicKey;
		}
		if(!validateAttestation(JSON.parse(credential),JSON.parse(merkleProof),signer.address)) throw new Error("Atttestnot valid");
		
		// Generate WebAuthn assertion
		const assertion = await navigator.credentials.get({
			publicKey: {
				challenge: base64url.toBuffer(challenge),
				rpId: targetNode.host,
				allowCredentials: [{
					type: "public-key",
					id: base64url.toBuffer(targetNode.attestation.credential.rawId),
					transports: ["internal"]
				}]
			}
		});
		// Prepare assertion package
		const assertionPackage = {
			type: 'webauthn_assertion',
			assertion,
			merklePath: graph.findPath(user.extendedKey, targetNode.extendedKey),
			challenge: challenge,
			signature: signer.signMessageSync(challenge)
		};

		// // Update graph state
		// graph.graphData({
		// 	nodes: graph.graphData().nodes.map(n =>
		// 		n.extendedKey === extendedKey ?
		// 			{ ...n, assertion: assertionPackage } :
		// 			n
		// 	)
		// });
		// Transmit through graph protocol
		await client.publishAsync(
			`webauthn/assertion/${targetNode.host}`,
			JSON.stringify(assertionPackage) // Convert object to string
		);
	} catch (error: any) {
        console.error(error)
	}
};