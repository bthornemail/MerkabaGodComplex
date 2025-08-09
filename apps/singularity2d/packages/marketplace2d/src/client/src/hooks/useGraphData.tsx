/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import {
    useState,
    // createContext,
    useEffect
} from 'react'
import formatNode from '../bin/format.node'
import { NODE_GRAPH } from '../components/Graph'
// import rootData from '../datasets/cloudy.day.vault.json';
import rootData from '../datasets/cloudy.day.vault.json';
// import marketplaceData from '../datasets/marketplace.json';
// import accountManagerData from '../datasets/vault.user.json';

export class Graph<NodeType, LinkType> {
    nodes: Set<NodeType> = new Set();
    links: Set<LinkType[]> = new Set();
    vertices: Set<NodeType> = new Set();
    edges: Set<LinkType[]> = new Set();
    graphData: NODE_GRAPH;
    addNode(node: NodeType) {
        this.nodes.add(node)
    }
    addLink() { }

    getGraph() {
        return this.graphData
    }
    constructor(graphData: NODE_GRAPH = { nodes: [], links: [] }) {
        console.log(graphData);
        this.graphData = graphData
    }
}
export default function useGraph(graph: NODE_GRAPH = {
    nodes: [], links: []
}) {
    const [graphData, setGraphData] = useState<NODE_GRAPH>(graph)

    async function loadData(...data: NODE_GRAPH[]) {
        data.forEach(async (graph: { nodes: any[], links: any[] }) => {
            await updateGraphData(graph)
        })
    }
    async function updateGraphData(graphData: NODE_GRAPH): Promise<void> {
        graphData.nodes.forEach(async (node: any) => {
            setGraphData(({ nodes, links }: any) => {
                return {
                    nodes: [...nodes, formatNode(node)],
                    links: [...links]
                };
            })
        })
        graphData.links.forEach(async (link: any) => {
            setGraphData(({ nodes, links }: any) => {
                return {
                    nodes: [...nodes],
                    links: [...links, link]
                };
            })
        })
    }

    useEffect(() => {
        try {
            // updateGraphData(rootData)
            // updateGraphData(marketplaceData)
            // updateGraphData(accountManagerData)
            loadData(rootData)//, rootData, accountManagerData)
        } catch (error) {
            // console.error(error)
        }
    }, [])
    return {
        // walk,
        // visit,
        // search,
        // link,
        graphData
    }
}
