import cluster from 'node:cluster';
import http from 'node:http';
import process from 'node:process';
import { availableParallelism } from 'node:os';
import jsdom from "jsdom";
import * as mqtt from "mqtt";
import io from 'socket.io-client'
import { ethers, Wallet, HDNodeWallet, id } from "ethers";
import { TetrahedronGeometry } from '/modules/three/src/geometries/TetrahedronGeometry.js';
import { MeshBasicMaterial } from '/modules/three/src/materials/MeshBasicMaterial.js';
import { SphereGeometry } from '/modules/three/src/geometries/SphereGeometry.js';
import { Mesh } from '/modules/three/src/objects/Mesh.js';
import { marked } from 'marked';
import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import SpriteText from "three-spritetext";
import Graphology from 'graphology';
const { JSDOM } = jsdom;
const resourceLoader = new jsdom.ResourceLoader({
  proxy: "http://127.0.0.1:8888",
  strictSSL: false,
  userAgent: "Vault2D/8001",
});
// for each hs a different virtual concolse to exporttheir own errors sepaaretyly
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", () => { });
virtualConsole.on("warn", () => { });
virtualConsole.on("info", () => { });
virtualConsole.on("dir", () => { });
// virtualConsole.sendTo(c, { omitJSDOMErrors: true }); // to hanle myselef withoout errors in index[0]

