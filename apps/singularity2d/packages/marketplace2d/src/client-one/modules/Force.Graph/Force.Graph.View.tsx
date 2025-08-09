/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react"
import { ForceGraph2D, ForceGraph3D } from 'react-force-graph';
import { Outlet } from 'react-router-dom'
import DataView from "./DataView/Data.View";
import HudView from './DataView/Hud.View';
import ForceGraphCard from './Force.Graph.Card'
import ForceGraphHUD from './Force.Graph.HUD'
import "./Force.Graph.View.css"

export default function ForceGraphView() {
  const forceGraphView = useRef<HTMLDivElement>(null)
  const [myData, setMyData] = useState<{ nodes: any[], links: any[] }>({ nodes: [], links: [] })
  const [nodeData, setNodeData] = useState<any>({})
  const [eventData, setEventData] = useState<any>({})
  useEffect(() => {
    fetch('/data/marketplace.json').then(res => res.json()).then((data: any) => {
      const list: any[] = Object.entries(data.types).map(([key,value]:[key: string,value: any],index: number)=>{
        return { id: key,val:index,data:value,group:"marketplace" + index}
      })
      console.log({nodes: list})
      setMyData({nodes: list,links:[]})
    });
  }, [])
  return (<section id="force-graph-section">
    <div id="force-graph-view" ref={forceGraphView} style={{ width: "85%", height: "100%", margin: "0 auto" }}>
    <Outlet></Outlet>
    <div id="graphview" style={{ gridArea: "graph" }}>
      <ForceGraphCard width={forceGraphView.current?.clientWidth && forceGraphView.current?.clientWidth * .85} height={forceGraphView.current?.clientHeight && forceGraphView.current?.clientHeight * .55} parent={forceGraphView.current} graphData={myData} setNodeData={setNodeData} setEventData={setEventData} />
    </div>
  </div>
  </section>)
}