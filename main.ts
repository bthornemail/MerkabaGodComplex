import { HDNodeWallet } from "ethers";
import { fetchBinaryData, getData } from "./src/fetch";
import { WordOfGod } from "./encoder";
import util from 'util';
import { generatePascalTriangle } from "./src/bin/physics";
import wordnet from 'wordnet';
import { writeFileSync } from "fs";
(async () => {
    // (Required) Load the WordNet database.
    let domains = 1;
    await wordnet.init();
    const WordNet = await wordnet.list();
    // console.log(WordNet)
    let size = 0;
    let points: number[][] = [];
    while (size <= WordNet.length) {
        points = [];
        const triangle = generatePascalTriangle(domains);
        console.log(JSON.stringify(triangle, null, 2))
        triangle.forEach((row, rowIndex) => {
            console.log([domains, rowIndex])
            row.forEach((domains, group) => {
                console.log([domains, rowIndex, group])
                for (let dimension = 0; dimension < domains; dimension++) {
                    const direction = Math.hypot(rowIndex, group,dimension);
                    const point: number[] = [];
                    [rowIndex, group, dimension,size,...new TextEncoder().encode(WordNet[size])].map((domain,index)=>point.push(domain));
                    points.push(point);
                    console.log(point);
                    size++
                }
            })
            console.log("Traversing To Domain", domains++)
        })
    }
    console.log("size", size, "domains", domains)
    writeFileSync("points.json", JSON.stringify(points, null, 2));
    console.log("Points saved to points.json");
})();