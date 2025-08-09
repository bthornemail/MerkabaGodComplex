
import * as THREE from "three";
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei';
import Graph from './Graph';
import { GraphContext } from '../hooks/hypergraph/useGraph';
import { useContext } from 'react';

export default function Observer() {
    const graph = useContext(GraphContext);
    return <Canvas>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <pointLight position={[10, 10, 10]} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

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
        {/* <HTML /> */}
        <Graph />
        {/* <Html distanceFactor={10}>
            {graph?.nodes && Array.from(graph.nodes).map(([node, value]: any) => {
                console.log("nodess")
                return <div>
                    {node}
                    <hr />
                    {value && Object.entries(value).map((attr) => {
                        return <li>{attr[0]}: {JSON.stringify(attr[1])}</li>
                    })}
                </div>
            })}
        </Html> */}
    </Canvas>
}
