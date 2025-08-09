import mqtt from "mqtt";
import io from 'socket.io-client'
import { ethers, Wallet, HDNodeWallet, id } from "ethers";
import SpriteText from "three-spritetext";
import { marked } from 'marked';
import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

import { TetrahedronGeometry } from '../../modules/three/src/geometries/TetrahedronGeometry.js';
import { MeshBasicMaterial } from '../../modules/three/src/materials/MeshBasicMaterial.js';
import { SphereGeometry } from '../../modules/three/src/geometries/SphereGeometry.js';
import { Mesh } from '../../modules/three/src/objects/Mesh.js';
import formatNode from '../../bin/format.node.js'
import mapGraphWithGraphData from '../../bin/map.graph.with.graph.data.js'
import updateGraphData from '../../bin/update.graph.data.js';
import * as Merkletree from '../../modules/merkletree/merkletree.js';
import { mqttConnect, graphConnect, socketConnect, sseConnect, wsConnect } from "../../background.js"
import createForceGraph3DBox from './shapes/box.js';
import createForceGraph3DHTML from './shapes/html.js';
import createForceGraph3DSphere from './shapes/sphere.js';
import createForceGraph3DSpriteText from './shapes/sprite.text.js';
import createForceGraph3DTetrahedron from './shapes/tetrahedron.js';
import createForceGraph3DTorus from './shapes/torus.js';
export async function handleClick(node) {
	const isNode = Array.from(document.getElementById("input-topic").childNodes.values()).find((elem) => elem.value === node.id);
	isNode ? isNode.setAttribute("selected", "selected") : null;
	// Aim at node from outside it
	const distance = 40;
	const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

	const newPos = node.x || node.y || node.z
		? { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }
		: { x: 0, y: 0, z: distance }; // special case if node is in (0,0,0)

	// forceGraph3D.cameraPosition(
	// 	newPos, // new position
	// 	node, // lookAt ({ x, y, z })
	// 	3000  // ms transition duration
	// );
}
export function handleRightClick(node) {
	const isEditing = toggleEditMode(node);
	// Aim at node from outside it
	const distance = 150;
	const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

	forceGraph3D.cameraPosition(
		{ x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
		node, // lookAt ({ x, y, z })
		2000  // ms transition duration
	);
	isEditing(node)
};
// export const handleBackgroundRightClick = useCallback(async (event: any) => {
//       console.log({ event })
//       // await updateGraphData({
//       //       nodes: [formatNode({
//       //             "img": "availability-svgrepo-com.svg",
//       //             "name": "New Node",
//       //             "title": "New Node",
//       //             "color": "yellow",
//       //             "val": 10,
//       //             "x": event.x,
//       //             "y": event.y
//       //       })],
//       //       links: []
//       // });
//       setViewToggle(!viewToggle)
//       graphRef.current?.refresh()
// }, []);
export async function handleBackgroundClick(event) {
	console.log({ event })
	const newTopicTitle = window.prompt("Enter Topic Title");
	if (!newTopicTitle) throw new Error("No Topic Entered");
}
export function createForceGraph3DNodeTypeSelector(node) {
	console.log(node)
	switch (node.type) {
		case "identity":
			return createForceGraph3DTorus(node);
			break;
		case "document":
			return createForceGraph3DSphere(node)
			break;
		case "asset":
			return createForceGraph3DBox(node);
			break;
		case "service":
			return createForceGraph3DTetrahedron(node)
			break;
		case "message":
			return createForceGraph3DHTML(node)
			break;
		default:
			return createForceGraph3DSpriteText(node);
			break;
	}
}
