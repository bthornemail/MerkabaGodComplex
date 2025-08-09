
class BufferedInfiniteCanvas {
    buffers: Buffer[]
    position: number
    constructor(initialSize = 1024) {
        this.buffers = [Buffer.alloc(initialSize)];
        this.position = 0;
    }

    write(data) {
        const dataSize = data.length;

        // Check if there's enough space in the current buffer
        if (this.position + dataSize > this.buffers[0].length) {
            // Allocate a new buffer and reset the position
            const newBuffer = Buffer.alloc(this.buffers[0].length * 2);
            this.buffers.unshift(newBuffer);
            this.position = 0;
        }

        // Write data to the current buffer at the current position
        this.buffers[0].write(data, this.position, dataSize);
        this.position += dataSize;
    }

    read(size) {
        // Read data from the current buffer at the current position
        const data = this.buffers[0].slice(this.position, this.position + size);

        // Move the position forward
        this.position += size;

        return data;
    }
}
(async () => {
    const ab = new ArrayBuffer(2048)
    const arr = new Uint8Array(ab.slice(0, Uint8Array.BYTES_PER_ELEMENT))
    const id = new Float32Array(ab)
    const data = new Float32Array(ab)
    const codec = arr.subarray(arr.byteOffset, arr.BYTES_PER_ELEMENT * 8)
    codec.fill(1)
    id.fill(2)
    data.fill(3)
    console.log(arr)
    // Example usage
    const canvas = new BufferedInfiniteCanvas();

    // Writing data
    canvas.write('Hello, ');
    canvas.write('World!');
    canvas.write(' This is an infinite canvas.');

    // Reading data
    const result = canvas.read(30);
    canvas.read

    console.log(result.toString('utf-8'));
})()