JSDOM.fromFile("./client/Vault2D/index.html", {
  url: "https://127.0.0.1:8888/",
  referrer: "https://vault2d.com",
  contentType: "text/html",
  includeNodeLocations: true,
  // storageQuota: 10000000,
  runScripts: "dangerously",
  pretendToBeVisual: true,
  // resources: resourceLoader,
  // virtualConsole
}).then(dom => {
  // console.log(dom.serialize());
  console.log(dom.window.document.querySelector("body")!.textContent); // "Hello world"
  const { window } = dom;
  const { document } = window;
  // import { csvParse } from 'https://esm.sh/d3-dsv';
  // import { forceCollide } from 'https://esm.sh/d3-force-3d';
  // import { GUI } from 'https://esm.sh/dat.gui';

  const clientGraph = new Graphology();//new Graphology();
  console.log(clientGraph.export())
  document.addEventListener('DOMContentLoaded', async () => {
    function formatNode(node, type) {
      let update = {}
      if (!node.img) {
        node.img = "loading.svg"
      }
      if (node.img) {
        update.img = node.img.includes("/") ? node.img : `src/images/${node.img}`
      }
      if (!node.label && node.title) {
        update.label = `<div className="card">
				  <div className="card-title">${node.title ?? ""}</div>
			</div>`
      }
      if (!node.label && !node.title && node.name) {
        update.label = `<div className="card">
				  <div className="card-title">${node.name ?? ""}</div>
			</div>`
      }

      if (type === "topic") {
        update.img = `src/images/communication-svgrepo-com.svg`
        update.label = `<div className="card">
				  <div className="card-title">${node.title}</div>
			</div>`
      }
      if (type === "chat-message") {
        update.img = `src/images/message-one-svgrepo-com.svg`
        update.label = `<div className="card">
				  <div className="card-title">${node.title}</div>
			</div>`
      }
      if (type === "asset") {
        update.label = `<div className="card">
			<div className="card-title">${node.title ?? ""}</div>
			<div className="card-subtitle">${node.value ?? ""}</div>
			<div className="card-body">${node.summary ?? ""}</div>
	  </div>`
      }
      return Object.assign({}, node, update)
    }
    async function updateGraphData(graphData) {
      graphData.nodes.forEach(async (node) => {
        forceGraph3D.graphData({
          nodes: [...nodes, formatNode(node)],
          links: [...links]
        })
      })
      graphData.links.forEach(async (link) => {
        forceGraph3D.graphData({
          nodes: [...nodes],
          links: [...links, link]
        })
      })
    }
    function mapGraphWithGraphData(graph, graphData) {
      const nodes = [];
      const links = [];
      graphData.nodes.map((elem) => {
        const { key,
          attributes } = elem;
        const {
          provider
          , address
          , publicKey
          , fingerprint
          , parentFingerprint
          , chainCode
          , path
          , index
          , depth
          , type
        } = attributes;
        const size = depth;
        const levels = path.split('/'),
          level = levels.length - 1,
          module = level > 0 ? levels[1] : null,
          leaf = levels.pop(),
          parent = levels.join('/');

        const node = {
          path,
          leaf,
          module,
          size: +size || 20,
          level
        };
        nodes.push(Object.assign({}, node, { id: elem.key }, elem.attributes))
        if (parent) {
          links.push(Object.assign({}, { id: key }, { source: parent, target: path, targetNode: node }));
          // links.push({ source: parent, target: path, targetNode: node });
        }
        return { nodes, links }
      });
      console.log({ nodes, links })
      return { nodes, links }
      // return graph.graphData({
      // 	nodes: [...graphData.nodes.map(node => Object.assign({ id: node.key }, node.attributes))],
      // 	links: [...graphData.edges.map(({ key, source, target }) => Object.assign({ id: key, source, target }))]
      // })
    }
    async function handleClick(node) {
      const isNode = Array.from(document.getElementById("input-topic").childNodes.values()).find((elem) => elem.value === node.id);
      isNode ? isNode.setAttribute("selected", "selected") : null;
      // Aim at node from outside it
      const distance = 40;
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

      const newPos = node.x || node.y || node.z
        ? { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }
        : { x: 0, y: 0, z: distance }; // special case if node is in (0,0,0)

      forceGraph3D.cameraPosition(
        newPos, // new position
        node, // lookAt ({ x, y, z })
        3000  // ms transition duration
      );
    }
    function handleRightClick(node) {
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
    function toggleEditMode(node) {
      document.getElementById("graph-display-card").classList.add(["graph-display-card-edit-mode"]);
      return (node) => {
        document.getElementById("graph-display-card").classList.remove(["graph-display-card-edit-mode"]);
      }
    };
    // const handleBackgroundRightClick = useCallback(async (event: any) => {
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
    async function handleBackgroundClick(event) {
      console.log({ event })
      const newTopicTitle = window.prompt("Enter Topic Title");
      if (!newTopicTitle) throw new Error("No Topic Entered");
    }
    const elem = document.getElementById('graph-3d');
    function createOption(id, label, element) {
      const option = document.createElement("option");
      option.value = id;
      option.innerText = label;
      element ? element.append(option) : document.getElementById("input-topic").append(option);
    }
    function createNode(text) {
      if (text === "") return;
      const topic = document.getElementById("input-topic").value;
      clientGraph.addNode(text, Object.assign({}, HDNodeWallet.createRandom().neuter(), { type: document.getElementById("input-type")?.value }));
      if (topic) {
        if (!clientGraph.hasNode(topic)) {
          clientGraph.addNode(topic, HDNodeWallet.createRandom().neuter());
        }
        clientGraph.addEdge(topic, text);
      }
      const map = clientGraph.export();
      mapGraphWithGraphData(forceGraph3D, map);
      mapGraphWithGraphData(graph2d, map);
      createOption(text, text);
    }
    function createForceGraph3D(elem = document.getElementById('graph-3d'), is2D = false) {
      function createForceGraph3DSphere(node) {
        const geometry = new SphereGeometry(4, 32 / 2, 64 / 2);
        const material = new MeshBasicMaterial({ color: 0x00ff00 });//, wireframe: true });
        const sphere = new Mesh(geometry, material);
        return sphere;
      }
      function createForceGraph3DTetrahedron(node) {
        const geometry = new TetrahedronGeometry(4);
        const material = new MeshBasicMaterial({ color: 0xfff000 });//, wireframe: true });
        const tetrahedron = new Mesh(geometry, material);
        return tetrahedron;
      }
      function createForceGraph3DBox(node) {
        const geometry = new THREE.BoxGeometry(4, 4, 4);
        const material = new MeshBasicMaterial({ color: 0x0000ff });//, wireframe: true });
        const tetrahedron = new Mesh(geometry, material);
        return tetrahedron;
      }
      function createForceGraph3DTorus(node) {
        const geometry = new THREE.TorusGeometry(4, 1, 8, 16, Math.PI * 2);
        const material = new MeshBasicMaterial({ color: 0xffffff });//, wireframe: true });
        const torus = new Mesh(geometry, material);
        return torus;
      }
      function createForceGraph3DSpriteText(node) {
        const sprite = new SpriteText(node.id);
        sprite.material.depthWrite = false; // make sprite background transparent
        // sprite.color = node.color;
        sprite.textHeight = 8;
        return sprite;
      }
      function createForceGraph3DHTML(node) {
        const nodeEl = document.createElement("div");
        nodeEl.innerHTML = `<h1>${node.id}</h1><p>${Date.now()}</p>`;
        // nodeEl.textContent = node.id;
        nodeEl.style.color = "white";
        nodeEl.className = "node-label";
        return new CSS2DObject(nodeEl);
      }
      function createForceGraph3DNodeTypeSelector(node) {
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
      if (!is2D) {
        return ForceGraph3D({ controlType: 'orbit', extraRenderers: [new CSS2DRenderer()] })(elem)
          .width(elem.parentElement.clientWidth)//document.getElementById("graph-display-container").clientWidth)//480)
          .height(elem.parentElement.parentElement.clientHeight * .8)//document.getElementById("graph-display-card").clientHeight)//320)
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
    const forceGraph3D = createForceGraph3D(document.getElementById('graph-3d'));
    const graph2d = createForceGraph3D(document.getElementById('graph-2d'), true);
    // graph.d3Force('charge').strength(-120);
    forceGraph3D.onEngineStop(() => forceGraph3D.zoomToFit(100));
    graph2d.onEngineStop(() => graph2d.zoomToFit(100));
    graphDag.onEngineStop(() => graph2d.zoomToFit(100));
    document.getElementById("input-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const text = document.getElementById("input").value;
      createNode(text.trim());
      document.getElementById("input").value = "";
    })
    // Register the service worke/modules/graphology/graphology.min.jsr
    document.getElementById("download-sw").addEventListener('click', async () => {
      const graphData = clientGraph.export();
      if (!graphData) throw new Error("No Data");
      const bytes = new TextEncoder().encode(JSON.stringify(graphData))
      const file = new Blob([bytes], { type: "application/json" });
      const a = document.createElement('a')
      a.href = URL.createObjectURL(file);
      a.download = "user.json";
      a.click();
      URL.revokeObjectURL(a.href);
    });
    document.getElementById("save-sw").addEventListener('click', async () => {
      const graphData = clientGraph.export();
      if (!graphData) throw new Error("No Data");
      window.localStorage.setItem("graphData", JSON.stringify(graphData));
      console.log("Graph data saved");
    });
    document.getElementById("reload-sw").addEventListener('click', async () => {
      const graphData = window.localStorage.getItem("graphData");
      if (!graphData) throw Error("No Saved Data");
      mapGraphWithGraphData(forceGraph3D, JSON.parse(graphData));
      mapGraphWithGraphData(graph2d, JSON.parse(graphData));
      console.log("Graph data reloaded");
    });
    document.getElementById('register-sw').addEventListener('click', async () => {
      const MQTT_USER = HDNodeWallet.createRandom().neuter();
      // const MQTT_BROKER_URL = 'http://test.mosquitto.org:8080'; // Update with your MQTT broker URL
      const MQTT_BROKER_URL = 'ws://127.0.0.1:3883'; // Update with your MQTT broker URL
      const MQTT_TOPIC = 'unity2d.com';
      if ('serviceWorker' in navigator) {
        console.log("Registering service worker")

        if (!("Notification" in window)) {
          // Check if the browser supports notifications
          alert("This browser does not support desktop notification");
        } else if (Notification.permission === "granted") {
          // Check whether notification permissions have already been granted;
          // if so, create a notification
          const title = "Service Worker";
          const body = `HEY! Your task "${title}" is now granted.`;
          const icon = "/favicon.ico";
          // const notification = new Notification(title, { body, icon });
          // toggleAnimation()
          try {
            const registration = await navigator.serviceWorker.register('./service-worker.js');
            // const notification = new Notification(title, { body, icon,silent:true });
            // console.log('Service Worker Registered:', registration);
            // Establish MQTT connection
            const client = mqtt.connect(MQTT_BROKER_URL);
            //  alert("client")
            client.on('connect', async () => {
              console.log('Connected to MQTT broker', {});
              new Notification(title, { body: "Connected to MQTT broker", icon })
              await client.subscribeAsync(MQTT_TOPIC + "/#");
              await client.publishAsync(`${MQTT_TOPIC}/${MQTT_USER.address}`, JSON.stringify(MQTT_USER));
              console.log('Subscribed to topic', MQTT_TOPIC + "/#");
            });

            // Listen for MQTT messages
            client.on('message', (topic, message) => {
              console.log('MQTT Message Received', topic, message.toString());
              if (topic.includes(MQTT_TOPIC) && topic.includes(MQTT_USER.address)) {
                // if (topic === MQTT_TOPIC) {
                const data = JSON.parse(message.toString());
                console.log('MQTT Message Received', data);

                // Send data to the service worker
                if (navigator.serviceWorker.controller) {
                  navigator.serviceWorker.controller.postMessage({
                    type: 'user-message',
                    payload: data,
                  });
                }
              }
            });
          } catch (error) {
            error('Failed to register service worker:', error);
          }
        } else if (Notification.permission !== "denied") {
          // We need to ask the user for permission
          Notification.requestPermission().then((permission) => {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
              console.log("Registering service worker")
            }
          });
        }
      } else {
        alert('Service workers are not supported in this browser.');
      }
    });
  });
});


// const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`, {
//   url: "https://example.org/",
//   referrer: "https://example.com/",
//   contentType: "text/html",
//   includeNodeLocations: true,
//   storageQuota: 10000000,
//   runScripts: "dangerously",
//   pretendToBeVisual: true,
//   resources: resourceLoader,
//   // virtualConsole
// });