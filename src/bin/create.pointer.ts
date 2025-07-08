import { ethers, HDNodeWallet } from "ethers";
import { POINTER } from "../types";

export function createValueBasedHDWalletPointers(pascalTriangle, baseMnemonic) {// = "crater echo adult strong solution craft duty image leopard eternal message name") {
    console.log(pascalTriangle)
    const pointers: POINTER[] = [];
    let pointerId = 0;
    const mnemonic = baseMnemonic || HDNodeWallet.createRandom(undefined, "m/").mnemonic?.phrase;
    if (!baseMnemonic) {
        console.log("Generated mnemonic");
        console.log(mnemonic);
    }

    const masterNode = ethers.HDNodeWallet.fromPhrase(mnemonic);
    pascalTriangle.forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
            for (let i = 0; i < value; i++) {
                const hdWalletNode = masterNode
                    .deriveChild(pointerId)
                    .deriveChild(rowIndex)
                    .deriveChild(colIndex)
                    .deriveChild(i);
                let group;
                switch (value) {
                    case 20:
                    case 12:
                        group = 30 // (5,3,2)
                        break;
                    case 8:
                    case 6:
                        group = 12 // (3,2,2)
                        break;
                    case 4:
                        group = 6 // (3,2)
                        break;
                    default:
                        group = 1
                }
                group !== 1 && console.log("group", group, hdWalletNode.address, row)
                pointers.push({
                    pascalPosition: {
                        domain: rowIndex,
                        dimension: colIndex,
                        state: value
                    },
                    hdWalletNode: hdWalletNode,
                    address: hdWalletNode.address,
                    path: `/${rowIndex}'/${colIndex}/${i}/${pointerId}`,
                    vector: [rowIndex, colIndex, i, pointerId],
                    row,
                    rowIndex,
                    value,
                    colIndex,
                    i,
                    pointerId: pointerId++
                });
            }
        });
    });

    return pointers;
}