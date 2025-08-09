// import * as THREE from 'three'
import { Html } from '@react-three/drei';
import { CalculatePosition } from '@react-three/drei/web/Html';
import { Object3D, Camera } from 'three';
const translate: CalculatePosition = (el: Object3D, camera: Camera, size: {
    width: number;
    height: number;
}) => {
    console.log(el)
    console.log(camera)
    console.log(size)
    return [10, 10,10,10]
}
export default function HTML() {//</Html> calculatePosition={translate}>
    return <Html distanceFactor={20} fullscreen={true}>
        <div id="sign" style={{ width: "fit-content", height: "fit-content", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div className="label" style={{ width: "100%", transform: "none" }}>Auth</div>
            <textarea className="form-control" defaultValue={"Ethers.js Operations"}></textarea>
            <div className='btn-group'>
                <button id='signMessageBtn' className='btn btn-secondary'>Sign Message</button>
                <button id='verifyMessageBtn' className='btn btn-success'>Verify Message</button>
            </div>
        </div>
    </Html>
}
