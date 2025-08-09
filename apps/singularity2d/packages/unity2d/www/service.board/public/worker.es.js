// importScripts(); /* imports nothing */
// importScripts("/node_modules/mqtt/dist/mqtt.js"); /* imports just "foo.js" */
importScripts("/node_modules/mqtt/dist/mqtt.js"
, "//cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest"
, "/node_modules/tinyneat/dist/index.umd.cjs"
); /* imports two scripts */
// importScripts(
//   "//example.com/hello.js",
// ); 
onmessage = (e) => {
  console.log("Message received from main script");

  async function run() {
    // Create a simple model.
    const model = tf.sequential();
    model.add(tf.layers.dense({units: 1, inputShape: [1]}));
  
    // Prepare the model for training: Specify the loss and the optimizer.
    model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});
  
    // Load the model.
    use.load().then(model => {
      // Embed an array of sentences.
      const sentences = [
        'Hello.',
        'How are you?'
      ];
      model.embed(sentences).then(embeddings => {
        // `embeddings` is a 2D tensor consisting of the 512-dimensional embeddings for each sentence.
        // So in this example `embeddings` has the shape [2, 512].
        embeddings.print(true /* verbose */);
      });
    });
    use.loadTokenizer('https://storage.googleapis.com/learnjs-data/bert_vocab/vocab.json').then(tokenizer => {
  tokenizer.encode('Hello, how are you?'); // [0, 15350, 29623, 2129, 2024, 2017, 29632]
});
    // Generate some synthetic data for training. (y = 2x - 1)
    const xs = tf.tensor2d([-1, 0, 1, 2, 3, 4], [6, 1]);
    const ys = tf.tensor2d([-3, -1, 1, 3, 5, 7], [6, 1]);
  
    // Train the model using the data.
    await model.fit(xs, ys, {epochs: 250});
  
    // Use the model to do inference on a data point the model hasn't seen.
    // Should print approximately 39.
       
       const workerResul = `Result: ${JSON.stringify(model.predict(tf.tensor2d([20], [1, 1])).dataSync())}`;
       const workerResult = `Result: ${e.data[0] * e.data[1]}`;
       console.log("Posting message back to main script");
       // const uInt8Array = new Uint8Array(1024 * 1024 * 32).map((v, i) => {
       // const uInt8Array = new Uint8Array(512 * 3).map((v, i) => {
       //     postMessage(i)
       //     return i
       // });
       postMessage(model.predict(tf.tensor2d([20], [1, 1])).dataSync());
  }
  
  run();
};