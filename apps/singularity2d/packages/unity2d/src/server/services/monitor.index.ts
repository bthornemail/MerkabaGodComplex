
import ngrok from '@ngrok/ngrok';
import * as readline from 'readline';
import Graphology from 'graphology'
import { MerkleTree } from 'merkletreejs';
import { HDNodeWallet } from 'ethers';
import { Worker } from 'node:worker_threads'
import ollama from "ollama";
import * as THREE from 'three';
import { Vector3, Matrix4, Object3D, Scene, Raycaster, Mesh, PerspectiveCamera } from "three";
import EventEmitter from 'node:events';
import { readFileSync } from 'node:fs';
import * as mqtt from 'mqtt';
import frontMatter from "front-matter";
import express, { Request, Response } from "express";
import { join } from 'node:path';
export type ENV_VALUE = number;
export type ENV_VARIABLE = string;
export type ENV_PARAMETERS = { [variable: ENV_VARIABLE]: ENV_VALUE };
export type ENV_ENTITY = string;
export type ENV_IDENTITY = string;
export type ENV_SIGNATURE = string;

export type ENV_REFERENCES = {
  [entity: ENV_ENTITY]: [
    actor: ENV_ACTOR,
    action: ENV_ACTION,
    space: ENV_SPACE,
    time: ENV_TIME
  ]
};
// export type ENV_REFERENCES = { [entity: ENV_ENTITY]: ENV_IDENTITY };
export type ENV_OBSERVATION = string;
export type ENV_VECTOR = number[];
export type ENV_ATTRIBUTES = { [observation: ENV_OBSERVATION]: ENV_VECTOR };
export type ENV_NAME = string;
export type ENV_TYPE = string;
export type ENV_PROPERTIES = { [type: ENV_TYPE]: ENV_NAME };
export type ENV_DEFINITIONS = {
  parameters: ENV_PARAMETERS;
  references: ENV_REFERENCES;
  attributes: ENV_ATTRIBUTES;
  properties: ENV_PROPERTIES;
}
export type ENV_DEFINITION_PARAMS = {
  parameters?: ENV_PARAMETERS;
  references?: ENV_REFERENCES;
  attributes?: ENV_ATTRIBUTES;
  properties?: ENV_PROPERTIES;
}
// Predefined Protocol layers

export type ENV_PEER = string;
export type ENV_USER = string;
export type ENV_PATH = string;
export type ENV_PROXY = string;
export type ENV_CONNECTIONS = { [path: ENV_PATH]: [proxy: ENV_PROXY, peer: ENV_PEER] };

// Status
export type ENV_ACTION = string;
export type ENV_ACTOR = string;
export type ENV_SPACE = string;
export type ENV_TIME = number;
export interface ENV_CONTENT_NODE_STATUS {
  actor: ENV_ACTOR;
  action: ENV_ACTION;
  space: ENV_SPACE;
  time: ENV_TIME;
};


export type ENV_URL = {
  protocol: string;
  host: string;
  port: number;
  path?: string;
  query?: string;
};

class Define extends EventEmitter {
  definitions: {
    properties: { [key: string]: string }
    attributes: { [value: string]: number[] }
    refereneces: { [entity: string]: [code: string, source: string] }
  };
  actions: Map<string, (definitions: {
    properties?: { [key: string]: string };
    attributes?: { [value: string]: number[] };
    parameters?: { [param: string]: (string | number)[] }
  }) => void> = new Map();

  async define(entity: string, action: (definitions: {
    properties?: { [key: string]: string; };
    attributes?: { [value: string]: number[]; };
    parameters?: { [param: string]: (string | number)[]; };
  }) => void) {
    this.on(entity, action);
    // action.arguments(Object.assign({}, action.arguments.properties, { identity: entity + "-" + Date.now() }))
    // action.arguments.properties = Object.assign({}, action.arguments.properties, { identity: entity + "-" + Date.now() });
    this.actions.set(entity, action);
  }
  constructor() {
    super();
    this.definitions = {
      properties: {},
      attributes: {},
      refereneces: {}
    }
  }
}
class Person extends Define {
  name: string;
  width = 1080;
  height = 1920;
  camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
  definitions: {
    properties: { [key: string]: string }
    attributes: { [value: string]: number[] }
    refereneces: { [entity: string]: [code: string, source: string] }
  };
  actions: Map<string, (definitions: {
    properties?: { [key: string]: string };
    attributes?: { [value: string]: number[] };
    parameters?: { [param: string]: (string | number)[] }
  }) => void> = new Map();
  public do = (action: string, definitions: {
    properties?: { [key: string]: string }
    attributes?: { [value: string]: number[] }
  }) => {
    if (!this.actions.has(action)) return this.emit(this.name, action, definitions);
    const process = this.actions.get(action)!;
    process(definitions);
  }
  // async (sources: Matrix4[], target: Matrix4) => {
  //     this.emit("action", sources, target)
  // }

