export default function createSubscription(source: string, target: string) {
    if (source.trim() === target.trim()) throw Error("Source and Target names can not match");
    if (!this.events.has(source)) throw Error("No event regisered");
    const shape = this.scene.getObjectByName(source);
    if (!shape) throw Error("No shape found regisered", { cause: 0 });
    const peer = this.createNode({ id: target, x: shape.position.x, y: shape.position.y, z: shape.position.z + 1 })
    if (this.detectCollisions(peer.matrix, this.scene.children.map((child) => { return child.matrix })).includes(shape.matrix)) {
        // console.log(sphere.scale.z + (node.z ?? node.x / node.y));
        peer.translateZ(peer.scale.z + 1);
    }
    this.events.get(source)!.add(target);
    return [peer];
};