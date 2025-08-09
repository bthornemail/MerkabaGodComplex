import MerkleTree from "merkletreejs";

export default async function handleAssertion({tree,assertionPackage}:{tree: MerkleTree,assertionPackage: any}) {
	const attestationPackage = window.localStorage.getItem("attestationPackage");
	if(!attestationPackage) throw new Error("No asvalble attestationPackage");
	function verifyAssertion(assertion: any, attestation: any, merklePath: any) {
		return merklePath.every((node:any) =>
			node.attestationStatus === 'verified' &&
			tree.verify(node.merkleProof, assertion.signature,tree.getRoot())
		);
	}
	verifyAssertion(assertionPackage.assertion,JSON.parse(attestationPackage),assertionPackage.merklePath)
}