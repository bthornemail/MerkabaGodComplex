import base64url from 'base64url';
import { HDNodeWallet } from 'ethers';
import MerkleTree from 'merkletreejs';
import { MqttClient } from 'mqtt';
export default async function handleChallenge({challengeResponse,client,tree,signer}:{signer: HDNodeWallet,tree: MerkleTree,client: MqttClient,challengeResponse: any}) {
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
		// Create WebAuthn credential
		const credential = await navigator.credentials.create({
			publicKey: {
				challenge: base64url.toBuffer(challenge),
				rp: { id: targetNode.host, name: targetNode.extendedKey },
				user: {
					id: new TextEncoder().encode(user.address),
					name: user.extendedKey,
					displayName: user.address
				},
				pubKeyCredParams: [{ type: "public-key", alg: -7 }]
			}
		});
		// Ensure credential and rawId are defined
		if (!credential || !credential.id) {
			throw new Error("Credential or id (maybe is rawId) is undefined. WebAuthn registration failed.");
		}
		window.localStorage.setItem("credential",JSON.stringify(credential));
		// Prepare attestation package
		const merkleProof = tree.getProof(user.extendedKey);
		window.localStorage.setItem("merkleProof",JSON.stringify(merkleProof));
		const attestationPackage = {
			type: 'webauthn_attestation',
			credential,
			merkleProof,
			challenge: challenge,
			signature: signer.signMessageSync(challenge)
		};
		
		window.localStorage.setItem("attestationPackage",JSON.stringify(attestationPackage));
		// // Update local graph
		// graph.graphData({
		// 	nodes: graph.graphData().nodes.map(n =>
		// 		n.extendedKey === user.extendedKey ?
		// 			{ ...n, attestation: attestationPackage } :
		// 			n
		// 	)
		// });
		await client.publishAsync(
			`webauthn/attestation/${targetNode.host}`,
			JSON.stringify(attestationPackage) // Convert object to string
		);
	} catch (err: any) {
		console.error('Graph-based registration failed:', err);
		alert(err.message); // Show error to the user
	}
};