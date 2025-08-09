// Hexadecimal Encoding (Manual)
function byteToHex(byte: number) {
    return ('0' + byte.toString(16)).slice(-2);
}

export function byteArrayToHex(byteArray: Uint8Array) {
    return Array.from(byteArray, byteToHex).join('');
}

export function stringToHex(string: string) {
    return Array.from(new TextEncoder().encode(string), byteToHex).join('');
}
// const byteArray = new Uint8Array([72, 101, 108, 108, 111, 44, 32, 87, 111, 114, 108, 100, 33]);
// const hexString = byteArrayToHex(byteArray);

// console.log(hexString); // Output: "48656c6c6f2c20576f726c6421"
// Hexadecimal to Text Conversion
function hexToByte(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
}

export function hexToString(hex: string): string {
    return new TextDecoder().decode(hexToByte(hex));
}

// const hexString = "48656c6c6f2c20576f726c6421";
// const textString = hexToString(hexString);

// console.log(textString); // Output: "Hello, World!"
