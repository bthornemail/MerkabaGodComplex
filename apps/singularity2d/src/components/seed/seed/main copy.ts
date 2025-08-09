// An async task. Pretend it's doing something more useful

import Seed from "./Seed";

async function main(input: any,output: any) {
    let seed:ArrayBuffer;// = new ArrayBuffer();
    for await (const value of Seed.generate()) {  1
        console.log("value", value);
        seed = value;
    }
    return seed;
}

main().then((seed: ArrayBuffer) => {
    console.log("seed", seed);
    const hypergraph = new Seed(seed);
}).catch((e) => console.error(e));
