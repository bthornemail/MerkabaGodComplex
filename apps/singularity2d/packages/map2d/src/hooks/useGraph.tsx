/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from 'react'
import { GraphContext } from '../provider/Graph.Provider.tsx'

export const useGraph = () => {
  const { graphData, updateGraphData  }: any = useContext(GraphContext)
  return { graphData, updateGraphData }
}
