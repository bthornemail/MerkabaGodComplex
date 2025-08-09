import { ethers, HDNodeWallet } from "ethers";
import { Graph } from "./components/graph.js";
import Graphology from 'graphology';

// const _host = ethers.HDNodeWallet.createRandom("", "m/0");
// const _user = ethers.HDNodeWallet.fromPhrase("roast thank tiny coach seat ensure cruel auto shaft finish fee resemble");

const graphView = document.getElementById('graph') as HTMLDivElement;

const openGraphViewFormInput = document.querySelector("#open-graph-view-form-input") as HTMLInputElement;
const openGraphViewFormQtyButton = document.querySelector("#open-graph-view-form-qty-button") as HTMLButtonElement;

const logsElement = document.getElementById('logs') as HTMLPreElement;

export function logger(message: string) {
	console.log(message);
	const li = document.createElement("li");
	li.textContent = message;
	openGraphViewFormInput.value = JSON.stringify(message);
	li.classList.add("list-group-item");
	logsElement.append(li);
	openGraphViewFormQtyButton.textContent = logsElement.childElementCount.toFixed(0)
}
export async function getData(url: string) {
	try {
		const response = await fetch(url, {
			headers: {
				"Content-Type": "text/plain",
			}
		});
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
window.addEventListener("DOMContentLoaded", async () => {
	const authView = document.querySelector("#auth-view") as HTMLDivElement;
	const authOptions = document.querySelector("#auth-options") as HTMLDialogElement;
	const layerView = document.querySelector("#controller-view") as HTMLDivElement;
	const layerOptions = document.querySelector("#controller-options") as HTMLDivElement;
	const graphOptions = document.querySelector("#graph-options-container") as HTMLDivElement;
	const nodeView = document.querySelector("#node-view") as HTMLDivElement;
	const nodeOptions = document.querySelector("#graph-options-container") as HTMLDivElement;
	const graph = new Graphology();
	const wallet = HDNodeWallet.createRandom();
	graph.setAttribute("extendedKey", wallet.extendedKey);
	graph.setAttribute("address", wallet.address);
	graph.addNode(wallet.address, Object.assign({ color: "yellow" }, { org: await getData("src/docs/org/template.org") }, { extendedKey: wallet.neuter().extendedKey }));
	const grapholoy: Graph = new Graph({
		graphView,
		graphOptions,
		authView,
		authOptions,
		layerView,
		layerOptions,
		nodeView,
		nodeOptions,
		serializedGraph: graph.export()
	});
	grapholoy.render();
});
