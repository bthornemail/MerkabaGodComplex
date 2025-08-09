import { BrowserMultiGraph } from "./multi.graph";
export default function getNodeInput(
    graph: BrowserMultiGraph,
    nodeInputForm: HTMLFormElement = document.getElementById("node-input-form") as HTMLFormElement,
    nodeParentSelect: HTMLSelectElement = document.getElementById("node-parent-select") as HTMLSelectElement,
    nodeInput: HTMLInputElement = document.getElementById("node-input") as HTMLInputElement
) {
    nodeInputForm.addEventListener("submit", (e: any) => {
        e.preventDefault()
        if (!nodeInput.value) throw Error("no input");
        const value = nodeInput.value.trim()
        if (value === "") throw Error("no input");
        graph.regsterData(nodeParentSelect.value, value, { color: "red" });
        // if (nodeParentSelect.value) {
        // 	graph.addEdge(nodeParentSelect.value.trim(), value);
        // }
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        option.selected = true;
        nodeParentSelect.append(option)
        // Displaying useful information about your graph
        console.log('Number of nodes', graph.order);
        console.log('Number of edges', graph.size);
        nodeInput.value = "";
    });

}