export default function mapGraphWithGraphData(graph, graphData) {
    return graph.graphData({
        nodes: [...graphData.nodes.map(node => Object.assign({ id: node.key }, node.attributes))],
        links: [...graphData.edges.map(({ key, source, target }) => Object.assign({ id: key, source, target }))]
    });
}