import * as THREE from 'three'
import { Html } from "@react-three/drei"
import { ThreeElements, useFrame } from "@react-three/fiber"
import { useRef, useState } from "react"

// html
export default function Sphere(props:{ position: ThreeElements['mesh'],children:any} & any) {
    const ref = useRef<THREE.Mesh>(null!)
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)
    useFrame((state, delta) => (ref.current.rotation.x += delta))

    return (
        <mesh
            {...props}
            ref={ref}
            scale={clicked ? 1.5 : 1}
            onClick={(event) => click(!clicked)}
            onPointerOver={(event) => hover(true)}
            onPointerOut={(event) => hover(false)}>
            <sphereGeometry args={[1, 64, 32]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} wireframe={true}/>
            <Html distanceFactor={10}>
                <div className="label">
                    {props.children}
                </div>
            </Html>
        </mesh>
    )
}