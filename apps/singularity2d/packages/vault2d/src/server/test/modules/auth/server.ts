import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { readFileSync, writeFileSync } from 'fs';
// import { v4 as uuidv4 } from 'uuid';
import { ethers } from 'ethers';
import { WebSocketServer } from 'ws';
import { HDNodeWallet, id, verifyMessage } from 'ethers';
import { MerkleTree } from 'merkletreejs';
import MultiGraph from 'graphology';
import QRCode from 'qrcode';


const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use("/", express.static("public"));
// In-memory storage for users and challenges (replace with a database in production)
let data: any[] = [];
// try {
//   data = JSON.parse(readFileSync(".user.data.json", "utf-8"));
// } catch (error) {
//   data = [];
// }
const users: any[] = data;
const challenges: { [key: string]: string } = {};
// Registration Endpoints
app.post('/generate-registration-options', (req, res) => {
  const username = req.body.username;

  // Generate a new HDNodeWallet
  const wallet = ethers.HDNodeWallet.createRandom();
  const extendedKey = wallet.extendedKey; // Use the extendedKey as the userId

  const challenge = crypto.getRandomValues(new Uint8Array(32));

  const options = {
    challenge: Array.from(challenge),
    rp: {
      name: 'WebAuthn Example',
      id: 'localhost',
    },
    user: {
      id: extendedKey, // Use the extendedKey as the userId
      name: username,
      displayName: username,
    },
    pubKeyCredParams: [
      { type: 'public-key', alg: -7 }, // ES256
      { type: 'public-key', alg: -257 }, // RS256
    ],
    authenticatorSelection: {
      userVerification: 'preferred',
    },
    timeout: 60000,
    attestation: 'none',
  };

  challenges[extendedKey] = Buffer.from(challenge).toString('base64');

  // Store the user with the extendedKey as the userId
  users.push({ id: extendedKey, username, authenticators: [], wallet });
  writeFileSync(".user.data.json", JSON.stringify(users));

  console.log('Registered user:', { userId: extendedKey, username });
  console.log('Users:', users);

  res.json(options);
});

app.post('/verify-registration', (req, res) => {
  // res.json({ verified: true });
  const { body } = req;

  // Convert the userId from an array of numbers to a string
  const userId = String.fromCharCode(...body.userId);

  console.log(new TextDecoder().decode(new Uint8Array(body.userId)));
  const user = users.find((u) => u.id === userId);

  if (!user) {
    console.error('User not found:', userId); // Log the missing user
    return res.status(404).json({ error: 'User not found' });
  }

  // Verify the registration response
  if (body.id && body.rawId && body.response) {
    user.authenticators.push({
      credentialID: body.id,
      publicKey: body.response.publicKey,
    });
    delete challenges[user.id];
    res.json({ verified: true });
  } else {
    res.status(400).json({ error: 'Verification failed' });
  }
});

app.post('/generate-authentication-options', (req, res) => {
  const username = req.body.username;
  const user = users.find((u) => u.username === username);

  if (!user) {
    console.error('User not found:', username);
    return res.status(404).json({ error: 'User not found' });
  }

  const options = {
    challenge: Array.from(crypto.getRandomValues(new Uint8Array(32))),
    allowCredentials: user.authenticators.map((auth: any) => ({
      id: auth.credentialID,
      type: 'public-key',
    })),
    userVerification: 'preferred',
    timeout: 60000,
  };

  challenges[user.id] = Buffer.from(options.challenge).toString('base64');

  console.log('Authentication options for user:', { userId: user.id, username });
  res.json(options);
});

