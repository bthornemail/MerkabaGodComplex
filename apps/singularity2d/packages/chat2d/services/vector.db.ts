import { Configuration, OpenAIApi } from "openai";
import redis from './redis.js';
import { join } from 'path';
import { unlinkSync } from 'fs';
import pkg from 'hnswlib-node';
import __get_dirname from "../bin/__dirname.js";
const { HierarchicalNSW } = pkg;
export type VECTOR_DOCUMENT = {
    index?: string;
    embedding?: number[];
    content: string
}
export type VECTOR_EMBEDDING = {
    index?: number;
    embedding: number[];
    content?: string
}
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const numDimensions = 1536; // the length of data point vector that will be indexed.
const maxElements = 1536; // the maximum number of data points.

export type DOCUMENT = { index?: number, embedding?: number[], input: string } | null;
export default class VectorDatabase {
    botName: string;
    constructor(botName: string) {
        this.botName = botName;
        const index = new HierarchicalNSW('cosine', numDimensions);
        // index.initIndex(maxElements);
        try {
            index.readIndexSync(join(__dirname, `${this.botName}.dat`), true);
        } catch (error) {
            index.initIndex(maxElements);
        }
        this.index = index;
    }
    index;
    save = () => {
        this.index.writeIndexSync(__get_dirname(import.meta.url, `${this.botName}.dat`));
    }
    createEmbedding = async ({ content }: VECTOR_DOCUMENT): Promise<VECTOR_EMBEDDING | undefined> => {
        const openai = new OpenAIApi(configuration);
        const response = await openai.createEmbedding({
            model: "text-embedding-ada-002",
            input: content,
        });
        if (response.data.data && response.data.data[0].embedding) {
            const index = this.index.getIdsList().length;
            this.index.addPoint(response.data.data[0].embedding, index);
            await redis.set(`${this.botName}:vector:embedding:${index}`, JSON.stringify(this.index.getPoint(index)))
            await redis.set(`${this.botName}:vector:content:${index}`, content)
            this.index.writeIndexSync(join(__dirname, `${this.botName}.dat`));
            // this.index.readIndexSync(join(__dirname, `${this.botName}.dat`), true);
            return {
                index,
                embedding: this.index.getPoint(index),
                content: content
            }
        }
        return;
    }

    createDoc = async (input: string) => {
        const vector: VECTOR_EMBEDDING | undefined = await this.createEmbedding({ content: input });
        if (!vector) return;
        // console.log(vector.index)
        // const { index, embedding, content } = vector;
        // console.log(vector.content)
        // await redis.set(`${this.botName}:vector:${vector.index}`, JSON.stringify(vector));
        // this.save();
        return vector;
    }
    getDocs = async (): Promise<VECTOR_DOCUMENT[] | any> => {
        const _keysEmbedding = await redis.keys(`${this.botName}:vector:embedding:*`);
        const keysContent = await redis.keys(`${this.botName}:vector:content:*`);
        // console.log(keys);
        const docs = await Promise.all(keysContent.map(async (key, index) => {
            const docContent = await redis.get(keysContent[index])
            const _docEmbedding = await redis.get(_keysEmbedding[index])
            // console.log("docContent")
            // console.log(docContent)
            // console.log("_docEmbedding")
            // console.log(_docEmbedding)
            return docContent ? {
                index: key,
                content: docContent,
                embedding: JSON.parse(_docEmbedding!)
            } : null;
        }));
        return docs.filter((doc) => doc !== null);
    }
    getDoc = async (embedding: number[]) => {
        const docs = await this.getDocs();
        // console.log(docs);
        if (docs && docs.length > 0) {
            return docs.find((doc: any) =>
                // console.log(doc?.embedding);
                doc?.embedding?.every((value: any, index: number) => value === embedding[index])
            );
        }
        return null;
    };

