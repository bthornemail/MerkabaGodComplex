let dynamicBuffer = new ArrayBuffer(1024);
let position = 0;
const str = "Brian"
// console.log({str});
const sig = "B. Thorne"
// console.log({sig});
const encodedStr = new TextEncoder().encode(str)
console.log({encodedStr});
const encodedStringToFloat = new Float32Array(encodedStr);
console.log({encodedStringToFloat});
new Float32Array(new TextEncoder().encode("B. Thorne"));
// const encodedStringToUint8Array = new Uint8Array(encodedStr);
// console.log({encodedStringToUint8Array});
// const encodedStringFromFloat = Uint8Array.from(encodedStringToFloat)
// console.log({encodedStringFromFloat});
// const decodedString = new TextDecoder().decode(encodedStringFromFloat)
// console.log({decodedString});
// Encode the string and signature into binary data


// const strBytes = new TextEncoder().encode(str);
// const sigBytes = new TextEncoder().encode(sig);

// // Write the encoded string into the ArrayBuffer
// const identityView = new Uint8Array(dynamicBuffer);
// identityView.set(strBytes, position);
// position += strBytes.length;

// // Write the signature into the ArrayBuffer
// identityView.set(sigBytes, position + 1); // Add 1 to position to leave space for a separator
// position += sigBytes.length + 1; // Add 1 for the separator

// // Decode the contents of the ArrayBuffer
// const decodedStr = new TextDecoder().decode(identityView.subarray(0, strBytes.length));
// const decodedSig = new TextDecoder().decode(identityView.subarray(position - sigBytes.length - 1, position - 1));

// console.log("Decoded String:", decodedStr);
// console.log("Decoded Signature:", decodedSig);