import { HDNodeWallet } from "ethers";
import mqtt from "mqtt";
import { Environment } from "./modules/environment/index";
import { BrowserEnvironment } from "./modules/environment/browser";
import { Person } from "./modules/user";
import express, { Request, Response } from 'express';
import net from 'net';
import http from 'http';
import ngrok from 'ngrok'; // Import Ngrok
import cors from 'cors';
import crypto from 'crypto';
import base64url from 'base64url';
// Create an Express app
const app = express();
const expressPort = 3000;
let ngrokURL;
app.use(cors({
  origin: ngrokURL,
  credentials: true
}));
// Middleware to parse incoming data as text
app.use(express.text());

// Express route to handle incoming data
app.post('/process', (req: Request, res: Response) => {
  const data = req.body; // Data received from the net socket
  console.log('Express app received data:', data);

  // Process the data (e.g., transform it)
  const processedData = data.toUpperCase(); // Example: Convert to uppercase

  // Send the processed data back to the net socket
  res.send(processedData);
});


// Store challenges and public keys (use a database in production)
const challenges = new Map<string, any>();
const publicKeys = new Map<string, any>();

// WebAuthn: Generate registration options
app.get('/attestation/options', (req: Request, res: Response) => {
  const challenge = crypto.randomBytes(32);
  const userId = crypto.randomBytes(16);
  
  const options = {
    challenge: base64url.encode(challenge),
    rp: { name: "Your App Name" },
    user: {
      id: base64url.encode(userId),
      name: "user@example.com",
      displayName: "User"
    },
    pubKeyCredParams: [
      { type: "public-key", alg: -7 },  // ES256
      { type: "public-key", alg: -257 } // RS256
    ],
    authenticatorSelection: {
      userVerification: "preferred",
      residentKey: "required"
    }
  };

  challenges.set(userId.toString('hex'), challenge);
  res.json(options);
});

// WebAuthn: Verify registration
app.post('/attestation/result', express.json(), (req: Request, res: Response) => {
  const { attestation, clientDataJSON } = req.body;
  
  // Verify attestation (simplified example)
  const clientData = JSON.parse(base64url.decode(clientDataJSON));
  const storedChallenge = challenges.get(clientData.challenge);
  
  if (!storedChallenge) {
    return res.status(400).json({ error: "Invalid challenge" });
  }

  // Store public key (replace with proper verification)
  publicKeys.set(clientData.challenge, attestation);
  res.json({ verified: true });
});

// WebAuthn: Generate authentication options
app.get('/assertion/options', (req: Request, res: Response) => {
  const challenge = crypto.randomBytes(32);
  const options = {
    challenge: base64url.encode(challenge),
    rpId: "localhost",
    allowCredentials: [] // Populate with registered credentials
  };

  challenges.set(base64url.encode(challenge), challenge);
  res.json(options);
});

// WebAuthn: Verify authentication
app.post('/assertion/result', express.json(), (req: Request, res: Response) => {
  const { assertion, clientDataJSON } = req.body;
  
  // Verify assertion (simplified example)
  const clientData = JSON.parse(base64url.decode(clientDataJSON));
  const storedChallenge = challenges.get(clientData.challenge);
  
  if (!storedChallenge) {
    return res.status(400).json({ error: "Invalid challenge" });
  }

  res.json({ verified: true });
});
// Start the Express server
app.listen(expressPort, async () => {
  console.log(`Express server listening on port ${expressPort}`);
    // Start Ngrok tunnel for the Express server
    try {
        const expressUrl = await ngrok.connect({
          addr: expressPort,
          authtoken: '7pokcWyw8pGbxw6daKiYE_3xPiaTA2qpLnDhtLooBk1', // Replace with your Ngrok auth token
        });
        ngrokURL = expressUrl;
        console.log(`Express server exposed via Ngrok at: ${expressUrl}`);
      } catch (err) {
        console.error('Failed to start Ngrok tunnel for Express server:', err);
      }
});

// Create a net server to act as the source of data
const netServer = net.createServer((socket: net.Socket) => {
  console.log('Net server connection established.');

  // Send sample data to the connected client
  socket.write('Hello from the net server!');
  socket.end(); // Close the connection after sending data
});

const netServerPort = 4000;
netServer.listen(netServerPort, () => {
  console.log(`Net server listening on port ${netServerPort}`);
});

// Create a net socket to receive data from the net server
const inputSocket = net.createConnection({ port: netServerPort }, () => {
  console.log('Input net socket connected to net server!');
});

// Handle data received from the input net socket
inputSocket.on('data', (data: Buffer) => {
  console.log('Input net socket received data:', data.toString());

  // Forward the data to the Express app for processing
  const requestOptions = {
    hostname: 'localhost',
    port: expressPort,
    path: '/process',
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      'Content-Length': data.length,
    },
  };

  const req = http.request(requestOptions, (res) => {
    let responseData = '';
    res.on('data', (chunk: Buffer) => {
      responseData += chunk.toString();
    });
    res.on('end', () => {
      console.log('Express app response:', responseData);

      // Pipe the response to the output net socket
      outputSocket.write(responseData);
    });
  });

  req.on('error', (err: Error) => {
    console.error('Request to Express app failed:', err);
  });

  req.write(data);
  req.end();
});

