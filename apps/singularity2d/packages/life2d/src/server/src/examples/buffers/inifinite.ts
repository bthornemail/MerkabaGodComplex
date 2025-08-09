class InfiniteCanvas {
    buffers: Buffer[]
    position: number
    dynamicBuffer: ArrayBuffer

    constructor(initialSize = 1024) {
        this.buffers = [Buffer.alloc(initialSize)];
        this.position = 0;
        this.dynamicBuffer = new ArrayBuffer(initialSize);
    }

    write(data) {
        // Check if there's enough space in the current buffer
        if (this.position + data.length > this.dynamicBuffer.byteLength) {
            // If not, allocate a new buffer with increased capacity
            const newCapacity = this.dynamicBuffer.byteLength * 2;
            const newBuffer = new ArrayBuffer(newCapacity);

            // Copy existing data to the new buffer
            new Uint8Array(newBuffer).set(new Uint8Array(this.dynamicBuffer));

            // Update canvasBuffer reference
            this.dynamicBuffer = newBuffer;
        }

        // Write data to the current buffer at the current position
        new Uint8Array(this.dynamicBuffer).set(
            new TextEncoder().encode(data),
            this.position
        );
        this.position += data.length;
    }

    read(size) {
        // Read data from the current buffer at the current position
        const data = new Uint8Array(this.dynamicBuffer, this.position, size);

        // Move the position forward
        this.position += size;

        return new TextDecoder().decode(data);
    }

    getView(startIndex: number, endIndex: number): DataView {
        // Create a DataView representing a specific portion of the canvasBuffer
        return new DataView(this.dynamicBuffer, startIndex, endIndex - startIndex);
    }
}

(async () => {
    const canvas = new DynamicBuffer();

    // Writing data
    canvas.write('Hello, ');
    canvas.write('World!');
    canvas.write(' This is an infinite canvas.');

    // Reading data
    const result = canvas.read(10); 
    // canvas.read

    console.log(result.toString());
})()