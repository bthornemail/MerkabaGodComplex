export default function encodeStringToPaddedArrayBuffer(str: string,isPadded = true): ArrayBuffer {
    const encoder = new TextEncoder(); // UTF-8 encoding by default
    const originalBuffer = encoder.encode(str).buffer; // Encode string and return ArrayBuffer
    if(!isPadded) return originalBuffer; 
    const paddingLength = (4 - (originalBuffer.byteLength % 4)) % 4;
    const paddedLength = originalBuffer.byteLength + paddingLength;
    const paddedBuffer = new ArrayBuffer(paddedLength);
    const paddedView = new Uint8Array(paddedBuffer);
    paddedView.set(new Uint8Array(originalBuffer));
    return paddedBuffer;
}
(()=>{
    console.log(encodeStringToPaddedArrayBuffer("Hello World"))
})();