  async define(entity: string, action: (definitions: {
    properties?: { [key: string]: string; };
    attributes?: { [value: string]: number[]; };
    parameters?: { [param: string]: (string | number)[]; };
  }) => void) {
    // action.arguments(Object.assign({}, action.arguments.properties, { identity: entity + "-" + Date.now() }))
    // action.arguments.properties = Object.assign({}, action.arguments.properties, { identity: entity + "-" + Date.now() });
    this.actions.set(entity, action);
  }
  public view = async (targets: Object3D[]) => {
    const targetPosition = targets.reduce((accum, target) => {
      console.log({ accum, target })
      return target.position.addVectors(accum, target.position)
    }, new Vector3());
    console.log({ targetPosition })
    const raycaster = new THREE.Raycaster(
      new Vector3(this.definitions.attributes.position[0], this.definitions.attributes.position[0], this.definitions.attributes.position[0]),
      targetPosition
    );
    const pointer = new THREE.Vector2();
    raycaster.setFromCamera(pointer, this.camera);
    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(targets);

    for (let i = 0; i < intersects.length; i++) {
      console.log(intersects[i].object.visible)//material.color.set(0xff0000);
      // intersects[i].object.material.color.set(0xff0000);
    }

  }
  constructor({ name, coords }: { name: string, coords: { latitude: number, longitude: number, altitude: number } }) {
    super();
    const { latitude, longitude, altitude } = coords;
    this.name = name;
    const globalPosition = convertCoordinatesToXYZ(latitude, longitude, altitude, 1);
    this.definitions = {
      properties: {
      },
      attributes: {
        position: [globalPosition[0], globalPosition[1], globalPosition[2]],
        // coords: [33.9760647, -118.2870106, 8]
      },
      refereneces: {}
    }
    this.camera.position.z = 5;
    this.on("observe", () => {

    })
  }
}
function convertCoordinatesToXYZ(lat: number, lon: number, alt: number, earthRadius: number = 6371000): [number, number, number] {
  // const earthRadius = 6371000; // Radius of the Earth in meters

  const latRad = lat * (Math.PI / 180);
  const lonRad = lon * (Math.PI / 180);

  const x = (earthRadius + alt) * Math.cos(latRad) * Math.cos(lonRad);
  const y = (earthRadius + alt) * Math.cos(latRad) * Math.sin(lonRad);
  const z = (earthRadius + alt) * Math.sin(latRad);

  return [x, y, z];
}
function getPositionOnSphere(
  radius: number,
  lat: number,
  lon: number
): THREE.Vector3 {
  // Convert to radians
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  // Calculate 3D coordinates
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
}
function addLocationMarker(
  scene: THREE.Scene,
  radius: number,
  lat: number,
  lon: number,
  color: number = 0xff0000,
  size: number = 0.1
) {
  const markerGeometry = new THREE.SphereGeometry(size, 16, 16);
  const markerMaterial = new THREE.MeshBasicMaterial({ color });
  const marker = new THREE.Mesh(markerGeometry, markerMaterial);

  const position = getPositionOnSphere(radius, lat, lon);
  marker.position.copy(position);

  scene.add(marker);
  return marker;
}
class Environment extends Define {
  width = 1080;
  height = 1920;
  scene = new THREE.Scene();
  globe: Mesh;
  people: Set<Person> = new Set();
  shapes: Map<Person, Object3D> = new Map();
  // views: Map<Person, PerspectiveCamera> = new Map();
  camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);

  private events: EventEmitter = new EventEmitter();
  // public on: ACTION = async (sources: Matrix4[], target: Matrix4) => {
  // }

  step: number = 0;
  public join = async (person: Person) => {
    const obj = new Object3D();
    obj.position.set(person.definitions.attributes.position[0], person.definitions.attributes.position[1], person.definitions.attributes.position[2])
    this.people.add(person);
    this.shapes.set(person, obj)
    // const geometry = new THREE.BoxGeometry(1, 1, 1);
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // const cube = new THREE.Mesh(geometry, material);
    // this.events.emit("joined",person);
    person.on("joined", (people) => {
      // console.log(Array.from(this.people.values()).map((value)=>value.height))
      console.log("Person joined", people.name)
    });
    person.on("action", (sources: Matrix4[], target: Matrix4) => {
      for (const source of sources) {
        for (const people of this.shapes) {
          if (people[1].matrix === source) {
            people[1].applyMatrix4(target);
          }
        }
      }
      this.step++;
    })
    for (const people of this.people) {
      if (people === person) return;
      people.emit("joined", person);
    }
    this.scene.add(obj);
  }
  public leave = async (person: Person) => {
    this.people.delete(person);
    this.shapes.delete(person);
    // this.events.emit("left",person);
    for (const people of this.people) {
      if (people === person) return;
      people.emit("left", person);
    }
  }
  async define(entity: string, action: (definitions: {
    properties?: { [key: string]: string; };
    attributes?: { [value: string]: number[]; };
    parameters?: { [param: string]: (string | number)[]; };
  }) => void) {
    for (const person of this.people) {
      person.on(entity, action);
      // this.actions.set(entity, action);
    }
  }
  animate() {
    for (const [person, shape] of this.shapes) {
      const translate = new Vector3(
        Math.random() > .5 ? Math.random() : Math.random() * -1,
        Math.random() > .5 ? Math.random() : Math.random() * -1,
        Math.random() > .5 ? Math.random() : Math.random() * -1
      )
      // shape.translateX(translate.x);
      // shape.translateY(translate.y);
      // shape.translateZ(translate.z);
      const matrix = new Matrix4()
      matrix.setPosition(translate);
      shape.applyMatrix4(matrix);
      console.log(person.name, shape.position.x, shape.position.y, shape.position.z);
      // console.log(person.name, matrix.elements);
    }
  }
  async connect() {
    // await ngrok.authtoken("7pokcWyw8pGbxw6daKiYE_3xPiaTA2qpLnDhtLooBk1");
    // //   const listener = await ngrok.forward("8080");
    // //    const listener1 = await ngrok.forward("11434");

    // const listener = await ngrok.forward({
    //   addr: 8080,
    //   authtoken: "7pokcWyw8pGbxw6daKiYE_3xPiaTA2qpLnDhtLooBk1",
    //   // onStatusChange: (addr, error) => {
    //   //     console.log(`disconnected, addr ${addr} error: ${error}`);
    //   // }
    // }).then((lis) => {
    //   console.log("Ingress established listener at: " + lis.url());
    // });
    setInterval(() => {
      this.animate();
    }, 3500);
    // const app = express();

    // app.get("/", (req, res) => {
    //   res.send("Hello World!");
    // });

    // const server = require("http").createServer(function (req, res) {
    //   res.writeHead(200).write("Hello");
    //   res.end();
    // });
    // ngrok.listen(server)
    // .then(() => {
    //   console.log("Ingress established listener at: " + server.listener.url());
    // });
    // console.log(`Ingress established at: ${listener.url()}`);

    // setInterval(() => {
    //   this.animate();
    // }, 3500);
    //console.log(`Ingress established at: ${listener1.url()}`);
  }
  constructor() {
    super();
    // Create sphere geometry for the globe
    const radius = 5;
    const sphereGeometry = new THREE.SphereGeometry(radius, 32, 64);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x0000ff,
      wireframe: true
    });
    const globe = this.globe = new THREE.Mesh(sphereGeometry, sphereMaterial);
    this.scene.add(globe);
    // Define locations
    const locations = [
      { name: 'New York', lat: 40.7128, lon: -74.0060, altitude: 8 },
      { name: 'Tokyo', lat: 35.6762, lon: 139.6503, altitude: 5.6 },
      { name: 'Sydney', lat: -33.8688, lon: 151.2093, altitude: 100 }
    ];
    // Add location markers
    locations.forEach(location => {
      // Create a small sphere as a marker

      const markerGeometry = new THREE.TetrahedronGeometry(1);
      const markerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);

      // Position the marker on the globe
      const position = getPositionOnSphere(radius, location.lat, location.lon);
      // console.log(position)
      marker.position.copy(position);

      // Add marker to the scene
      this.globe.add(marker);
    });

    // Position camera
    this.camera.position.z = 10;
  }
};
// (async () => {
//   // const model = "graph-broker";
//   // const modelfile = _modelfile ?? readFileSync("./graph-broker.modelfile", "utf8");
//   // const modelScript = readFileSync("./env.graph.worker.ts", "utf8");
//   // const models = await ollama.list();
//   // if (!models.models.find(savedModel => savedModel.name.toLowerCase().includes(model))) {
//   //   const botResponse = await ollama.create({ model, modelfile, stream: true })
//   //   process.stdout.write("Creating new model: ")
//   //   process.stdout.write(model)
//   //   for await (const part of botResponse) {
//   //     // console.log(part.status)
//   //     process.stdout.write(".")
//   //   }

