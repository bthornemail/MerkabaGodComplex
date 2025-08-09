getData("/graph", { answer: 42 }).then((data) => {
    console.log(data); // JSON data parsed by `data
    const myGraph = ForceGraph();
    const graph = document.querySelector("#graph")
    console.log(graph)
    delete data.links
    delete data.edges
    myGraph(graph).graphData(data);
});
