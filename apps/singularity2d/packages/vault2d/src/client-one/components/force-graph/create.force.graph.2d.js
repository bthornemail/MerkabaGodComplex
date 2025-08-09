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
import {createForceGraph3DNodeTypeSelector, handleClick,handleRightClick} from './create.force.graph.js';

export default function createForceGraph2D(elem = document.getElementById('graph-2d')) {
	return ForceGraph({ controlType: 'orbit' })(elem)
		// .graphData({ nodes: [{ id: "Hey" }], links: [] })
		.width(elem.parentElement.parentElement.clientWidth - 100)
		.height(elem.parentElement.parentElement.clientHeight - 200)
		.backgroundColor("rgba(0,0,0,.5)")
		// .onBackgroundClick(handleBackgroundClick)
		// .onBackgroundRightClick(handleBackgroundRightClick)
		.nodeLabel('id')
		.nodeAutoColorBy('group')
		.nodeCanvasObject((node, ctx, globalScale) => {
			const label = node.id;
			// const fontSize = 12/globalScale;
			const fontSize = 24 / globalScale;
			ctx.font = `${fontSize}px Sans-Serif`;
			const textWidth = ctx.measureText(label).width;
			const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

			ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
			// ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
			ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			// ctx.fillStyle = node.color;
			ctx.fillStyle = "rgba(255,255,0,1)";
			// ctx.fillStyle = "0xff0000";
			ctx.fillText(label, node.x, node.y);

			node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
		})
		.nodePointerAreaPaint((node, color, ctx) => {
			ctx.fillStyle = color;
			const bckgDimensions = node.__bckgDimensions;
			bckgDimensions && ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
		})
		.onNodeClick(handleClick)
		.onNodeRightClick(handleRightClick)
		.linkWidth(2)
		.linkColor("white")
		.linkDirectionalParticles(4)
		.linkDirectionalParticleSpeed(d => d.value * 0.001)
		.cooldownTicks(1);
}