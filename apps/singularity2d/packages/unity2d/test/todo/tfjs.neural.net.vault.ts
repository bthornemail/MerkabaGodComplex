import { walk } from '../../node_modules/multiformats/dist/src/traversal'
import * as Block from '../../node_modules/multiformats/dist/src/block'
import * as codec from 'multiformats/codecs/json'
import { sha256 as hasher, sha256 } from '../../node_modules/multiformats/dist/src/hashes/sha2'
import tf, { SymbolicTensor, Tensor2D } from '@tensorflow/tfjs'
import { CID } from '../../node_modules/multiformats/dist/src'
import { HDNodeWallet } from 'ethers'
import { BlockView } from '../../node_modules/multiformats/dist/src/block/interface'
import { GRAPH_DATA } from '../storage/graph'

export type LEXEMES = string;
export type MORPHEMES = string;
export type SINGLETON = string;
export type SINGULARITY = [];
export type PATH = string;
export type NOUN = string;
export type ME = string;
export type YOU = Set<string>;
async function fetchBlockByCID(cid: string) {
    setTimeout(() => { }, 1000)
    return HDNodeWallet.createRandom()
}
class Tokenizer {
    wordIndex: Record<string, number> = {};
    indexWord: Record<number, string> = {};
    nextIndex: number = 1;

    fitOnTexts(texts: string[]) {
        texts.forEach(text => {
            const words = text.split(' ');
            words.forEach(word => {
                if (!this.wordIndex[word]) {
                    this.wordIndex[word] = this.nextIndex;
                    this.indexWord[this.nextIndex] = word;
                    this.nextIndex++;
                }
            });
        });
    }

    textsToSequences(texts: string[]): number[][] {
        return texts.map(text => text.split(' ').map(word => this.wordIndex[word] || 0));
    }

    sequencesToTexts(sequences: number[][]): string[] {
        return sequences.map(seq => seq.map(index => this.indexWord[index] || '').join(' '));
    }
}

export default class Vault {
    blocks: any[] = [];
    extendedKey: string = HDNodeWallet.createRandom().extendedKey;
    ds: any;
    optimizer: any;

    w1 = tf.variable(tf.randomNormal([784, 32]));
    b1 = tf.variable(tf.randomNormal([32]));
    w2 = tf.variable(tf.randomNormal([32, 10]));
    b2 = tf.variable(tf.randomNormal([10]));
    encode = async (req: PATH) => {
        const buf = codec.encode(req)
        const hash = await (sha256).digest(buf)
        const cid = CID.createV1(codec.code, hash)
        return cid.toString()
    }
    add = async (value: Record<any, any>) => {
        // encode a block
        let block = await Block.encode({ value, codec, hasher })

        block.value // { hello: 'world' }
        block.bytes // Uint8Array
        block.cid   // CID() w/ sha2-256 hash address and dag-cbor codec

        // you can also decode blocks from their binary state
        block = await Block.decode({ bytes: block.bytes, codec, hasher })

        // if you have the cid you can also verify the hash on decode
        block = await Block.create({ bytes: block.bytes, cid: block.cid, codec, hasher })
    }
    load = (cid: string, blocks: Promise<BlockView<unknown, 512, 18>>[]) => async (cid) => {
        // fetch a block using its cid
        const block = await fetchBlockByCID(cid)
        blocks.push(cid)
        return block
    }
    derivePath = async (req: PATH) => {
        return await Promise.all(req.split(req).map((path) => this.encode(path)))
    }
    connect = async (cid: any, load: any) => {
        return await walk({ cid, load: load(cid, this.blocks) })
    }
    train = async () => {
        // Train for 5 epochs.
        for (let epoch = 0; epoch < 5; epoch++) {
            await this.ds.forEachAsync(({ xs, ys }) => {
                this.optimizer.minimize(() => {
                    const predYs = this.model(xs);
                    const loss = tf.losses.softmaxCrossEntropy(ys, predYs);
                    loss.data().then(l => console.log('Loss', l));
                    return loss;
                });
            });
            console.log('Epoch', epoch);
        }

    }
    model = (x) => {
        return x.matMul(this.w1).add(this.b1).relu().matMul(this.w2).add(this.b2).softmax();
    }
    constructor() {
        const vocabSize = 64
        const hiddenSize = 6
        const embeddingSize = 64
        const seqLength = 512;
        const input = tf.input({ shape: [784] });
        const dense1 = tf.layers.dense({ units: 32, activation: 'relu' }).apply(input);
        const dense2 = tf.layers.dense({ units: 10, activation: 'softmax' }).apply(dense1);
        // Train the model
        const graphData: GRAPH_DATA = {
            nodes: [],
            links: []
        }
        // The weights and biases for the two dense layers.
        const w1 = this.w1 = tf.variable(tf.randomNormal([784, 32]));
        const b1 = this.b1 = tf.variable(tf.randomNormal([32]));
        const w2 = this.w2 = tf.variable(tf.randomNormal([32, 10]));
        const b2 = this.b2 = tf.variable(tf.randomNormal([10]));
        function* data() {
            for (let i = 0; i < 100; i++) {
                // Generate one sample at a time.
                yield tf.randomNormal([784]);
            }
        }

        function* labels() {
            for (let i = 0; i < 100; i++) {
                // Generate one sample at a time.
                yield tf.randomUniform([10]);
            }
        }
        const xs = tf.data.generator(data);
        const ys = tf.data.generator(labels);
        // Zip the data and labels together, shuffle and batch 32 samples at a time.
        const ds = this.ds = tf.data.zip({ xs, ys }).shuffle(100 /* bufferSize */).batch(32);

        // Let's train the model:

        const optimizer = this.optimizer = tf.train.sgd(0.1 /* learningRate */);
    }
}
export  class VaultGraph {
    blocks: any[] = [];
    extendedKey: string = HDNodeWallet.createRandom().extendedKey;
    optimizer: any;

