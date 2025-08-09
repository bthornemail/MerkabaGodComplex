
import { useRef, useState } from 'react';
import * as THREE from 'three'
import { GRAPH_PARAMETERS } from '../hooks/hypergraph/useGraph';
// import { Html, Text } from '@react-three/drei';

export default function Graph({
    entity, identity,
    options, attributes,
    nodes, edges, links, layers,
    // add, append, show, hide
}: GRAPH_PARAMETERS) {
    // const { isConnected, message, bind, register, publish, subscribe } = useMqtt({ url: "ws://127.0.0.1:3883", topic: entity }) as any;
    // const [attributes, setAttributes] = useState<Attributes>({});
    // const [options, setOptions] = useState<Attributes>({});
    // const [nodes, setNodes] = useState<NodeEntry[]>([]);
    // const [edges, setEdges] = useState<EdgeEntry[]>([]);

    const ref = useRef<THREE.Mesh>(null!)
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)
    // useEffect(() => {
    //     if (isConnected) {
    //         console.log("Ready to broadcast");
    //         subscribe(`${entity}/#`)
    //     }
    // }, [isConnected]);


    // useEffect(() => {
    //     if (entity) {
    //         console.log("Ready to broadcast");
    //         bind(entity)
    //     }
    // }, [entity]);
    // useEffect(() => {
    //     if (identity) {
    //         console.log("Ready to broadcast");
    //         register(identity)
    //     }
    // }, [identity]);


    // useEffect(() => {
    //     if (!nodes) return;
    //     setNodes(nodes);
    //     publish(`${identity}/nodes`, JSON.stringify(nodes));
    // }, [nodes])
    // useEffect(() => {
    //     if (!attributes) return;
    //     setAttributes(attributes);
    //     publish(`${identity}/attributes`, JSON.stringify(attributes));
    // }, [attributes])
    // useEffect(() => {
    //     if (!edges) return;
    //     setEdges(edges);
    //     publish(`(${identity}/edges`, JSON.stringify((edges)));
    // }, [edges])
    // useEffect(() => {
    //     if (!options) return;
    //     setOptions(options);
    //     publish(`${identity}/options`, JSON.stringify(options));
    // }, [options])

    // useEffect(() => {
    //     if (message) {
    //         const graphData = JSON.parse(message as string);
    //         graphData.nodes && setNodes(nodes)
    //         graphData.attributes && setAttributes(graphData.attributes)
    //         graphData.options && setOptions(graphData.options)
    //         graphData.edges && setEdges(graphData.edges)
    //     }
    // }, [message]);
    return <mesh
        position={[0, 0, 0]}
        ref={ref}
        scale={clicked ? 1.5 : 1}
        onClick={(event) => click(!clicked)}
        onPointerOver={(event) => hover(true)}
        onPointerOut={(event) => hover(false)}>
        <meshStandardMaterial color={hovered ? 'red' : 'blue'} />
        <dodecahedronGeometry args={[1]} />
        {/* <Html distanceFactor={20}>
            <div id="sign" style={{ height:"fit-content" }}>
                <textarea className="form-control" defaultValue={"Ethers.js Operations"}></textarea>
                <div className='btn-group'>
                    <button id='signMessageBtn' className='btn btn-secondary'>Sign Message</button>
                    <button id='verifyMessageBtn' className='btn btn-success'>Verify Message</button>
                </div>
            </div>
        </Html> */}
        {/* <Text
            position={[0, 0, 0]}
            color="black"
            fontSize={.15}
            anchorX="center"
            anchorY="middle">
            { "Semantic Graph"}
        </Text> */}
        {JSON.stringify({
            entity, identity,
            options, attributes,
            nodes, edges, links, layers
        })}
        {/* <div>entity: {entity}</div> */}
        {/* <div>identity: {identity}</div> */}

        {/* {isConnected && <Sphere position={[1, 1, 0]}>
            <div>{identity}</div>
        </Sphere>}

        {nodes.map((node) => {
            <Tetrahedron position={[3, 3, 0]}>
                {node.node}
                {JSON.stringify(node.attributes)}
            </Tetrahedron>
        })} */}
    </mesh>
}
