export default async function updateGraphData(graphData) {
    graphData.nodes.forEach(async (node) => {
        forceGraph3D.graphData({
            nodes: [...nodes, formatNode(node)],
            links: [...links]
        })
    })
    graphData.links.forEach(async (link) => {
        forceGraph3D.graphData({
            nodes: [...nodes],
            links: [...links, link]
        })
    })
};