/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import PropTypes from 'prop-types'
import {
    useState,
    createContext,
    useEffect
} from 'react'
import formatNode from '../bin/format.node'
import { NODE_GRAPH } from '../components/Graph'
// import rootData from '../datasets/cloudy.day.vault.json';
import marketplaceData from '../datasets/marketplace.json';
// import accountManagerData from '../datasets/vault.user.json';

export const GraphContext = createContext({
    graphData: { nodes: [], links: [] },
    updateGraphData: (graphData: NODE_GRAPH) => { return console.log(graphData) }
})
export const GraphProvider = ({ children }: any) => {
    const [graphData, setGraphData] = useState<any>({
        nodes: [], links: []
    })

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
            loadData(marketplaceData)//, rootData, accountManagerData)
        } catch (error) {
            // console.error(error)
        }
    }, [])
    return (
        <GraphContext.Provider value={{
            graphData,
            updateGraphData
        }}>
            {children}
        </GraphContext.Provider>
    )
}

GraphProvider.propTypes = {
    children: PropTypes.any
}