app.post('/verify-authentication', (req, res) => {
  const { body } = req;
  console.log("users", users, "body", body);

  // Extract userId (extendedKey) from the request body
  const userId = body.userId;

  // Find the user by userId (extendedKey)
  const user = users.find((u) => u.id === userId);

  if (!user) {
    console.error('User not found:', userId);
    return res.status(404).json({ error: 'User not found' });
  }

  // Verify the authentication response
  if (body.id && body.rawId && body.response) {
    delete challenges[user.id];
    res.json({ verified: true });
  } else {
    res.status(400).json({ error: 'Verification failed' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  const host = "localhost";
  const wsPort = 33333;
  const tree = new MerkleTree([]); // ,id); // for ethers encoded
  const graph = new MultiGraph();
  const wallet = HDNodeWallet.createRandom("", "m/0");
  const rootKey = wallet.neuter().extendedKey;
  const wss = new WebSocketServer({ port: wsPort }, () => {
    console.log(`WS Server Listening on ws://${host}:${wsPort}`);
  });
  wss.on('connection', function connection(ws) {
    async function onUser({ extendedKey, signature }) {
      if (!extendedKey || !signature) throw new Error("Not Implemented");
      const user = HDNodeWallet.fromExtendedKey(extendedKey)
      const hash = tree.bufferify(extendedKey);
      tree.addLeaf(hash);
      const newUser = {
        challenge: new TextEncoder().encode("ajfbsojf"),//id(wallet.signingKey.computeSharedSecret(user.publicKey)),//new TextEncoder().encode("ajfbsojf"),
        rp: { id: host, name: rootKey },
        user: {
          id: hash,
          name: extendedKey,
          displayName: user.address
        },
        pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }]
      };
      graph.addNode(extendedKey, newUser);
      return true;
    };
    async function onHash({ root, hash }) {
      if (!hash || !root) throw new Error("Not Implemented");
      const proof = tree.getProof(hash)
      return tree.verify(proof, hash, root) // true
    };
    async function onContent({ extendedKey, signature, content }) {
      if (!extendedKey || !signature || !content) throw new Error("Not Implemented");
      if (HDNodeWallet.fromExtendedKey(extendedKey).address !== verifyMessage(content, signature)) throw new Error("Not signed correctly");
      const hash = id(content)
      const leaf = tree.bufferify(hash);
      tree.addLeaf(leaf);
      graph.addNode(hash, content);
      return true;
    };
    async function onBlock({ extendedKey, root, hash, signature }) {
      if (!extendedKey || !root || !hash || !signature) throw new Error("No Block Data");
      const user = HDNodeWallet.fromExtendedKey(extendedKey);
      if (user.address !== verifyMessage(hash, signature)) throw new Error("Not signed correctly");
      if (!tree.verify(tree.getProof(hash), hash, root)) throw new Error("Not In Environment");
      if (!graph.hasNode(extendedKey)) {
        graph.addNode(extendedKey);
      };
      if (!graph.hasNode(root)) {
        graph.addNode(root);
        graph.addEdge(extendedKey, root);
      };
      tree.addLeaf(hash);
      const newRoot = tree.getRoot().toString("utf-8");
      graph.setAttribute("root", newRoot);
      // checks to see if was sent a user key if not it creates one
      const newSignature = wallet.signMessageSync(hash);
      ws.send(JSON.stringify({ extendedKey: wallet.neuter().extendedKey, hash, root: newRoot, signature: newSignature }));
      return true
    };
    async function onBlockContent({ extendedKey, root, hash, signature, content }) {
      if (!extendedKey || !root || !hash || !signature || !content) throw new Error("No Block Data");
      // if (HDNodeWallet.fromExtendedKey(extendedKey).address !== verifyMessage(hash, signature)) throw new Error("Not signed correctly");
      // if (!tree.verify(tree.getProof(hash), hash, root)) throw new Error("Not In Environment");
      if (!graph.hasNode(extendedKey)) {
        graph.addNode(extendedKey);
      };
      if (!graph.hasNode(root)) {
        graph.addNode(root);
        graph.addEdge(extendedKey, root);
      };
      if (!graph.hasNode(hash)) {
        graph.addNode(hash, JSON.parse(content));
        graph.addEdge(root, hash);
      };
      tree.addLeaf(hash);
      const newRoot = tree.getRoot().toString("utf-8");
      graph.setAttribute("root", newRoot);
      // checks to see if was sent a user key if not it creates one
      const newSignature = wallet.signMessageSync(hash);
      ws.send(JSON.stringify({ extendedKey: wallet.neuter().extendedKey, hash, root: newRoot, signature: newSignature }));
      return true
    };
    ws.on('message', async function incoming(message) {
      const { extendedKey, root, hash, signature, content } = JSON.parse(message as any);
      console.log('received:\n', { extendedKey, root, hash, signature, content });
      if (!extendedKey || !root || !hash || !signature) throw new Error("No Data");
      // if (extendedKey) {
      //     // QRCode.toDataURL('I am a pony!', function (err, url) {
      //     QRCode.toString(extendedKey, function (err, url) {
      //         console.log(url)
      //     })
      // }
      // if (!content) throw new Error("No Content");
      // try {
      //     if (!await onUser({ extendedKey, signature })) throw new Error("Not valid user");           
      // } catch (error) {
      //     console.error(error)

      // }
      // try {
      //     if (!await onHash({ root, hash })) throw new Error("Not valid leaf");

      // } catch (error) {
      //     console.error(error)

      // }
      // try {
      //     if (!await onContent({ content, extendedKey, signature })) throw new Error("Not signed correctly");   
      // } catch (error) {
      //     console.error(error)
      // }
      try {
        // if (content) throw new Error("Has Content");
        if (!await onBlock({ extendedKey, hash, root, signature })) throw new Error("Not valid user");
      } catch (error) {
        console.error(error)

      }
      // try {
      //     // if (!content) throw new Error("No Content");
      //     if (await onBlockContent({ content, extendedKey, hash, root, signature })) throw new Error("Not valid user");

      // } catch (error) {
      //     console.error(error)

      // }
      const newRoot = tree.getRoot().toString("utf-8");
      graph.setAttribute("root", newRoot);
      return;
    });
  });
});
