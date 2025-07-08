import { forceSimulation, forceManyBody, forceLink, forceCenter, forceCollide, forceRadial } from "d3-force-3d";
import {MultiGraph} from "graphology";import { connect } from "mqtt";


function runSimulation(name, graphDataHistory?) {
    const client = connect("mqtt://127.0.0.1:1883");
    const graphData = graphDataHistory ?? {
        id: name,
        layers: [],
        nodes: [],
        links: [],
        edges: []
    };

    const graph = new MultiGraph();
    graphData.nodes.forEach((node) => {
        graph.addNode(node.id, node)
    });
    const simulation = forceSimulation(graphData.nodes, 3)
        .force("charge", forceManyBody())
        .force("link", forceLink(graphData.edges))
        .force("collide", forceCollide())
        .force("center", forceCenter())
        .force("position", forceRadial(Math.floor(8 * ((graphData.nodes.length / 8) + 1)), 0, 0, 0))


    //simulation.tick()
    simulation.stop();
    //simulation.tick()
    //console.log(graphData.nodes[0])

    simulation.on("tick", () => {
        graphData.nodes.forEach((node) => {
            graph.updateNodeAttributes(node.id, (oldnode) => {
                return Object.assign({}, oldnode, node);
            });
            console.log("neighbors",graph.outNeighborEntries(node.id));
        })
        console.log(JSON.stringify(graph.export()))
    });
    client.on("connect", () => {
        console.log("connected");
        simulation.tick();
        client.subscribe(graphData.id, () => {
            simulation.tick();
        });
        simulation.on("end", () => {
            client.publish(graphData.id, JSON.stringify(graphData));
        });
        client.on("message", (topic, message) => {
            const id = graphData.nodes.length.toString();
            graph.addNode(id, { topic, message });
            graphData.nodes.push({ id, topic, message })
            simulation.tick()
        });
    });
    return { graph, graphData, simulation };
}

const globalSimulation = runSimulation("global");
const clientSimulations = new Map([]);
const simulation = runSimulation("client");
globalSimulation.simulation.on("end", () => {
    //    clientSimulations.forEach((simulation) => {
    //        simulation[1].tick();
    //    });
    //globalSimulation.restart();
});
clientSimulations.set(simulation.graphData.id, simulation);
(async () => {
    const client = connect("mqtt://127.0.0.1:1883");
    const graphData = {
        id: "client",
        layers: [],
        edges: [],
        nodes: [
            { id: "there" },
            { id: "the" }
        ],
        links: [
            { source: "the", target: "there" }
        ]
    }
    client.on("connect", () => {
        console.log("connected");
        client.publish("client", JSON.stringify(graphData));
    });

})();
