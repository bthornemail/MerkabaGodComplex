import { HDNodeWallet } from 'ethers';
import getSocket from "./components/sync.socket";
import getForceGraph from "./components/force.graph";
import { BrowserMultiGraph } from "./components/multi.graph";
import { WindowWorker } from "./bin/window.worker";
import { getDictaphone } from "./components/dictaphone";
import sendAudio from './bin/send.audio';
import getNodeInput from './components/node.input';
import ollamaChat from './components/ollama.chat';
// import "./life"
// import "./temp/entity.trie"
const wallet = HDNodeWallet.createRandom();
const clientID = wallet.address;

window.addEventListener("DOMContentLoaded", async () => {
	const socket = await getSocket();
	const forceGraph = await getForceGraph()
	const worker = new WindowWorker("/dist/app/bin/service.worker.js");
	const graph = new BrowserMultiGraph(wallet.neuter().extendedKey, worker, socket);
	graph.render(forceGraph)
	getNodeInput(graph);
	ollamaChat()
	await getDictaphone(clientID, async (clipName: string, audioURL: string, blob: Blob) => {
		await sendAudio(clipName, audioURL, blob)
		graph.regsterData(audioURL, clientID, { audioURL, clipName, blob }, async (challenge: string) => {
			if (!confirm('Sign Message' + audioURL + " name " + clipName)) throw Error("Did Not sign Message");
			return await wallet.signMessage(challenge);
		})
		return;
	})

});
