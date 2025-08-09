import * as THREE from 'three';

const scene = new THREE.Scene();
const scale = 1000000
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1 * scale, 1000 * scale);
camera.position.z = 100 * scale;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

function getTetrahedron() {
    const geometry = new THREE.TetrahedronGeometry(1);
    const material = new THREE.MeshBasicMaterial({ color: 0x0000ff, });
    const shape = new THREE.Mesh(geometry, material);
    return shape
}

function getVirtualTetrahedron() {
    const group = new THREE.Group();
    // Points
    const step = new THREE.Object3D();
    step.position.setX(1)
    step.position.setY(1)
    step.position.setZ(1)
    group.add(step);
    const actor = new THREE.Object3D();
    actor.position.setX(1)
    actor.position.setY(-1)
    actor.position.setZ(-1)
    group.add(actor);
    const action = new THREE.Object3D();
    action.position.setX(-1)
    action.position.setY(1)
    action.position.setZ(-1)
    group.add(action);
    const context = new THREE.Object3D();
    context.position.setX(-1)
    context.position.setY(-1)
    context.position.setZ(1)
    group.add(context);
    const centroid = new THREE.Object3D();
    centroid.position.set(0, 0, 0);
    group.add(centroid);

    const geometry = new THREE.BufferGeometry().setFromPoints([
        context.position, actor.position,
        context.position, action.position,
        context.position, step.position,
        actor.position, action.position,
        actor.position, step.position,
        action.position, step.position
    ])

    const centroidGeometry = new THREE.BufferGeometry().setFromPoints([
        actor.position, centroid.position,
        action.position, centroid.position,
        context.position, centroid.position,
        step.position, centroid.position
    ])

    const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
    const centroidMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const line = new THREE.Line(geometry, material);
    const centroidLine = new THREE.Line(centroidGeometry, centroidMaterial);
    // Lines
    group.add(line)
    group.add(centroidLine)
    // group.add(new THREE.LineCurve3( context.position, actor.position ))
    // group.add(new THREE.LineCurve3( context.position, action.position ))
    // group.add(new THREE.LineCurve3( context.position, step.position ))
    // group.add(new THREE.LineCurve3( actor.position, action.position ))
    // group.add(new THREE.LineCurve3( actor.position, step.position ))
    // group.add(new THREE.LineCurve3( action.position, step.position ))
    return group;
}
class VirtualTetrahedron {
    group = new THREE.Group();
    // Points
    step = new THREE.Object3D();
    setStep(timestep) {
        this.step.position.setX(1 * timestep)
        this.step.position.setY(1 * timestep)
        this.step.position.setZ(1 * timestep)
        this.group.add(this.step);
    };
    actor = new THREE.Object3D();
    setActor(identity) {
        this.actor.position.setX(1 * identity)
        this.actor.position.setY(-1 * identity)
        this.actor.position.setZ(-1 * identity)
        this.group.add(this.actor);
    };
    action = new THREE.Object3D();
    setAction(description) {
        this.action.position.setX(-1 * description)
        this.action.position.setY(1 * description)
        this.action.position.setZ(-1 * description)
        this.group.add(this.action);
    };
    context = new THREE.Object3D();
    setContext(description) {
        this.context.position.setX(-1 * description)
        this.context.position.setY(-1 * description)
        this.context.position.setZ(1 * description)
        this.group.add(this.context);
    };
    centroid = new THREE.Object3D();
    setCentroid() {
        this.centroid.position.set(
            (this.step.position.x +
                this.actor.position.x +
                this.action.position.x +
                this.context.position.x) / 4,
            (this.step.position.y +
                this.actor.position.y +
                this.action.position.y +
                this.context.position.y) / 4,
            (this.step.position.z +
                this.actor.position.z +
                this.action.position.z +
                this.context.position.z) / 4
        );
        this.group.add(this.centroid);
    };
    compileObject() {
        const geometry = new THREE.BufferGeometry().setFromPoints([
            this.context.position, this.actor.position,
            this.context.position, this.action.position,
            this.context.position, this.step.position,
            this.actor.position, this.action.position,
            this.actor.position, this.step.position,
            this.action.position, this.step.position
        ])

        const centroidGeometry = new THREE.BufferGeometry().setFromPoints([
            this.actor.position, this.centroid.position,
            this.action.position, this.centroid.position,
            this.context.position, this.centroid.position,
            this.step.position, this.centroid.position
        ])

        const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
        const centroidMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
        const line = new THREE.Line(geometry, material);
        // const line3 = new THREE.Line(new THREE.LineCurve3( this.context.position, this.actor.position ), material);
        const centroidLine = new THREE.Line(centroidGeometry, centroidMaterial);
        // Lines
        this.group.add(line)
        this.group.add(centroidLine)
    }
    constructor(){
        this.setActor(Number(new TextEncoder().encode("Brian").join("")))
        this.setAction(Number(new TextEncoder().encode("Get Private Key").join("")))
        this.setContext(Number(new TextEncoder().encode("HDNodeWallet").join("")))
        this.setStep(Number(new TextEncoder().encode(0).join("")))
        this.setCentroid()
        console.log(this.actor.position)
        console.log(this.action.position)
        console.log(this.context.position)
        console.log(this.step.position)
        console.log(this.centroid.position)
        this.compileObject()
        console.log(this.group.matrix)
    }
    // group.add(new THREE.LineCurve3( context.position, actor.position ))
    // group.add(new THREE.LineCurve3( context.position, action.position ))
    // group.add(new THREE.LineCurve3( context.position, step.position ))
    // group.add(new THREE.LineCurve3( actor.position, action.position ))
    // group.add(new THREE.LineCurve3( actor.position, step.position ))
    // group.add(new THREE.LineCurve3( action.position, step.position ))
};
const run = new VirtualTetrahedron();
// run.next(new TextEncoder().encode(Date.now().toString())).next(new TextEncoder().encode("Me")).next(new TextEncoder().encode("Get")).next(new TextEncoder().encode("JSON"))
// run.next(new TextEncoder().encode(Date.now().toString()));
// run.next(new TextEncoder().encode("Me"));
// run.next(new TextEncoder().encode("Get"));
// run.next(new TextEncoder().encode("JSON"));
// let ren = run.return()
const virtualTetrahedron = run.group;
// camera.position.z = 100;
scene.add(virtualTetrahedron)
function getOuterSphere() {
    const geometry = new THREE.SphereGeometry(.5);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });
    const shape = new THREE.Mesh(geometry, material);
    return shape
}
function getInnerSphere() {
    const geometry = new THREE.SphereGeometry(1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    const shape = new THREE.Mesh(geometry, material);
    return shape
}
const tetrahedron = getTetrahedron();
const outerSphere = getOuterSphere();
const innerSphere = getInnerSphere();

// const virtualTetrahedron = getVirtualTetrahedron()//new THREE.Group();
// const virtualTetrahedron = getVirtualTetrahedron()//new THREE.Group();
// virtualTetrahedron.add(tetrahedron);
// virtualTetrahedron.add(outerSphere);
// virtualTetrahedron.add(innerSphere);
// scene.add(virtualTetrahedron);
let iteration = 0;

// setInterval(()=>{
//     const virtualTetrahedron = new THREE.Group();
//     virtualTetrahedron.add(tetrahedron.clone());
//     virtualTetrahedron.add(outerSphere.clone());
//     virtualTetrahedron.add(innerSphere.clone());
//     virtualTetrahedron.translateX(iteration++)
//     scene.add(virtualTetrahedron);
//     camera.position.z++;
//     // if (iteration % 2 === 0){
//     //     tetrahedron.scale.x += 1;
//     //     tetrahedron.scale.y += 1;
//     //     tetrahedron.scale.z += 1;
//     // } else {
//     //     tetrahedron.scale.x -=  1;
//     //     tetrahedron.scale.y -=  1;
//     //     tetrahedron.scale.z -=  1;
//     // }
//     // if (iteration % 2 !== 0){
//     //     innerSphere.scale.x += .1;
//     //     innerSphere.scale.y += .1;
//     //     innerSphere.scale.z += .1;
//     // } else {
//     //     innerSphere.scale.x -= .1;
//     //     innerSphere.scale.y -= .1;
//     //     innerSphere.scale.z -= .1;
//     // }
//     // if (iteration % 2 === 0){
//     //     outerSphere.scale.x += .1;
//     //     outerSphere.scale.y += .1;
//     //     outerSphere.scale.z += .1;
//     // } else {
//     //     outerSphere.scale.x -= .1;
//     //     outerSphere.scale.y -= .1;
//     //     outerSphere.scale.z -= .1;
//     // }
//     iteration++;
// },Math.PI * 1000)
function animate() {
    // tetrahedron.rotation.x += .01;
    // tetrahedron.rotation.y += .01;
    virtualTetrahedron.rotation.x += .01
    virtualTetrahedron.rotation.y += .01
    renderer.render(scene, camera);

}