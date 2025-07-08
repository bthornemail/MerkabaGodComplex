

export class FunctonalGraph extends Graph {
    private adjacencyList: Map<string, string[]> = new Map();
    addVertex(vertex: string): void {
        if (!this.adjacencyList.has(vertex)) {
            this.adjacencyList.set(vertex, []);
        }
    }

    addEdge(vertex1: string, vertex2: string): void {
        if (this.adjacencyList.has(vertex1)) {
            this.adjacencyList.get(vertex1)?.push(vertex2);
        }
        if (this.adjacencyList.has(vertex2)) {
            this.adjacencyList.get(vertex2)?.push(vertex1); // For an undirected graph
        }
    }

    getAdjacencyList(): Map<string, string[]> {
        return this.adjacencyList;
    }
    bfs(startVertex: string, targetVertex: string): boolean {
        const visited = new Set<string>();
        const queue: string[] = [startVertex];

        while (queue.length > 0) {
            const currentVertex = queue.shift()!;

            if (currentVertex === targetVertex) {
                return true; // Found the target node
            }

            if (!visited.has(currentVertex)) {
                visited.add(currentVertex);

                const neighbors = this.getAdjacencyList().get(currentVertex);
                if (neighbors) {
                    for (const neighbor of neighbors) {
                        if (!visited.has(neighbor)) {
                            queue.push(neighbor);
                        }
                    }
                }
            }
        }

        return false; // Target node not found
    }
    dfs(startVertex: string, targetVertex: string): boolean {
        const visited = new Set<string>();

        function dfsRecursive(vertex: string): boolean {
            if (vertex === targetVertex) {
                return true; // Found the target node
            }

            visited.add(vertex);

            const neighbors = this.getAdjacencyList().get(vertex);
            if (neighbors) {
                for (const neighbor of neighbors) {
                    if (!visited.has(neighbor)) {
                        if (dfsRecursive(neighbor)) {
                            return true;
                        }
                    }
                }
            }

            return false;
        }

        return dfsRecursive(startVertex);
    }
    // Function to transform adjacency list to GRAPH_DATA format
    transformAdjacencyListToGraphData(adjacencyList: Map<string, string[]>): GRAPH_DATA {
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

    constructor(extendedKey: string) {
        super({ extendedKey })
        this.extendedKey = extendedKey;
    }
}