// Create a net socket to send processed data to another destination
const outputSocket = net.createConnection({ port: 5000 }, () => {
  console.log('Output net socket connected to destination!');
});

// Handle errors
inputSocket.on('error', (err: Error) => {
  console.error('Input net socket error:', err);
});

outputSocket.on('error', (err: Error) => {
  console.error('Output net socket error:', err);
});

// Create a destination server to receive processed data
const destinationServer = net.createServer((socket: net.Socket) => {
  console.log('Destination server connection established.');
  socket.on('data', (data: Buffer) => {
    console.log('Destination server received data:', data.toString());
  });
});

const destinationPort = 5000;
destinationServer.listen(destinationPort, () => {
  console.log(`Destination server listening on port ${destinationPort}`);
});


// (async () => {
//   const environment = new BrowserEnvironment();
// })();
// (async () => {
//   const g = new EnvGraph();
//   await g.set("test-model:latest")
//   console.log(await g.get("test-model:latest"));
//   console.log(await g.update("test-model:latest", {
//     properties: {
//       model: 'test-model:latest',
//       modelScript: readFileSync("./env.graph.worker.ts", "utf8")
//     },
//     parameters: { timestamp: 1732909017536, lastEdit: 1732909017536 },
//     attributes: { position: [2, 2, 2] },
//     // references: {
//     // blockchain: ["merkleRoot","get",'d3b5cf29a4e982d32e52de65644c631f2a6ca3b60e4de445b4abd064db3ffa7a',0]
//     // models: (await ollama.list()).models.map((model)=>[model.name,JSON.stringify(model)])
//     // }
//   }));

//   console.log(await g.get("test-model:latest"));

//   console.log(await g.update("test-model:latest", {
//     properties: {
//       model: 'test-model:latest',
//       modelScript: readFileSync("./env.graph.worker.ts", "utf8")
//     },
//     parameters: { timestamp: 1732909017536, lastEdit: 1732909017536 },
//     attributes: { position: [3, 3, 3] },
//     references: {
//     blockchain: ["merkleRoot","get",'d3b5cf29a4e982d32e52de65644c631f2a6ca3b60e4de445b4abd064db3ffa7a',0],
//     // models: (await ollama.list()).models.map((model)=>[model.name,JSON.stringify(model)])
//     }
//   }));
// })();
// (async () => {
//   // const model = "graph-broker";
//   // const modelfile = _modelfile ?? readFileSync("./graph-broker.modelfile", "utf8");
//   // const modelScript = readFileSync("./env.graph.worker.ts", "utf8");
//   // const models = await ollama.list();
//   // if (!models.models.find(savedModel => savedModel.name.toLowerCase().includes(model))) {
//   //   const botResponse = await ollama.create({ model, modelfile, stream: true })
//   //   process.stdout.write("Creating new model: ")
//   //   process.stdout.write(model)
//   //   for await (const part of botResponse) {
//   //     // console.log(part.status)
//   //     process.stdout.write(".")
//   //   }

//   //   process.stdout.write("created")
//   //   console.log()
//   // }
//   //throw new Error("Create Model f`irst");
//   // const agent = new Worker(modelScript, {
//   //   eval: true,
//   //   workerData: {
//   //     name: model,
//   //     model: model,
//   //     messages: [{ role: "system", content: `Graph Data:\n${JSON.stringify(Object.assign({}, g))}` }],
//   //     // messages: [{role:"user",content:readFileSync("./env.graph.ts", "utf8")}],
//   //     graphData: { nodes: g.nodes },
//   //     buffer: g.dynamicBuffer,
//   //     // position: g.position,
//   //     // size: 2048,
//   //     nodes: [node1, node2, node3]
//   //   }
//   // });
//   // agent.on('online', () => {
//   //   console.log("Agent Online");
//   //   // agent.postMessage({ status: true });
//   //   agent.postMessage({ chat: "Can you tell me what nodes are in the graph" });
//   // })

//   // agent.on('message', (message) => {
//   //   // if(message.status){
//   //   console.log(message)
//   //   // }
//   //   // agent.postMessage({status: true});
//   // })
//   // process.on("SIGINT", () => {
//   //   ollama.delete({ model: "graph-broker:latest" });
//   // })
// })();


// ---

// ---
(async () => {
  // MQTT Configuration
  const MQTT_BROKER_URL = "mqtt://test.mosquitto.org:1883";//'mqtt://localhost:1883'; // Update with your broker URL
  const MQTT_TOPIC = 'file/changes';
  const identity = HDNodeWallet.fromPhrase(process.env.PHRASE ?? "roast thank tiny coach seat ensure cruel auto shaft finish fee resemble").extendedKey;
  const protocol = "ws";
  const host = "127.0.0.1";
  let port = 8011;

  const client = mqtt.connect(MQTT_BROKER_URL);
  client.on('connect', async () => {
    console.log(`Connected to MQTT broker at ${MQTT_BROKER_URL}`);
    console.log(await client.subscribeAsync(MQTT_TOPIC));
    console.log(await client.publishAsync(MQTT_TOPIC, JSON.stringify({ event: 'connected', url: `${protocol}://${host}/${identity}:${port}`, identity })));
  });
  client.on("message", (topic, payload, packet) => {
    console.log({ topic, message: JSON.parse(new TextDecoder().decode(payload)), packet })
  })
})();