/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from "react"
import { ForceGraph2D, ForceGraph3D } from 'react-force-graph';
import "./Force.Graph.View.css"
export default function ForceGraph(props: any) {
  const [is2D, set2D] = useState(true)
  const { graphData, setEventData, setNodeData, width, height } = props
  const baseSize = 8
  const graphRef = useRef<any>(null);
  function addNode(node: any, event: any) {
    setNodeData(node)
    const { x, y, timeStamp } = event
    setEventData({ x, y, timeStamp })
  }
  function onBackgroundClick(event: any) {
    setNodeData({ title: "Create New Node", data: `${event.y}, ${event.x}` })
    const { x, y, timeStamp } = event
    setEventData({ x, y, timeStamp })
  }
  return <div>{is2D
    ? <ForceGraph2D ref={graphRef} graphData={graphData}
      // width={window.innerWidth * .85}
      // height={window.innerHeight * .55}
      width={width}
      height={height}
      onEngineStop={() => {
        graphRef.current.zoomToFit(0, 36);
      }}
      // backgroundColor={'linear-gradient(to right top, #d16ba5, #c777b9, #ba83ca, #aa8fd8, #9a9ae1, #8aa7ec, #79b3f4, #69bff8, #52cffe, #41dfff, #46eefa, #5ffbf1), rgba(0,0,0,0.25)'}
      // backgroundColor={'rgba(0,0,0,0.05)'}
      nodeId={'id'}
      nodeVal={'val'}
      nodeLabel={'label'}
      nodeAutoColorBy={'group'}
      nodeRelSize={baseSize}
      linkSource={'source'}
      linkTarget={'target'}
      linkWidth={baseSize * 2}
      onNodeClick={addNode}
      onBackgroundClick={onBackgroundClick}
    />
    : <ForceGraph3D graphData={graphData}
      // width={window.innerWidth * .85}
      // height={window.innerHeight * .55}
      width={width}
      height={height}
      backgroundColor={'rgba(0,0,0,0)'}
      nodeId={'id'}
      nodeVal={'val'}
      nodeLabel={'label'}
      nodeAutoColorBy={'group'}
      nodeRelSize={baseSize}
      linkSource={'source'}
      linkTarget={'target'}
      linkWidth={baseSize * 2}
      onNodeClick={addNode}
      onBackgroundClick={onBackgroundClick}
    />}
    <br />
    <div>
      <button className="btn btn-primary" onClick={() => { set2D(!is2D) }}>{is2D ? '2D' : '3D'}</button>
    </div>
  </div>
}