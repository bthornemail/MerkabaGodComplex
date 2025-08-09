export default async function onConnect({graph,host,user}: any){
	const graphData = graph.graphData();
	if (graphData.nodes.find((node: any) => node.extendedKey === host.extendedKey)) return;

	graph.graphData({
		nodes: [
			Object.assign({ color: "red", protocol: "ws", host: "127.0.0.1", port: 33333 }, { extendedKey: host.extendedKey }, host),
			...graphData.nodes
		],
		links: [
			{ source: user.extendedKey, target: host.extendedKey },
			...graphData.links
		]
	});
}