    * data() {
        for (let i = 0; i < 100; i++) {
            // Generate one sample at a time.
            yield tf.randomNormal([784]);
        }
    }

    * labels() {
        for (let i = 0; i < 100; i++) {
            // Generate one sample at a time.
            yield tf.randomUniform([10]);
        }
    }

    xs = tf.data.generator(this.data);
    ys = tf.data.generator(this.labels);
    // We zip the data and labels together, shuffle and batch 32 samples at a time.
    ds = tf.data.zip({ xs: this.xs, ys: this.ys }).shuffle(100 /* bufferSize */).batch(32);
    model = tf.sequential({
        layers: [
            tf.layers.dense({ inputShape: [784], units: 32, activation: 'relu' }),
            tf.layers.dense({ units: 10, activation: 'softmax' }),
        ]
    });

    encode = async (req: PATH) => {
        const buf = codec.encode(req)
        const hash = await (sha256).digest(buf)
        const cid = CID.createV1(codec.code, hash)
        return cid.toString()
    }
    add = async (value: Record<any, any>) => {
        // encode a block
        let block = await Block.encode({ value, codec, hasher })

        block.value // { hello: 'world' }
        block.bytes // Uint8Array
        block.cid   // CID() w/ sha2-256 hash address and dag-cbor codec

        // you can also decode blocks from their binary state
        block = await Block.decode({ bytes: block.bytes, codec, hasher })

        // if you have the cid you can also verify the hash on decode
        block = await Block.create({ bytes: block.bytes, cid: block.cid, codec, hasher })
    }
    load = (cid: string, blocks: Promise<BlockView<unknown, 512, 18>>[]) => async (cid) => {
        // fetch a block using its cid
        const block = await fetchBlockByCID(cid)
        blocks.push(cid)
        return block
    }
    derivePath = async (req: PATH) => {
        return await Promise.all(req.split(req).map((path) => this.encode(path)))
    }
    connect = async (cid: any, load: any) => {
        return await walk({ cid, load: load(cid, this.blocks) })
    }
    train = async () => {
        // Train for 5 epochs.
        this.model.fitDataset(this.ds, { epochs: 5 }).then(info => {
            console.log('Accuracy', info.history.acc);
        });

    }
    constructor() {
        const vocabSize = 64
        const hiddenSize = 6
        const embeddingSize = 64
        const seqLength = 512;
        const input = tf.input({ shape: [784] });
        const dense1 = tf.layers.dense({ units: 32, activation: 'relu' }).apply(input);
        const dense2 = tf.layers.dense({ units: 10, activation: 'softmax' }).apply(dense1);
        // Train the model
        const graphData: GRAPH_DATA = {
            nodes: [],
            links: []
        }
        this.model.weights.forEach(w => {
            console.log(w.name, w.shape);
        });
        this.model.compile({
            optimizer: 'sgd',
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy']
          });
        // Generate dummy data.
        const data = tf.randomNormal([100, 784]);
        const labels = tf.randomUniform([100, 10]);

        function onBatchEnd(batch, logs) {
            console.log('Accuracy', logs.acc);
        }

        // Train for 5 epochs with batch size of 32.
        this.model.fit(data, labels, {
            epochs: 5,
            batchSize: 32,
            callbacks: { onBatchEnd }
        }).then(info => {
            console.log('Final accuracy', info.history.acc);
        });
    }
}
(async () => {
    const path = new VaultGraph()
    // const answer = await path("Brian")
    // console.log(answer)
})();