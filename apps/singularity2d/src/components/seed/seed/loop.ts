import { ethers, HDNodeWallet } from 'ethers';
import { PLATONIC_SOLIDS } from './sacred.geometry';

function generatePascalTriangle(numRows: number): number[][] {
    const triangle: number[][] = [];

    for (let i = 0; i < numRows; i++) {
        const row: number[] = [];
        for (let j = 0; j <= i; j++) {
            if (j === 0 || j === i) {
                row.push(1);
            } else {
                row.push(triangle[i - 1][j - 1] + triangle[i - 1][j]);
            }
        }
        triangle.push(row);
    }

    return triangle;
}

// Interface for Pascal triangle position pointing to HD wallet node
interface PascalHDWalletPointer {
    pascalPosition: {
        row: number;
        col: number;
        value: number;
    };
    hdWalletNode: ethers.HDNodeWallet;
    derivationPath: string;
    address: string;
    pointerId: number;
}
type KEY = number;
type ROOT_KEY = KEY[][]
type PRIMARY_KEY = number;
type SECONDARY_KEY = [pascalTriangle: PRIMARY_KEY[][], mnemonic: string]
type TERIARY_KEY = [pascalTriangle: number[][], wallet: HDNodeWallet]

type QUATERNARY_KEY = [...TERIARY_KEY, groups: PascalHDWalletPointer[]]
type QUINARY_KEY = [...QUATERNARY_KEY, order: PascalHDWalletPointer[]]
type SENARY_KEY = [...QUINARY_KEY, anchor: number]
type SEPTENARY_KEY = [...SENARY_KEY, entity: string]
type OCTANARY_KEY = [...TERIARY_KEY, groups: PascalHDWalletPointer[]]
// Create HD wallet pointers based on Pascal triangle values
async function createPascalHDWalletPointers(
    pascalTriangle: number[][],
    baseMnemonic?: string
): Promise<PascalHDWalletPointer[]> {
    const pointers: PascalHDWalletPointer[] = [];
    let pointerId = 0;

    // Generate or use provided mnemonic
    const mnemonic = baseMnemonic || ethers.Wallet.createRandom().mnemonic?.phrase;
    if (!mnemonic) {
        throw new Error("Failed to generate mnemonic");
    }

    // Create master HD node
    const masterNode = ethers.HDNodeWallet.fromPhrase(mnemonic);

    pascalTriangle.forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
            // Create 'value' number of HD wallet nodes for this position
            for (let i = 0; i < value; i++) {
                // Create derivation path: m/44'/60'/0'/row/col/pointerId
                const derivationPath = `m/44'/60'/0'/${rowIndex}/${colIndex}/${pointerId}`;

                // Derive the HD wallet node

                const hdWalletNode = masterNode.deriveChild(value).deriveChild(rowIndex).deriveChild(colIndex).deriveChild(pointerId);

                pointers.push({
                    pascalPosition: {
                        row: rowIndex,
                        col: colIndex,
                        value: value
                    },
                    hdWalletNode: hdWalletNode,
                    derivationPath: derivationPath,
                    address: hdWalletNode.address,
                    pointerId: pointerId++
                });
            }
        });
    });

    return pointers;
}

// Alternative: Use Pascal values as part of derivation path
async function createValueBasedHDWalletPointers(
    pascalTriangle: number[][],
    baseMnemonic?: string
): Promise<PascalHDWalletPointer[]> {
    const pointers: PascalHDWalletPointer[] = [];
    let pointerId = 0;

    const mnemonic = baseMnemonic || ethers.Wallet.createRandom().mnemonic?.phrase;
    if (!mnemonic) {
        throw new Error("Failed to generate mnemonic");
    }

    const masterNode = ethers.HDNodeWallet.fromPhrase(mnemonic);

    pascalTriangle.forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
            for (let i = 0; i < value; i++) {
                // Use Pascal value in derivation path: m/44'/60'/value'/row/col/i
                const derivationPath = `m/44'/60'/${value}'/${rowIndex}/${colIndex}/${i}`;

                const hdWalletNode = masterNode.deriveChild(value).deriveChild(rowIndex).deriveChild(colIndex).deriveChild(i);
                //                const hdWalletNode = masterNode.derivePath(derivationPath);

                pointers.push({
                    pascalPosition: {
                        row: rowIndex,
                        col: colIndex,
                        value: value
                    },
                    hdWalletNode: hdWalletNode,
                    derivationPath: derivationPath,
                    address: hdWalletNode.address,
                    pointerId: pointerId++
                });
            }
        });
    });

    return pointers;
}

