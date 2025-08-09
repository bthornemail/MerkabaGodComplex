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
import createForceGraph3DBox from './shapes/box.js';
import createForceGraph3DHTML from './shapes/html.js';
import createForceGraph3DSphere from './shapes/sphere.js';
import createForceGraph3DSpriteText from './shapes/sprite.text.js';
import createForceGraph3DTetrahedron from './shapes/tetrahedron.js';
import createForceGraph3DTorus from './shapes/torus.js';
export default function createForceGraph3D(elem = document.getElementById('graph-3d')) {
	return ForceGraph3D({ controlType: 'orbit', extraRenderers: [new CSS2DRenderer()] })(elem)
		.width(elem.parentElement.clientWidth)//document.getElementById("graph-display-container").clientWidth)//480)
		.height(elem.parentElement.parentElement.clientHeight)//document.getElementById("graph-display-card").clientHeight)//320)
		.backgroundColor("rgba(0,0,0,.5)")
		// .onBackgroundClick(handleBackgroundClick)
		// .onBackgroundRightClick(handleBackgroundRightClick)
		.nodeLabel('id')
		.nodeAutoColorBy('group')
		.nodeColor((node) => {
			node.color = 'rgba(255,255,255,0.1)'
			return node
		})
		.nodeThreeObject(createForceGraph3DNodeTypeSelector)
		// .nodeThreeObjectExtend(true)
		.onNodeDragEnd(node => {
			node.fx = node.x;
			node.fy = node.y;
			node.fz = node.z;
		})
		.onNodeClick(handleClick)
		.onNodeRightClick(handleRightClick)
		.linkWidth(1.5)
		.linkColor("white")
		.linkDirectionalParticles(4)
		.linkDirectionalParticleSpeed(d => d.value * 0.001)
		.cooldownTicks(1);

}