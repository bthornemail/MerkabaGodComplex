/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

export class BufferGraph {
  parsePath(path: Float32Array){
    const identityLength = path[0]
    console.log({identityLength})
    const identity = new Float32Array(path.buffer,path.BYTES_PER_ELEMENT,identityLength )
    console.log({identity})
    if(!identity) throw new Error("No Identity");
    const rehash = Uint8Array.from(identity, float => float * 128 + 128)
    console.log({rehash})
    const identityRehash = new TextDecoder().decode(rehash)
    console.log({rehash: identityRehash})
    const identityByteOffset = path[0] + identity.byteOffset + identity.byteLength
    console.log({identityByteOffset})
    console.log({identityByteOffsetNext: path[identityByteOffset + 1]})
    const identityOffset =  path[0] + identityByteOffset
    console.log({identityOffset})
    console.log({identityOffset})
    console.log({identityOffsetNext: path[identityOffset + 1]})
    if(!identityOffset) return identity


    const signatureLength = path[identityOffset + 1];
    console.log({signatureLength})
    const signature = new Float32Array(path.buffer,identityOffset + path.BYTES_PER_ELEMENT,signatureLength)
    console.log({signature})
    if(!signature) throw new Error("No Signature");
    const signatureOffset = identityOffset + signatureLength
    console.log({signatureOffset})
    const reIdentity = (new TextDecoder().decode(identity ))
    console.log({retext: reIdentity})
    const reSignature = (new TextDecoder().decode(signature))
    console.log({reSignature})
  }
  constructor(history: Float32Array = new Float32Array(1)) {
    console.log({history})
    if(Float32Array[0] === 0 ) throw new Error("No Identity");
    const identity = this.parsePath(history)
    console.log({identity})

    // const msg = "Hello";
    // console.log(msg)
    // const text = new TextEncoder().encode(msg)
    // console.log({ text })
    // const hash = Float32Array.from(text, octet => (octet - 128) / 128)
    // console.log({ hash })
    // console.log(convertArrayBufferToFloat32Array(text))
    // console.log(convertUint8ArrayToFloat32Array(text))
    // const rehash = Uint8Array.from(hash, float => float * 128 + 128)
    // console.log({ rehash })
    // const retext = (new TextDecoder().decode(rehash))
    // console.log({ retext })
  }
}