//import { generatePascalTriangle } from "./loop";
import * as d3 from "d3";

export function generatePascalTriangle(numRows: number): number[][] {
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
const loop = (dimensions: number = 3) => {
    let seedOfLife: string = "";
    const platonicSolids:number[][] = [];
    const sacredGeometry = (seed: number[][]) => {
        console.table(seed)
    };
    d3.ticks(1, dimensions, 10).forEach((dimension) => {
        const groups = generatePascalTriangle(dimension);
        const nodes = groups.flat(2);
        const actions = nodes.reduce((prv, cur) => {
            return prv + cur
        }, 0);
        const order = groups.slice(-1);
        seedOfLife = `${dimension}D of ${actions} nodes with a ${Math.cos(actions)} delta in ${[order]} order groups`;

        switch (dimension) {
            case 20:
            case 12:
            case 8:
            case 6:
            case 4:
            case 3:
            case 2:
            case 1:
            case 0:
                platonicSolids.push(...order);
                break;
            default:

        };
        console.log()
    });
    console.log(seedOfLife)

    sacredGeometry(platonicSolids);
};

loop(20);
