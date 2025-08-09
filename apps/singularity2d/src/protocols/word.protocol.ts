import winkNLP from 'wink-nlp';
import model from 'wink-eng-lite-web-model';
import { PROTOCOL_LAYER } from '../modules/protocol';

const nlp = winkNLP(model);
const context = {
  dimensions: new Array(21).fill(null), // 0D to 20D context pointer bank
  centroid: {},
  connections: {},
};
export default async function wordProtocol(word: {toString: ()=>any}): Promise<PROTOCOL_LAYER>{
    const parsed = JSON.parse(word.toString());
    const { query, pointer } = parsed;

    // Use NLP for processing
    const doc = nlp.readDoc(query);
    const tokens = doc.tokens().out();
    context.dimensions[pointer] = tokens;

    // Forward to Ollama
    const ollamaResp = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3',
        prompt: query,
        stream: false,
      }),
    });

    const result: any = await ollamaResp.json();
    const response = result.response;

    // Publish result via MQTT
    const mqttTopic = `dimnet/${pointer}/${tokens.length}`;
    // client.publish(mqttTopic, JSON.stringify({ response, pointer, tokens }));

    // Return to WS client
    // socket.send(JSON.stringify({ pointer, response, tokens, topic: mqttTopic }));
    throw new Error("TODO");         
    return {
        publish,
        schema,
        subscribe,
        transform,
        transformer
    }
};