//   //   process.stdout.write("created")
//   //   console.log()
//   // }
//   //throw new Error("Create Model f`irst");
//   // const agent = new Worker(modelScript, {
//   //   eval: true,
//   //   workerData: {
//   //     name: model,
//   //     model: model,
//   //     messages: [{ role: "system", content: `Graph Data:\n${JSON.stringify(Object.assign({}, g))}` }],
//   //     // messages: [{role:"user",content:readFileSync("./env.graph.ts", "utf8")}],
//   //     graphData: { nodes: g.nodes },
//   //     buffer: g.dynamicBuffer,
//   //     // position: g.position,
//   //     // size: 2048,
//   //     nodes: [node1, node2, node3]
//   //   }
//   // });
//   // agent.on('online', () => {
//   //   console.log("Agent Online");
//   //   // agent.postMessage({ status: true });
//   //   agent.postMessage({ chat: "Can you tell me what nodes are in the graph" });
//   // })

//   // agent.on('message', (message) => {
//   //   // if(message.status){
//   //   console.log(message)
//   //   // }
//   //   // agent.postMessage({status: true});
//   // })
//   // process.on("SIGINT", () => {
//   //   ollama.delete({ model: "graph-broker:latest" });
//   // })
// })();

(async () => {
  // MQTT Configuration
  const MQTT_BROKER_URL = "mqtt://test.mosquitto.org:1883";//'mqtt://localhost:1883'; // Update with your broker URL
  const MQTT_TOPIC = 'file/changes';
  const identity = "obsidian-watcher";
  const protocol = "ws";
  const host = "127.0.0.1";
  let port = 8888;

  const client = mqtt.connect(MQTT_BROKER_URL);
  client.on('connect', async () => {
    console.log(`Connected to MQTT broker at ${MQTT_BROKER_URL}`);
    console.log(await client.subscribeAsync(MQTT_TOPIC));
    // setTimeout(async ()=>{
    const listener = await ngrok.forward({
      addr: port,
      authtoken: "7pokcWyw8pGbxw6daKiYE_3xPiaTA2qpLnDhtLooBk1",
      // onStatusChange: (addr, error) => {
      //     console.log(`disconnected, addr ${addr} error: ${error}`);
      // }
    });
    console.log(await client.publishAsync(MQTT_TOPIC, JSON.stringify({ event: 'connected', url: listener.url(), identity })));
    console.log("Ingress established listener at: " + listener.url());
  });
  client.on("message", (topic, payload, packet) => {
    switch (topic) {
      case MQTT_TOPIC:
        console.log({ topic, message: JSON.parse(new TextDecoder().decode(payload)), packet })
        break;

      default:
        break;
    }
  })
  const app = express();
  app.set("trust proxy", true);
  app.use(express.json());
  app.use((req: Request, res: Response, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
  });

  app.use(express.urlencoded({ extended: true }));
  app.use((req: Request, res: Response, next) => {
    if (req.path.startsWith("/obsidian")) return next();
    res.sendStatus(404);
    console.log("req.path", req.path)
    client.publish(`get/${req.path}`, JSON.stringify({ event: 'change' }));
  });

  app.use("/obsidian", express.static(join(import.meta.dirname, "./public/monitor")));

  app.listen(port, () => {
    console.log(`${identity}: HTTP Server on http://${host}:${port}`);
  });
})();