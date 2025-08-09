
// const point = new Int8Array(buffer, 2, 2)
// const edges = new Int8Array(buffer)
type GraphConfig = {
    height: number
    width: number
}
export default class Graph {
    canvasBuffer = new ArrayBuffer(4096)
    canvas = new Int8Array(this.canvasBuffer)
    dataView = new DataView(this.canvasBuffer, (this.canvasBuffer.byteLength / 2) - (256 / 2), 256)
    viewPort = new Uint8Array(this.dataView.buffer, this.dataView.byteOffset, this.dataView.byteLength)

    points: Uint8Array[] = []
    edges: Uint8Array[] = []
    constructor(config?: GraphConfig) {
        if (config) {
            const { width, height } = config
            this.canvasBuffer = new ArrayBuffer(width * height)
        }
    }
    addPoint(x: number = 0, y: number = 0, z: number = 0, a: number = 0, b: number = 0, c: number = 0) {
        console.log(`Adding point ${x},${y},${z}`)
        const point = new Uint8Array([x, y, z, a, b, c])
        this.points.push(point)
    }
    draw() {
        for (const p of this.points) {
            console.log(`Drawing ${[p[0] * p[1]]} = ${p[2]}`)
            console.log(p)
            let point = Array.from(p)
            this.canvas[point[0] * point[1]] = point[2]
        }
    }
}
(async () => {
    const graph = new Graph()
    graph.addPoint(0, 0, 0, 12, 26, 345)
    graph.addPoint(24, 0, 0, 12, 26, 345)
    graph.draw()
    console.log(graph.canvas)
})()
