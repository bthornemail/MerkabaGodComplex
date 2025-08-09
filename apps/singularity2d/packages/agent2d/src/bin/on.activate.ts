import base64url from "base64url";

export default async function onActivate({extendedKey,client,user,tree,graph,_user}: any){
	try {
		const targetNode = graph.graphData().nodes.find((n: any) => n.extendedKey === extendedKey);

		// Validate target node
		if (!targetNode) {
			throw new Error("Target node not found. Please enter a valid extended key.");
		}

		// Get assertion challenge
		const challengeResponse = await client.publish(
			`${targetNode.host}/assertion`,
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
			merklePath: graph.findPath(user.extendedKey, extendedKey),
			challenge: challenge,
			signature: _user.signMessageSync(challenge)
		};

		// Update graph state
		graph.graphData({
			nodes: graph.graphData().nodes.map((n: any) =>
				n.extendedKey === extendedKey ?
					{ ...n, assertion: assertionPackage } :
					n
			)
		});

		// Transmit through graph protocol
		await client.publish(
			`${targetNode.host}/verify`,
			JSON.stringify(assertionPackage) // Convert object to string
		);

	} catch (err: any) {
		console.error('Graph-based activation failed:', err);
		alert(err.message); // Show error to the user
	}
}