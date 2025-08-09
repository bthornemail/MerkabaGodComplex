// Core system using WS, MQTT, WinkNLP, and Ollama for dimensional query/response
import { WebSocketServer} from 'ws';
import mqtt from 'mqtt';
import winkNLP from 'wink-nlp';
import model from 'wink-eng-lite-web-model';
import fetch from 'node-fetch';

const nlp = winkNLP(model);
const appScene = {
  host: 'localhost',
  broker: 'mqtt://localhost',
  clientId: `dim-net-${Math.random().toString(16).slice(2)}`,
};

// Create MQTT client for dual pub/sub
const client = mqtt.connect(appScene.broker, { clientId: appScene.clientId });

const context = {
  dimensions: new Array(21).fill(null), // 0D to 20D context pointer bank
  centroid: {},
  connections: {},
};

// WebSocket for full-duplex streaming
const ws = new WebSocketServer({ port: 7070 });

ws.on('connection', (socket) => {
  socket.on('message', async (message) => {
    const parsed = JSON.parse(message.toString());
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
    client.publish(mqttTopic, JSON.stringify({ response, pointer, tokens }));

    // Return to WS client
    socket.send(JSON.stringify({ pointer, response, tokens, topic: mqttTopic }));
  });
});

client.on('connect', () => {
  console.log('[MQTT] Connected');

  // Subscribe to all potential dimension topics
  for (let i = 0; i <= 20; i++) {
    client.subscribe(`dimnet/${i}/#`);
  }

  client.on('message', (topic, payload) => {
    const msg = JSON.parse(payload.toString());
    const dim = parseInt(topic.split('/')[1]);
    context.connections[dim] = msg;
  });
});

console.log('Dimensional Network is live on port 7070 and MQTT broker at', appScene.broker);
