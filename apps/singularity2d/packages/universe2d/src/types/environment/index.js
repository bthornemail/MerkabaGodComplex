"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PubSubEnvironment = exports.Environment = exports.BaseEnvironment = void 0;
const ethers_1 = require("ethers");
const events_1 = __importDefault(require("events"));
const mqtt_1 = __importDefault(require("mqtt"));
const index_js_1 = require("../../../index.js");
const index_js_2 = require("../../../modules/broker/index.js");
const _host = ethers_1.HDNodeWallet.createRandom("", "m/0");
const _user = ethers_1.HDNodeWallet.fromPhrase("roast thank tiny coach seat ensure cruel auto shaft finish fee resemble");
const host = _host.neuter();
const user = _user.neuter();
// 1. Environment Layer:
// Responsibilities:
// Event and force management.
// Synchronizing blockchain ticks with user interactions.
// Maintaining a consistent state for the physics simulation and peer network.
// Data Structures:
// Event Blockchain: Tracks event sequences.
// Physics Graph: Captures spatial transformations over time.
class BaseEnvironment extends events_1.default {
    register({ broker, vault }) {
        broker ?? this.broker;
        vault ?? this.vault;
    }
    constructor(block) {
        super();
        this.vault = new index_js_1.Vault();
        this.eventListeners = {
            vault: [],
            broker: [],
            scgcn: [],
            blockchin: [],
            network: []
        };
        this.entity = ethers_1.HDNodeWallet.createRandom("", "m/0").extendedKey;
        this.broker = new index_js_2.Broker({
            entity: this.entity,
            content: {
                entity: ethers_1.HDNodeWallet.fromExtendedKey(this.entity).extendedKey,
                definitions: {
                    properties: {
                        brokerUrl: ["http://marketplace2d.com", "http://127.0.0.1"]
                    },
                    attributes: { ports: [3883] }
                }
            }
        });
        if (!block)
            return;
        const { entity } = block;
        if (!entity)
            return;
        const { hash, previous, signature, timestamp } = block;
        if (!hash || !previous || !signature || !timestamp)
            return;
        const { content } = block;
        if (!content)
            return;
        // this.entity = content.entity;
        this.broker = new index_js_2.Broker({
            entity: content.entity,
            content: {
                entity: content.entity,
                definitions: {
                    properties: {
                        brokerUrl: ["http://marketplace2d.com", "http://127.0.0.1"]
                    },
                    attributes: { ports: [3883] }
                }
            }
        });
    }
}
exports.BaseEnvironment = BaseEnvironment;
;
class Environment extends BaseEnvironment {
    register({ broker, vault, memory }) {
        super.register({ broker, vault });
        broker ?? this.broker;
        vault ?? this.vault;
    }
}
exports.Environment = Environment;
;
class PubSubEnvironment extends Environment {
    async connect() {
        // MQTT Configuration
        const MQTT_BROKER_URL = "mqtt://test.mosquitto.org:1883"; //'mqtt://localhost:1883'; // Update with your broker URL
        const MQTT_TOPIC = 'file/changes';
        const identity = ethers_1.HDNodeWallet.fromPhrase(process.env.PHRASE ?? "roast thank tiny coach seat ensure cruel auto shaft finish fee resemble").extendedKey;
        const protocol = "ws";
        const host = "127.0.0.1";
        let port = 8011;
        const client = mqtt_1.default.connect(MQTT_BROKER_URL);
        client.on('connect', async () => {
            console.log(`Connected to MQTT broker at ${MQTT_BROKER_URL}`);
            console.log(await client.subscribeAsync(MQTT_TOPIC));
            console.log(await client.publishAsync(MQTT_TOPIC, JSON.stringify({ event: 'connected', url: `${protocol}://${host}/${identity}:${port}`, identity })));
        });
        client.on("message", (topic, payload, packet) => {
            console.log({ topic, message: JSON.parse(new TextDecoder().decode(payload)), packet });
        });
    }
    constructor() {
        super();
    }
}
exports.PubSubEnvironment = PubSubEnvironment;
;
// export class EnvironmentUI extends Environment implements iIdentity {
//     width = 1080;
//     height = 1920;
//     scene = new THREE.Scene();
//     globe: THREE.Mesh;
//     people: Set<Person> = new Set();
//     shapes: Map<Person, THREE.Object3D> = new Map();
//     // views: Map<Person, PerspectiveCamera> = new Map();
//     camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
//     private events: EventEmitter = new EventEmitter();
//     // public on: ACTION = async (sources: Matrix4[], target: Matrix4) => {
//     // }
//     step: number = 0;
//     public join = async (person: Person) => {
//         const obj = new THREE.Object3D();
//         obj.position.set(person.definitions.attributes.position[0], person.definitions.attributes.position[1], person.definitions.attributes.position[2])
//         this.people.add(person);
//         this.shapes.set(person, obj)
//         // const geometry = new THREE.BoxGeometry(1, 1, 1);
//         // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
//         // const cube = new THREE.Mesh(geometry, material);
//         // this.events.emit("joined",person);
//         person.on("joined", (people) => {
//             // console.log(Array.from(this.people.values()).map((value)=>value.height))
//             console.log("Person joined", people.name)
//         });
//         person.on("action", (sources: THREE.Matrix4[], target: THREE.Matrix4) => {
//             for (const source of sources) {
//                 for (const people of this.shapes) {
//                     if (people[1].matrix === source) {
//                         people[1].applyMatrix4(target);
//                     }
//                 }
//             }
//             this.step++;
//         })
//         for (const people of this.people) {
//             if (people === person) return;
//             people.emit("joined", person);
//         }
//         this.scene.add(obj);
//     }
//     public leave = async (person: Person) => {
//         this.people.delete(person);
//         this.shapes.delete(person);
//         // this.events.emit("left",person);
//         for (const people of this.people) {
//             if (people === person) return;
//             people.emit("left", person);
//         }
//     }
//     async define(entity: string, action: (definitions: {
//         properties?: { [key: string]: string; };
//         attributes?: { [value: string]: number[]; };
//         parameters?: { [param: string]: (string | number)[]; };
//     }) => void) {
//         for (const person of this.people) {
//             person.on(entity, action);
//             // this.actions.set(entity, action);
//         }
//     }
//     animate() {
//         for (const [person, shape] of this.shapes) {
//             const translate = new THREE.Vector3(
//                 Math.random() > .5 ? Math.random() : Math.random() * -1,
//                 Math.random() > .5 ? Math.random() : Math.random() * -1,
//                 Math.random() > .5 ? Math.random() : Math.random() * -1
//             )
//             // shape.translateX(translate.x);
//             // shape.translateY(translate.y);
//             // shape.translateZ(translate.z);
//             const matrix = new THREE.Matrix4()
//             matrix.setPosition(translate);
//             shape.applyMatrix4(matrix);
//             console.log(person.name, shape.position.x, shape.position.y, shape.position.z);
//             // console.log(person.name, matrix.elements);
//         }
//     }
//     async connect() {
//         // await ngrok.authtoken("7pokcWyw8pGbxw6daKiYE_3xPiaTA2qpLnDhtLooBk1");
//         // //   const listener = await ngrok.forward("8080");
//         // //    const listener1 = await ngrok.forward("11434");
//         // const listener = await ngrok.forward({
//         //   addr: 8080,
//         //   authtoken: "7pokcWyw8pGbxw6daKiYE_3xPiaTA2qpLnDhtLooBk1",
//         //   // onStatusChange: (addr, error) => {
//         //   //     console.log(`disconnected, addr ${addr} error: ${error}`);
//         //   // }
//         // }).then((lis) => {
//         //   console.log("Ingress established listener at: " + lis.url());
//         // });
//         setInterval(() => {
//             this.animate();
//         }, 3500);
//         // const app = express();
//         // app.get("/", (req, res) => {
//         //   res.send("Hello World!");
//         // });
//         // const server = require("http").createServer(function (req, res) {
//         //   res.writeHead(200).write("Hello");
//         //   res.end();
//         // });
//         // ngrok.listen(server)
//         // .then(() => {
//         //   console.log("Ingress established listener at: " + server.listener.url());
//         // });
//         // console.log(`Ingress established at: ${listener.url()}`);
//         // setInterval(() => {
//         //   this.animate();
//         // }, 3500);
//         //console.log(`Ingress established at: ${listener1.url()}`);
//     }
//     constructor() {
//         super();
//         // Create sphere geometry for the globe
//         const radius = 5;
//         const sphereGeometry = new THREE.SphereGeometry(radius, 32, 64);
//         const sphereMaterial = new THREE.MeshBasicMaterial({
//             color: 0x0000ff,
//             wireframe: true
//         });
//         const globe = this.globe = new THREE.Mesh(sphereGeometry, sphereMaterial);
//         this.scene.add(globe);
//         // Define locations
//         const locations = [
//             { name: 'New York', lat: 40.7128, lon: -74.0060, altitude: 8 },
//             { name: 'Tokyo', lat: 35.6762, lon: 139.6503, altitude: 5.6 },
//             { name: 'Sydney', lat: -33.8688, lon: 151.2093, altitude: 100 }
//         ];
//         // Add location markers
//         locations.forEach(location => {
//             // Create a small sphere as a marker
//             const markerGeometry = new THREE.TetrahedronGeometry(1);
//             const markerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
//             const marker = new THREE.Mesh(markerGeometry, markerMaterial);
//             // Position the marker on the globe
//             const position = getPositionOnSphere(radius, location.lat, location.lon);
//             // console.log(position)
//             marker.position.copy(position);
//             // Add marker to the scene
//             this.globe.add(marker);
//         });
//         // Position camera
//         this.camera.position.z = 10;
//     }
// };
// export class EnvironmentUIBak {
//     events: { [key: string]: EventCallback[] } = {};
//     graph: ENV_GRAPH;
//     blockchain: EnvBlockchain;
//     on(event: string, listener: (...args: any[]) => void) { //EventCallback) {
//         if (!this.events[event]) {
//             this.events[event] = [];
//         }
//         this.events[event].push(listener);
//     };
//     emit(event: string, data?: any) {
//         if (this.events[event]) {
//             this.events[event].forEach(listener => listener(data));
//         }
//     };
//     add(path: string, identity: string, actor: Record<string, any> = {}, action: (...parameters: any[]) => any = (path: string, ...steps: string[]) => null, space: [][] = [[], []], time: number = Date.now()) {
//         this.graph.controller.addNode(identity, { actor, action, space, time });
//         const leaf = this.blockchain.merkleTree.bufferify(identity);
//         this.blockchain.merkleTree.addLeaf(leaf);
//         // this.graph.nodes.push({ key: identity, state: data });
//         // this.graph.layers.push({ key: identity, attributes: data, transform: {} })
//     }
//     update(path: string, identity: string, actor: Record<string, any> = {}, action: (...parameters: any[]) => any = (path: string, ...steps: string[]) => null, space: [][] = [[], []], time: number = Date.now()) {
//         this.graph.controller.addNode(identity, { actor, action, space, time });
//         const leaf = this.blockchain.merkleTree.bufferify(identity);
//         this.blockchain.merkleTree.addLeaf(leaf);
//         // this.graph.nodes.push({ key: identity, state: data });
//         // this.graph.layers.push({ key: identity, attributes: data, transform: {} })
//     }
//     set(path: string, identity: string, actor: Record<string, any>, action: (...parameters: any[]) => any = (path: string, ...steps: string[]) => null, space: [][] = [[], []], time: number = Date.now()) {
//         this.graph.controller.addNode(identity, { actor, action, space, time });
//         const leaf = this.blockchain.merkleTree.bufferify(identity);
//         this.blockchain.merkleTree.addLeaf(leaf);
//         // this.graph.nodes.push({ key: identity, state: data });
//         // this.graph.layers.push({ key: identity, attributes: data, transform: {} })
//     }
//     get(path: string, identity: string, actor: Record<string, any>, action: (...parameters: any[]) => any = (path: string, ...steps: string[]) => null, space: [][] = [[], []], time: number = Date.now()) {
//         // this.graph.nodes.push({ key: identity, state: data });
//         // this.graph.layers.push({ key: identity, attributes: data, transform: {} })
//     }
//     search(path: string, identity: string) {
//         // this.graph.nodes.push({ key: identity, state: data });
//         // this.graph.layers.push({ key: identity, attributes: data, transform: {} })
//     }
//     view(path: string, identity: string) {
//         // this.graph.nodes.push({ key: identity, state: data });
//         // this.graph.layers.push({ key: identity, attributes: data, transform: {} })
//     }
//     constructor() {
//         this.graph = new MultiGraph();
//         this.blockchain = new EnvBlockchain();
//         // this.on("set",this.set);
//         // this.on("get",this.get);
//     };
// }
//# sourceMappingURL=index.js.map