// Utility function to display wallet information
function displayWalletPointers(pointers: PascalHDWalletPointer[]) {
    console.log(`\nGenerated ${pointers.length} HD wallet pointers:\n`);

    pointers.forEach((pointer, index) => {
        console.log(`Pointer ${index}:`);
        console.log(`  Pascal Position: [${pointer.pascalPosition.row}, ${pointer.pascalPosition.col}] = ${pointer.pascalPosition.value}`);
        console.log(`  Derivation Path: ${pointer.derivationPath}`);
        console.log(`  Address: ${pointer.address}`);
        console.log(`  Private Key: ${pointer.hdWalletNode.privateKey}`);
        console.log('');
    });
}

// Example usage:
async function primary(rows:number = 8) {
    const pascalTriangle = generatePascalTriangle(rows);
    console.log("Pascal Triangle:", pascalTriangle);
    return pascalTriangle
}
// Example usage:
async function secondary(pascalTriangle: number[][], mnemonic: string = "cost apology famous sausage unit endless stable dilemma sponsor interest winner hockey")
    : Promise<[pascalTriangle: number[][], wallet: HDNodeWallet]> {
    const wallet = HDNodeWallet.fromPhrase(mnemonic) ?? HDNodeWallet.createRandom(undefined, "m/44'/60'/0'");
    return [pascalTriangle, wallet]
    // return {
    //     extendedKey: wallet.extendedKey,
    //     privateKey: wallet.privateKey,
    //     address: wallet.address,
    // }
}
async function teriary(pascalTriangle: number[][], wallet: HDNodeWallet)
    : Promise<[pascalTriangle: number[][], wallet: HDNodeWallet, groups: PascalHDWalletPointer[]]> {
    // Method 1: Standard derivation
    console.log("\n=== Method 1: Standard Derivation ===");
    const pointers1 = await createPascalHDWalletPointers(pascalTriangle, wallet.mnemonic?.phrase);
    displayWalletPointers(pointers1.slice(0, 1)); // Show first 5

    // // Show breakdown by Pascal triangle row
    // console.log("\n=== Breakdown by Pascal Triangle Row ===");
    // let currentPointerIndex = 0;
    // pascalTriangle.forEach((row, rowIndex) => {
    //     const rowTotal = row.reduce((sum, val) => sum + val, 0);
    //     console.log(`Row ${rowIndex}: ${JSON.stringify(row)} -> ${rowTotal} HD wallet nodes`);

    //     // Show addresses for this row
    //     const rowPointers = pointers1.slice(currentPointerIndex, currentPointerIndex + rowTotal);
    //     rowPointers.forEach((pointer, index) => {
    //         console.log(`  [${pointer.pascalPosition.row},${pointer.pascalPosition.col}]: ${pointer.address}`);
    //     });
    //     currentPointerIndex += rowTotal;
    //     console.log('');
    // });
    return [pascalTriangle, wallet, pointers1]
}
async function quaternary(pascalTriangle: number[][], wallet: HDNodeWallet, groups: PascalHDWalletPointer[])
    : Promise<[pascalTriangle: number[][], wallet: HDNodeWallet, groups: PascalHDWalletPointer[], order: PascalHDWalletPointer[]]> {
    // Method 2: Value-based derivation
    console.log("\n=== Method 2: Value-based Derivation ===");
    const pointers2 = await createValueBasedHDWalletPointers(pascalTriangle, wallet.mnemonic?.phrase);
    displayWalletPointers(pointers2.slice(2, 4)); // Show first 5

    // // Show breakdown by Pascal triangle row
    // console.log("\n=== Breakdown by Pascal Triangle Row ===");
    // let currentPointerIndex = 0;
    // pascalTriangle.forEach((row, rowIndex) => {
    //     const rowTotal = row.reduce((sum, val) => sum + val, 0);
    //     console.log(`Row ${rowIndex}: ${JSON.stringify(row)} -> ${rowTotal} HD wallet nodes`);

    //     // Show addresses for this row
    //     const rowPointers = pointers2.slice(currentPointerIndex, currentPointerIndex + rowTotal);
    //     rowPointers.forEach((pointer, index) => {
    //         console.log(`  [${pointer.pascalPosition.row},${pointer.pascalPosition.col}]: ${pointer.address}`);
    //     });
    //     currentPointerIndex += rowTotal;
    //     console.log('');
    // });
    return [pascalTriangle, wallet, groups, pointers2]
}
async function quinary(pascalTriangle: number[][], wallet: HDNodeWallet, groups: PascalHDWalletPointer[], order: PascalHDWalletPointer[])
    : Promise<[pascalTriangle: number[][], wallet: HDNodeWallet, groups: PascalHDWalletPointer[], order: PascalHDWalletPointer[], size: number]> {
    console.log("genesis:", pascalTriangle);
    console.log("wallet:", wallet);
    console.log("hypernodes:", order);
    console.log("hyperedges:", groups);
    console.log("\n=== Breakdown by Pascal Triangle Row ===");
    let currentPointerIndex = 0;
    pascalTriangle.forEach((row, rowIndex) => {
        const rowTotal = row.reduce((sum, val) => sum + val, 0);
        console.log(`Row ${rowIndex}: ${JSON.stringify(row)} -> ${rowTotal} HD wallet nodes`);

        // Show addresses for this row
        const rowPointers = groups.slice(currentPointerIndex, currentPointerIndex + rowTotal);
        rowPointers.forEach((pointer, index) => {
            console.log(`  [${pointer.pascalPosition.row},${pointer.pascalPosition.col}]: ${pointer.address}`);
        });
        currentPointerIndex += rowTotal;
        console.log('');
    });
    return [pascalTriangle, wallet, groups, order, currentPointerIndex]
}
async function senary(pascalTriangle: number[][], wallet: HDNodeWallet, groups: PascalHDWalletPointer[], order: PascalHDWalletPointer[], anchor: number)
    : Promise<() => Promise<[
        [pascalTriangle: number[][], wallet: HDNodeWallet, groups: PascalHDWalletPointer[], order: PascalHDWalletPointer[], size: number],
        [pascalTriangle: number[][], wallet: HDNodeWallet, groups: PascalHDWalletPointer[], order: PascalHDWalletPointer[], size: number]
    ]>> {
    //make interactice hyper graph for the next function to add event listeners to or we add them here for the nes one to implement them
    return async (dimensions: number = 7)
        : Promise<[
            [pascalTriangle: number[][], wallet: HDNodeWallet, groups: PascalHDWalletPointer[], order: PascalHDWalletPointer[], size: number],
            [pascalTriangle: number[][], wallet: HDNodeWallet, groups: PascalHDWalletPointer[], order: PascalHDWalletPointer[], size: number]
        ]> => {

        const entity = await primary(dimensions)
        const identity = await secondary(entity);
        const seed = await teriary(...identity);
        const root = await quaternary(...seed);
        const tree = await quinary(...root);
        const platonicSolids = {...PLATONIC_SOLIDS}

        return [
            [pascalTriangle, wallet, groups, order, anchor],
            [...tree]
        ]
    }
}
async function septenary(state: [
    [pascalTriangle: number[][], wallet: HDNodeWallet, groups: PascalHDWalletPointer[], order: PascalHDWalletPointer[], size: number],
    [pascalTriangle: number[][], wallet: HDNodeWallet, groups: PascalHDWalletPointer[], order: PascalHDWalletPointer[], size: number]
],input: (...any: any)=>any = async ()=>null,output: (...any: any)=>any = console.log) { 
    output("state",JSON.stringify(state[0][2],null,4))
    return [state,input,output];
}
async function octonary() { }
async function nonary() { }
async function denary() { }
// Utility: Get wallet by Pascal position
function getWalletByPosition(
    pointers: PascalHDWalletPointer[],
    row: number,
    col: number,
    instance: number = 0
): PascalHDWalletPointer | undefined {
    const matching = pointers.filter(p =>
        p.pascalPosition.row === row && p.pascalPosition.col === col
    );
    return matching[instance];
}


; (async () => {
    const entity = await primary(5)
    const identity = await secondary(entity);
    const seed = await teriary(...identity);
    const root = await quaternary(...seed);
    const tree = await quinary(...root);
    const genesis = await senary(...tree);
    const peer = await septenary(await genesis());

})()