import ForceGraph from 'force-graph';
export default async function getForceGraph() {
    const graphElement = document.getElementById("force-graph") as HTMLDivElement;
    const myGraph = new ForceGraph(graphElement)
        // .width(500)
        .width(graphElement.parentElement?.clientWidth ?? 500)
        .height(500)
        // .height(500)
        // .nodeId("id")
        .nodeLabel("id")
        // .nodeAutoColorBy('group')
        .linkColor("rgba(255,255,255)")
        .linkWidth(2)
        .linkDirectionalParticles(2)
        .linkDirectionalParticleWidth(1.4)
        .onNodeClick(node => {
            // Center/zoom on node
            myGraph.centerAt(node.x, node.y, 1000);
            myGraph.zoom(8, 2000);
        })
        // .nodeCanvasObject((node: any, ctx: any, globalScale) => {
        //   const label = node.id as string;
        //   const fontSize = 12/globalScale;
        //   ctx.font = `${fontSize}px Sans-Serif`;
        //   const textWidth = ctx.measureText(label).width;
        //   const bckgDimensions: any = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

        // //   ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        // //   ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

        //   ctx.textAlign = 'center';
        //   ctx.textBaseline = 'middle';
        //   ctx.fillStyle = node.color;
        //   ctx.fillText(label, node.x, node.y);

        //   node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
        // })
        // // .nodePointerAreaPaint((node: any, color, ctx: any) => {
        // //   ctx.fillStyle = color;
        // //   const bckgDimensions: any = node.__bckgDimensions;
        // //   bckgDimensions && ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
        // // })
        .cooldownTicks(100);
    myGraph.d3Force('center', null);
    window.onresize = function () {
        myGraph.width((document.getElementById("main-section") as HTMLDialogElement).clientWidth);
    };
    // fit to canvas when engine stops
    myGraph.onEngineStop(() => myGraph.zoomToFit(400));
    return myGraph;
}