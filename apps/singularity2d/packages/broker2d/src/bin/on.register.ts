import base64url from "base64url";

// import base64url from 'https://cdn.jsdelivr.net/npm/base64url@3.0.1/+esm'
export default async function onRegister({extendedKey,graph,client,tree,user,_user}: any){
	try {
		const targetNode = graph.graphData().nodes.find((n: any) => n.extendedKey === extendedKey);

		// Validate target node
		if (!targetNode) {
			throw new Error("Target node not found. Please enter a valid extended key.");
		}

		// Get challenge from target node
		const challengeResponse = await client.publish(
			`${targetNode.host}/challenge`,
			JSON.stringify({
				extendedKey: user.extendedKey,
				merkleRoot: tree.getRoot().toString('hex')
			})
		);

		// Ensure challenge is defined
		const challenge = challengeResponse.challenge;
		if (!challenge) {
			throw new Error("Challenge is undefined. Please check the server response.");
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
			throw new Error("Credential or id((or is it rawId) is undefined. WebAuthn registration failed.");
		}

		// Prepare attestation package
		const merkleProof = tree.getProof(extendedKey);
		const attestationPackage = {
			type: 'webauthn_attestation',
			credential,
			merkleProof,
			challenge: challenge,
			signature: _user.signMessageSync(challenge)
		};

		// Update local graph
		graph.graphData({
			nodes: graph.graphData().nodes.map((n: any) =>
				n.extendedKey === extendedKey ?
					{ ...n, attestation: attestationPackage } :
					n
			)
		});

		// Sync with remote graph
		await client.publish(
			`${targetNode.host}/attestation`,
			JSON.stringify(attestationPackage) // Convert object to string
		);

	} catch (err: any) {
		console.error('Graph-based registration failed:', err);
		alert(err.message); // Show error to the user
	}
}