    getSimiliar = async (input: string, k: number) => {
        const openai = new OpenAIApi(configuration);
        const _response = await openai.createEmbedding({
            model: "text-embedding-ada-002",
            input,
        });
        const vector = _response.data.data[0];
        // const vector = await this.createEmbedding({ content: input });
        // console.log(vector)
        if (!vector) return;
        const response = this.index.searchKnn(vector.embedding, k);

        // console.log(response.neighbors)
        // console.log(this.index.getPoint(response.neighbors[0]))
        // console.log("this.index.getPoint(response.neighbors[0])")

        return (await Promise.all(response.neighbors.map(async (label: number) => {
            // console.log(label)
            // console.log(this.index.getPoint(label))
            const doc = await redis.get(`${this.botName}:vector:content:${label}`);
            // console.log(label)
            // !doc && console.log(doc)
            if (!doc) return;
            // console.log(JSON.parse(doc).index)
            // console.log(JSON.parse(doc).content);
            // return JSON.parse(doc).content;
            return doc;
        }))).filter((result: any) => result !== undefined);
    }
}
async function init(vectorDb: VectorDatabase) {
    try {
        redis.flushdb(console.log)
        unlinkSync(join(__dirname, `chat_bot.dat`));
    } catch (error) {
        console.log(error)
    }
    const randomSentences: string[] = [
        "TypeScript is a statically typed superset of JavaScript.",
        "Classes and interfaces provide strong typing in TypeScript.",
        "Arrow functions provide concise syntax for writing functions in TypeScript.",
        "TypeScript offers better tooling and editor support compared to JavaScript.",
        "TypeScript supports modern ECMAScript features through its target compilation option.",
        "The 'any' type in TypeScript allows for dynamic typing and flexible variable declarations.",
        "TypeScript provides powerful type inference to reduce the need for explicit type annotations.",
        "TypeScript supports generics, enabling the creation of reusable and type-safe code.",
        "Decorators in TypeScript enable metadata annotations and can be used for custom functionality.",
        "TypeScript compiles down to plain JavaScript, ensuring compatibility across different platforms."
    ];
    const pokemonSentences: string[] = [
        "Pikachu is an Electric-type Pokémon known for its cute appearance and powerful electrical attacks.",
        "Charizard is a Fire/Flying-type Pokémon and one of the most iconic Pokémon in the franchise.",
        "Bulbasaur is a Grass/Poison-type Pokémon that evolves into Ivysaur and then Venusaur.",
        "Mewtwo is a Legendary Psychic-type Pokémon known for its incredible psychic powers and high base stats.",
        "Eevee is a unique Pokémon that has multiple branching evolutions, each with its own type and abilities.",
        "Gyarados is a Water/Flying-type Pokémon that evolves from the humble Magikarp, transforming into a powerful and fearsome creature.",
        "Jigglypuff is a Fairy/Normal-type Pokémon that is famous for putting opponents to sleep with its soothing lullabies.",
        "Gengar is a Ghost/Poison-type Pokémon known for its mischievous and prankster nature, often appearing in haunted places.",
        "Squirtle is a Water-type Pokémon that evolves into Wartortle and later into Blastoise, a formidable Water-type tank.",
        "Mew is a Mythical Psychic-type Pokémon that is said to possess the DNA of all existing Pokémon, granting it incredible versatility."
    ];
    const donutSentences: string[] = [
        "I love the aroma of freshly baked donuts in the morning.",
        "Glazed donuts are my all-time favorite sweet treat.",
        "Donuts come in a variety of flavors, from classic vanilla to decadent chocolate.",
        "The sprinkles on top of a donut add a pop of color and extra sweetness.",
        "I enjoy trying different gourmet donut flavors like maple bacon or matcha green tea.",
        "Donuts are the perfect companion to a hot cup of coffee or a cold glass of milk.",
        "The texture of a warm, soft donut with a crispy outer layer is simply delightful.",
        "Donut shops have become increasingly creative with their unique and innovative donut creations.",
        "Whether it's a simple glazed donut or an elaborate donut tower, they always bring joy.",
        "Donut enthusiasts can join donut appreciation clubs and explore donut-themed events and festivals."
    ];
    await Promise.all(randomSentences
        .concat(pokemonSentences)
        .concat(donutSentences)
        .map(async (sentence) => {
            // console.log(sentence);
            return await vectorDb.createEmbedding({content:sentence});
        }))
    // this.index.readIndexSync(join(__dirname, `${this.botName}.dat`), true);
}
// (async () => {
//     const vectorDb = new VectorDatabase("chat_bot");
//     // await init(vectorDb);
//     const result = await vectorDb.getSimiliar("what are pokemon names", 5);
//     // console.log(result);
//     console.table(result);
//     // console.log(index.getPoint(result.neighbors[0]));
// })()
(async()=>{
    try {
        redis.flushdb(console.log)
        unlinkSync(join(__dirname, `chat_bot.dat`));
    } catch (error) {
        console.log(error)
    }
})