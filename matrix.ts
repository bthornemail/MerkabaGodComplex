function getState(vector: any[]) {
    switch (vector.length % 7) {
        case 1:
            return "node"
            break;
        case 2:
            return "edge"
            break;
        case 3:
            return "graph"
            break;
        case 4:
            return "hyperedge"
            break;
        case 5:
            return "hypergraph"
            break;
        case 6:
            return "phase"
            break;

        case 0:
            // case 7:
            return "state"
            break;

        default:
            console.log("unknwown")
            return "uknown"
            break;
    }
}
console.log("Attention",[
    1
].map((i) => getState(Array.from(new Uint8Array(i)))))
console.log("Reduce",[
    1, 2
].map((i) => getState(Array.from(new Uint8Array(i)))))
console.log("Observer",[
    1, 2, 3
].map((i) => getState(Array.from(new Uint8Array(i)))))
console.log("Reference",[
    1, 2, 3, 4
].map((i) => getState(Array.from(new Uint8Array(i)))))
console.log("State",[
    1, 2, 3, 4, 5,
].map((i) => getState(Array.from(new Uint8Array(i)))))
console.log("Entity",[
    1, 2, 3, 4, 5, 6
].map((i) => getState(Array.from(new Uint8Array(i)))))
console.log("Identity",[
    1, 2, 3, 4, 5, 6, 7
].map((i) => getState(Array.from(new Uint8Array(i)))))
console.log("Observing",[
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
].map((i) => getState(Array.from(new Uint8Array(i)))))
console.log("Observation",[
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14
].map((i) => getState(Array.from(new Uint8Array(i)))))
console.log("Entity",[
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21
].map((i) => getState(Array.from(new Uint8Array(i)))))