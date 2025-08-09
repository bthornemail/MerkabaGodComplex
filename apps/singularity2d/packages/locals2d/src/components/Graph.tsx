
import { useRef, useState } from 'react';
import * as THREE from 'three'
import { GraphContext } from '../hooks/hypergraph/useGraph';
// import { Html } from '@react-three/drei';
import { Html, Sphere } from '@react-three/drei';
import { useContext } from 'react';

export default function Graph() {
    const {
        entity, identity,
        options, attributes,
        nodes, edges,
        add, append, show, hide
    } = useContext(GraphContext);
    const ref = useRef<THREE.Mesh>(null!)
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false);
    const [scale, setScale] = useState(1);
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
    return nodes ? Object.entries(nodes).map(([key, value], index) => {
        return <mesh
            key={index}
            position={[0, 0, 0]}
            ref={ref}
            scale={clicked ? 1.5 : 1}
            onClick={(event) => click(!clicked)}
            onPointerOver={(event) => hover(true)}
            onPointerOut={(event) => hover(false)}>
            <meshStandardMaterial color={hovered ? 'red' : 'blue'} />
            <dodecahedronGeometry args={[1]} />

            {/* <Text
        position={[0, 0, 0]}
        color="black"
        fontSize={.15}
        anchorX="center"
        anchorY="middle">
        { "Semantic Graph"}
    </Text> */}
            <Html distanceFactor={10}>
                <div className='label'>
                    <div>{key}</div>
                </div>
            </Html>
        </mesh>
    })
        : <Sphere position={[0, 0, 0]}>
            <Html distanceFactor={10}>
                <div className="card" style={{ height: "fit-content" }}>
                    Hello
                </div>
            </Html>
        </Sphere>
}
