
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { Text, Html } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react'
import { OrbitControls } from '@react-three/drei';
import { Attributes, EdgeEntry, NodeEntry, SerializedGraph } from 'graphology-types';
import Sphere from './shapes/Sphere';
import Tetrahedron from './shapes/Tetrahedron';
import { useMqtt } from '../hooks/useMqtt';
import Graph from './Graph';
export type HYPERGRAPH_KEY = { entity: string; identity: string; signature?: string; password?: string }
export type HYPERGRAPH_PARAMETERS = { entity: string; identity: string; data: SerializedGraph; timestamp: number; }
export type HYPERGRAPH_PATH = { entity: string; root?: string; hash: string; signature: number;}
export type HYPERGRAPH_HANDLER = (params: HYPERGRAPH_PARAMETERS)=>HYPERGRAPH_PATH

export default function HyperGraph({ entity, identity }: { entity: string; identity: string; }) {
    const { isConnected, message, bind, register, publish, subscribe } = useMqtt({ url: "ws://127.0.0.1:3883", topic: entity }) as any;
    // const [attributes, setAttributes] = useState<Attributes>({});
    // const [options, setOptions] = useState<Attributes>({});
    // const [nodes, setNodes] = useState<NodeEntry[]>([]);
    // // const [edges, setEdges] = useState<EdgeEntry[]>([]);
    const [layers, setLayers] = useState<Map<string,SerializedGraph>>(new Map());//</MapSerializedGraph>{entity: string,id: string,node:NodeEntry[],edges: EdgeEntry[]}[]>([]);
    const [graph, setGraph] = useState<Map<string,SerializedGraph>>(new Map());//</MapSerializedGraph>{entity: string,id: string,node:NodeEntry[],edges: EdgeEntry[]}[]>([]);
    const [hyperGraph, setHyperGraph] = useState<Map<string,SerializedGraph>>(new Map());//</MapSerializedGraph>{entity: string,id: string,node:NodeEntry[],edges: EdgeEntry[]}[]>([]);

    const ref = useRef<THREE.Mesh>(null!)
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)
    useEffect(() => {
        if (isConnected) {
            console.log("Ready to broadcast");
            subscribe(`${entity}/#`)
        }
    }, [isConnected]);


    useEffect(() => {
        if (entity) {
            console.log("Ready to broadcast");
            bind(entity)
        }
    }, [entity]);
    useEffect(() => {
        if (identity) {
            console.log("Ready to broadcast");
            register(identity)
        }
    }, [identity]);


    useEffect(() => {
        if (!hyperGraph) return;
        setHyperGraph(hyperGraph);
        publish(`${identity}/hyperGraph`, JSON.stringify(hyperGraph));
    }, [hyperGraph])
    useEffect(() => {
        if (!layers) return;
        setLayers(layers);
        publish(`(${identity}/layers`, JSON.stringify((layers)));
    }, [layers])
    useEffect(() => {
        if (!graph) return;
        setGraph(graph);
        publish(`${identity}/nodes`, JSON.stringify(graph));
    }, [graph])

    useEffect(() => {
        if (message) {
            const graphData: SerializedGraph = JSON.parse(message as string);
            // graphData.nodes && setNodes(nodes)
            // graphData.attributes && setAttributes(graphData.attributes)
            // graphData.options && setOptions(graphData.options)
            // graphData.edges && setEdges(graphData.edges)
        }
    }, [message]);
    function view(topic: string) {
        subscribe(topic)
    }
    const propagate:HYPERGRAPH_HANDLER = ({ entity, identity, data,timestamp })=>{
        
    this.encodingLayer = new MerkleTree([], sha256, { isBitcoinTree: true, hashLeaves: true });
    this.hash = sha256(this.encodingLayer.bufferify(this.key));
    this.signature = HDNodeWallet.fromPhrase(phrase).signMessageSync(this.hash);
    this.encodingLayer.addLeaf(this.encodingLayer.bufferify(this.key));
        return {entity,root,hash,signature}
    }
    return <Canvas>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />

        {/* Orbit Controls */}
        <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={20}
            panSpeed={0.5}
            zoomSpeed={0.5}
            rotateSpeed={0.5}
            makeDefault={true}
        />
        <mesh
            position={[0, 0, 0]}
            ref={ref}
            scale={clicked ? 1.5 : 1}
            onClick={(event) => click(!clicked)}
            onPointerOver={(event) => hover(true)}
            onPointerOut={(event) => hover(false)}>
            <dodecahedronGeometry args={[1]} />
            <meshStandardMaterial color={hovered ? 'reds' : 'green'} wireframe={true} />
            <Text
                position={[0, 0, 0]}
                color="black"
                fontSize={.15}
                anchorX="center"
                anchorY="middle">
                {entity || "Semantic Graph"}
            </Text>
        </mesh>
        {Array.from(layers).map((layer)=>{
            return <Graph entity={entity} identity={identity} propagate={propagate} key={""}/>
        })}
        {isConnected && <Sphere position={[1, 1, 0]}>
            <div>{identity}</div>
        </Sphere>}

        {nodes.map((node) => {
            <Tetrahedron position={[3, 3, 0]}>
                {node.node}
                {JSON.stringify(node.attributes)}
            </Tetrahedron>
        })}
        {/* <Html distanceFactor={10}>
                <div className="label">

                    <Text
                        position={[0, 0, 0]}
                        color="black"
                        fontSize={.15}
                        anchorX="center"
                        anchorY="middle">
                        {entity || "Semantic Graph"}
                    </Text>
                </div>
            </Html> */}
    </Canvas>
}
