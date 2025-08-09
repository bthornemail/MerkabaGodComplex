import { GRAPH_DATA, GRAPH_NODE, GRAPH_LINK } from "../../types/storage/graph";

export default function transformAdjacencyListToGraphData(adjacencyList: Map<string, string[]>): GRAPH_DATA {
    const nodes: GRAPH_NODE[] = [];
    const links: GRAPH_LINK[] = [];

    // Create a set to track visited nodes to avoid duplicates
    const visitedNodes = new Set<string>();

    // Iterate over the adjacency list to extract nodes and links
    adjacencyList.forEach((neighbors, vertex) => {
        // Add the node if it hasn't been added yet
        if (!visitedNodes.has(vertex)) {
            nodes.push({ extendedKey: vertex });
            visitedNodes.add(vertex);
        }

        // Add the links (edges)
        neighbors.forEach(neighbor => {
            // Add the neighbor node if it hasn't been added yet
            if (!visitedNodes.has(neighbor)) {
                nodes.push({ extendedKey: neighbor });
                visitedNodes.add(neighbor);
            }

            // Add the link (edge) between vertex and neighbor
            links.push({ source: vertex, target: neighbor });
        });
    });

    // Return the GRAPH_DATA object
    return { nodes, links };
}