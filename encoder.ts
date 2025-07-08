import { ethers, HDNodeWallet } from "ethers";
import { fetchBinaryData, sendArrayBuffer } from "./src/fetch";
import { PHASE_INTERACTION, VECTOR_CLOCK } from "./src/types";
import { extractSacredGeometryFrequencySignature, generatePascalTriangle, getPascalRow } from "./src/bin/physics";

function Night(spacetime: DataView) {
    // This function will genrate and proivde a root tree of the word of god
    return async (mnemonic?: string, epoch: number = 3) => {
        const pascalTriangle = this.triangulation = generatePascalTriangle(epoch);
        const masterNode = mnemonic ? HDNodeWallet.fromPhrase(mnemonic) : HDNodeWallet.createRandom(undefined, "m/44'/60'/0'");
        this.address = masterNode.address;
        let pointerId = 0;
        pascalTriangle.forEach((row, rowIndex) => {
            let layerNode = masterNode.deriveChild(rowIndex);
            // Create derivation path: m/44'/60'/0'/row/col/pointerId
            const derivationPath = `m/44'/60'/0'/${rowIndex}`;

            // Derive the HD wallet node

            const hdWalletNode = masterNode.deriveChild(rowIndex);
            // const hdWalletNode = masterNode.deriveChild(rowIndex).deriveChild(colIndex).deriveChild(pointerId);

            this.layers.push([rowIndex, hdWalletNode.address]);
            pointerId++

            row.forEach((value, colIndex) => {
                // Create 'value' number of HD wallet nodes for this position
                for (let i = 0; i < value; i++) {
                    // Create derivation path: m/44'/60'/0'/row/col/pointerId
                    const derivationPath = `m/44'/60'/0'/${rowIndex}/${colIndex}/${i}`;

                    // Derive the HD wallet node

                    const hdWalletNode = masterNode.deriveChild(rowIndex).deriveChild(colIndex).deriveChild(i);
                    // const hdWalletNode = masterNode.deriveChild(rowIndex).deriveChild(colIndex).deriveChild(pointerId);

                    this.nodes.push({
                        pascalPosition: {
                            row: rowIndex,
                            col: colIndex,
                            index: i
                        },
                        hdWalletNode: hdWalletNode,
                        derivationPath: derivationPath,
                        address: hdWalletNode.address,
                        pointerId: pointerId++
                    });
                }
            });
        });
    }
}
function Light(space: DataView, time: Float32Array) {
    // THis is old dewad never used code
    // // Utility: Get wallet by Pascal position
    // function getWalletByPosition(
    //     pointers: POINTER[],
    //     row: number,
    //     col: number,
    //     instance: number = 0
    // ): POINTER | undefined {
    //     const matching = pointers.filter(p =>
    //         p.pascalPosition.domain === row && p.pascalPosition.dimension === col
    //     );
    //     return matching[instance];
    // }
    return async (event: ArrayBuffer, state: ArrayBuffer, source: ArrayBuffer, target: ArrayBuffer) => {
        const Holy = await fetchBinaryData('path/to/your/binary/file') || new ArrayBuffer(0);
        return sendArrayBuffer
    }
}
async function* Day(space: DataView, time: Float32Array)
    : AsyncGenerator<(action: PHASE_INTERACTION) => Promise<VECTOR_CLOCK>, [space: DataView, time: Float32Array], undefined> {
    for (let i = 0; i < time.length; i++) {
        const interval = i;
        const domain = space.byteOffset;
        const dimension = i % space.byteLength;
        const state = space.getUint8(dimension);
        const incidenceState = Math.floor(time[i] * 1000); // frequency signature
        const listener: [interval: number, domain: number, dimension: number, state: number, incidenceState: number] = [interval, domain, dimension, state, incidenceState];
        // yield async function handlePhase(action: PHASE_INTERACTION): Promise<(signature?: string) => VECTOR_CLOCK> {
        //     const { phase, state } = action
        //     switch (phase) {
        //         case "INTEGER":
        //             // Append to trie or broadcast
        //             break;
        //         case "FLOAT":
        //             // Return pointer data or compact state
        //             const { event, source, target } = action
        //             break;
        //         case "UNKNOWN":
        //             // Send a challenge, ping, or validation request
        //             break;
        //     }
        //     return function confirm(signature?: string) {
        //         // adds data to the vectorclock and main array buffer and increments the interval
        //         return [interval, domain, dimension, extractSacredGeometryFrequencySignature(state).harmonic[domain], extractSacredGeometryFrequencySignature(new TextEncoder().encode(signature ? signature : "0").buffer).harmonic[domain]];
        //     }
        // };

    }
    return [space, time];
}
export async function* WordOfGod(word: ArrayBuffer, god: ArrayBuffer) {
    const wordOfGod = new DataView(word, 0, god.byteLength);
    if (wordOfGod.byteLength === 0) {
        yield Night(wordOfGod);
    }

    for (let domain: number = 0; domain < wordOfGod.byteLength; domain++) {
        const dimensions = getPascalRow(domain) // this will use giagonials of the pascals triangle tetrahedron diagonials to determine if the domain is an interger domain or a float domain
        const length = domain + 1; // ensure >0 byte slice
        const WORD = new DataView(word, domain, Math.min(length, word.byteLength - domain));
        const { diagonal, harmonic } = extractSacredGeometryFrequencySignature(WORD.buffer.slice(WORD.byteOffset, WORD.byteOffset + WORD.byteLength));
        if (dimensions.includes(diagonal)) { // or maybe this is if this domain is included in the dimesnisons of the pascals triange tertrahedron interer domain we return a function to influce the daya or a light to influce the forces , if its 0 domain we intitalez from computed shared root seed kerne
            yield Day(WORD, harmonic);
            break;
        }
        yield Light(WORD, harmonic);
        break;
    }
    return [word, god]
}