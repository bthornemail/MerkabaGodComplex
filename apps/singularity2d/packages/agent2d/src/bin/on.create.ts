import { ethers } from "ethers";

async function getData(url: string) {
	try {
	  const response = await fetch(url,{
        headers: {
          "Content-Type": "text/plain",
        }});
	  if (!response.ok) {
		throw new Error(`Response status: ${response.status}`);
	  }

	  const json = await response.text();
	//   console.log(json);
	  return json;
	//   const json = await response.json();
	//   console.log(json);
	//   return json;
	} catch (error: any) {
	  console.error(error.message);
	}
  }
  export function addOption(extendedKey: string){
	  const extendedKeyInput = document.querySelector("#key") as HTMLSelectElement;
	  const optionElement = document.createElement("option") as HTMLOptionElement;
	  optionElement.value = extendedKey;
	  optionElement.textContent = extendedKey;
	  extendedKeyInput.append(optionElement);
  }

export default async function onCreate({graph,host,user,tree,_user,_host}: any){
	const graphData = graph.graphData();
	const newWallet = user.deriveChild(graphData.nodes.length);
	const extendedKey = newWallet.extendedKey;
	const address = newWallet.address;
	const leaf = tree.bufferify(extendedKey);
	const hash = leaf.toString("hex");
	const signature = _user.signMessageSync(hash);
	const w = _user.signingKey;
	const x = _host.publicKey;
	const y = w.computeSharedSecret(x);
	const z = ethers.id(y);
	addOption(extendedKey)
	// Add new node to graph
	graph.graphData({
		nodes: [
			Object.assign({ color: "white" }, { org: await getData("src/docs/template.org")},{ extendedKey }, {
				credentialOptions: {
					challenge: new TextEncoder().encode(z),
					rp: { id: "localhost", name: extendedKey },
					user: {
						id: new TextEncoder().encode(address),
						name: extendedKey,
						displayName: address
					},
					pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -8 }, { type: "public-key", alg: -257 }],
					authenticatorSelection: {
						authenticatorAttachment: "cross-platform",
						requireResidentKey: true,
						residentKey: "required",
					},
					attestation: "none"
				}
			}),
			...graphData.nodes
		],
		links: [
			{ source: user.extendedKey, target: newWallet.extendedKey },
			...graphData.links
		]
	});
}