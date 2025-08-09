// Create an ArrayBuffer with a size in bytes
const buffer = new ArrayBuffer(4096)

// Create a couple of views
const view1 = new DataView(buffer, 0, 1);
const view2 = new DataView(buffer, 2, 3); // From byte 12 for the next 4 bytes
view1.setInt8(0, 42); // Put 42 in slot 12
view2.setInt8(0, 24)
view2.setInt8(1, 48)

console.log(view1.getInt8(0));
console.log(view2.getInt8(0));
// Expected output: 42
console.log(buffer.toString('utf8'))
