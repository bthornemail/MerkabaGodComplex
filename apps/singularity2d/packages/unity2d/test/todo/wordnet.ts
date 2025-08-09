import wordnet from 'wordnet';

function printWord(def, includePointers) {
  let words = def.meta.words.reduce((str, word) => {
    return `${str} ${word.word}`;
  }, '');

  console.log(`  type: ${def.meta.synsetType}`)
  console.log(`  words: ${words.trim()}`);
  console.log(`  ${def.glossary}\n`);

  /* Print pointers */
  if (includePointers) {
    def.meta.pointers.forEach(function(pointer) {
      if (!pointer.data.meta) {
        return;
      }

      /* Print the word only if contains (or prefixes) the look up expression */
      let found = false;
      pointer.data.meta.words.forEach(function(aWord) {
        if (aWord.word.indexOf(word) === 0) {
          found = true;
        }
      });

      if (found || ['*', '='].indexOf(pointer.pointerSymbol) > -1) {
        printWord(pointer.data, false);
      }

    });
  }
}
// (Required) Load the WordNet database.
(async ()=>{

    await wordnet.init();
    
    // List all available words.
    let list = await wordnet.list();
    const N = list.length;
    console.log(list);

const gData = {
    nodes: list[Math.round(Math.random() * 10000)],
    links: list
      .filter(id => id)
      .map(id => ({
        source: list[Math.round(Math.random() * 10000)],
        target: list[Math.round(Math.random() * 10000)]
      }))
  };
  console.log(gData)
// All methods return promises.
wordnet.lookup('enlightened')
  .then((definitions) => {
    console.log(`\n  ${word}\n`);

    definitions.forEach((definition) => {
      printWord(definition, true);
    });
  })
  .catch((e) => {
    console.error(e);
  });
})()