// Create an ArrayBuffer with a size in bytes
const buf: ArrayBuffer = new ArrayBuffer(4096)

// Create a couple of views
const viewCodec: DataView = new DataView(buf, 0, 511);
const viewId: DataView = new DataView(buf, 512, 1023);
const viewData: DataView = new DataView(buf, 1024,1535); // From byte 12 for the next 4 bytes
viewCodec.setInt8(0, 42); // Put 42 in slot 12
viewId.setInt16(0, 24)
viewData.setUint8(0, 255)
console.log(viewCodec.getInt8(0));
console.log(viewId.getInt16(0));
console.log(viewData.getUint8(0));
// Expected output: 42
console.log(viewData.toString())
