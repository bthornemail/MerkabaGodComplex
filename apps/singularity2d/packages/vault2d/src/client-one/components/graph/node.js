import mapGraphWithGraphData from '../../bin/map.graph.with.graph.data.js'
import Graphology from 'graphology'
import {HDNodeWallet} from 'ethers'
function createOption(id, label, element) {
	const option = document.createElement("option");
	option.value = id;
	option.innerText = label;
	element ? element.append(option) : document.getElementById("input-topic").append(option);
}
export default function createNode(text, graphology = new Graphology(), forceGraphs = [],client) {
	if (text === "") return;
	const topic = document.getElementById("input-topic").value;
	graphology.addNode(text, Object.assign({}, HDNodeWallet.createRandom().neuter(), { type: document.getElementById("input-type")?.value }));
	if (topic) {
		if (!graphology.hasNode(topic)) {
			graphology.addNode(topic, HDNodeWallet.createRandom().neuter());
		}
		graphology.addEdge(topic, text);
	}
	const map = graphology.export();
	forceGraphs.forEach((forceGraph) => {
		mapGraphWithGraphData(forceGraph, map);
	});
	createOption(text, text);
	if(client){
		client.publish("new-entity", "text");
	}
}
