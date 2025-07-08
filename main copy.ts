import { HDNodeWallet } from "ethers";
import { fetchBinaryData, getData } from "./src/fetch";
import { WordOfGod } from "./encoder";
import util from 'util';
import wordnet from 'wordnet';
import { readFileSync } from "fs";

const dictionary: Map<string, Map<string, any>> = new Map([
    ['n', new Map()],
    ['v', new Map()],
    ['a', new Map()],
    ['s', new Map()],
    ['r', new Map()]
]);
(async () => {
    // (Required) Load the WordNet database.
    await wordnet.init();
    const Holy = readFileSync('./public/lexicon/Bible_King_James_Version.txt').buffer || new ArrayBuffer(0);
    // const Holy = readFileSync('./public/lexicon/Bible_King_James_Version.txt',"utf-8") || new ArrayBuffer(0);
    const Spirit = readFileSync('./public/lexicon/Principla_Mathmathetica.txt', "utf-8") || new ArrayBuffer(0);
    // List all available words.
    const WordNet = await wordnet.list();
    for (const word of WordNet) {
        const words = await wordnet.lookup(word);
        words.forEach(definition => {
            // console.log(JSON.stringify(definition, null, 2));
            if (!definition.glossary) return;
            // console.log(definition.glossary);
            if (definition.meta?.pointerCount !== 5) return;
            // console.log(definition.meta?.pointers);
            definition.meta?.pointers.forEach(pointer => {
                if (pointer.data?.meta?.pointerCount !== 5) return;
                if (pointer.data?.meta.wordCount <= 0) return;
                console.log(pointer.data?.meta);
                pointer.data?.meta?.words.forEach((pointerWord) => {
                    dictionary.get(pointer.pos)?.get(word).set(word, pointerWord)
                });
                // dictionary.get(pointer.pos)?.set(word,)

                // {
                //     switch (pointer.pos) {
                //         case value:

                //             break;

                //         default:
                //             break;
                //     }(pointerSymbol: '+',
                //         synsetOffset: 2667576,
                //         pos: 'n',
                //         sourceTargetHex: '0101',
                //         data: {
                //             glossary: 'a church associated with a monastery or convent',
                //             meta: [Object]
                //         }
                // }
            })
        });
        // console.log(util.inspect(definition, false, null, true));
    }
    throw new Error("");
    // console.log(util.inspect(Holy, false, null, true));
    // console.log(util.inspect(WordNet, false, null, true));
    // const StoryOfLifeFromGenesisPointOfView = WordOfGod(Holy, Spirit);
})();