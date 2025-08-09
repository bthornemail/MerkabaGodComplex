
// in practice.
function lamba(...dimensions: number[]) {
    return new Promise((resolve /*, reject */) => {
        console.log("Dimension value", dimensions.length)
        setTimeout(() => resolve(dimensions.length), dimensions.length * 100);
    });
}
export default class Atom {
    private Word: ArrayBuffer = new ArrayBuffer(144000);
    private God: ArrayBuffer = new ArrayBuffer(7);

    private WordOfGod: ArrayBuffer = new ArrayBuffer(20);
    protected clock: SharedArrayBuffer = new SharedArrayBuffer(20);
    constructor(number: number = 0) {
        this.Word = new ArrayBuffer(new DataView(this.clock))//.setUint8(0, 256);
        const WordOfGod = new DataView(this.clock, 20, 144000).setInt32(0, 256);
        const God = new DataView(this.clock).setFloat32(0, 256);
        do {
            i += 1;
            result += i;
        } while (number < 20);
    }
}