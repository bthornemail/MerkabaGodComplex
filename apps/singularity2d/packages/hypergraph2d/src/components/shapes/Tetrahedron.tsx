import * as THREE from 'three'
import {  useRef, useState } from 'react'
import {  ThreeElements, useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei';

export default function Tetrahedron(props: ThreeElements['mesh']) {
    const ref = useRef<THREE.Mesh>(null!)
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)
    useFrame((state, delta) => (ref.current.rotation.x += delta));
    return <mesh
        {...props}
        ref={ref}
        scale={clicked ? 1.5 : 1}
        onClick={(event) => click(!clicked)}
        onPointerOver={(event) => hover(true)}
        onPointerOut={(event) => hover(false)}>
        <tetrahedronGeometry args={[1]} />
        <meshStandardMaterial color={hovered ? 'hotpink' : 'green'} wireframe={true} />
        <Html distanceFactor={10}>
            <div className="label">
                {props.children}
            </div>
        </Html>
    </mesh>;
}