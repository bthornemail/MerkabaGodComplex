import { RawData, WebSocketServer } from "ws";
import http from "http";
import url from "url";
import { HDNodeWallet, sha256, Wallet } from 'ethers';
import Graphology from 'graphology';
import { Attributes } from 'graphology-types';
import { KeystoreAccount } from "ethers";
import { MerkleTree } from "merkletreejs";

// Type definitions
type EntityType = 'user' | 'device' | 'service';
type CredentialType = 'webauthn' | 'keystore' | 'message';

interface NodeAttributes extends Attributes {
  type: EntityType;
  credentials: {
    webauthn?: WebAuthnCredential;
    keystore?: KeystoreAccount;
    message?: MessageCredential;
  };
  createdAt: number;
  lastActive: number;
}

interface EdgeAttributes extends Attributes {
  type: 'authentication' | 'authorization' | 'communication';
  credentialType: CredentialType;
  timestamp: number;
}

interface GraphAttributes extends Attributes {
  name: string;
  description: string;
  version: string;
}

interface WebAuthnCredential {
  id: string;
  publicKey: string;
  algorithm: string;
  counter: number;
  deviceType: string;
}

interface MessageCredential {
  hash: string;
  signature: string;
  timestamp: number;
}

// Graph instances with proper typing
const jsonKeyStoreGraph: Graphology<NodeAttributes, EdgeAttributes, GraphAttributes> = new Graphology({
  multi: true,
  allowSelfLoops: true,
  type: "directed"
});

const webAuthNGraph: Graphology<NodeAttributes, EdgeAttributes, GraphAttributes> = new Graphology({
  multi: true,
  allowSelfLoops: true,
  type: "directed"
});

const messageLayer: Graphology<NodeAttributes, EdgeAttributes, GraphAttributes> = new Graphology({
  multi: true,
  allowSelfLoops: true,
  type: "directed"
});

const encodingLayer = new MerkleTree([], sha256, { isBitcoinTree: true, hashLeaves: true });

const server = http.createServer();
const wsServer = new WebSocketServer({ server });

const port = 8000;
const connections: Record<string, any> = {};
const users: Record<string, any> = {};

const handleMessage = (bytes: RawData, entity: string, identity: string) => {
  const message = JSON.parse(bytes.toString());

  // Create message credential
  const messageCredential: MessageCredential = {
    hash: sha256(encodingLayer.bufferify(bytes)),
    signature: '', // You would add actual signature here
    timestamp: Date.now()
  };

  // Update message layer
  if (!messageLayer.hasNode(identity)) {
    messageLayer.addNode(identity, {
      type: 'user',
      credentials: {
        message: messageCredential
      },
      createdAt: Date.now(),
      lastActive: Date.now()
    });
  } else {
    messageLayer.updateNodeAttributes(identity, (attrs) => ({
      ...attrs,
      credentials: {
        ...attrs.credentials,
        message: messageCredential
      },
      lastActive: Date.now()
    }));
  }

  encodingLayer.addLeaf(encodingLayer.bufferify(bytes));
  broadcast();

  console.log(`${entity}/${identity} updated their state: ${JSON.stringify(message)}`);
};

const handleClose = (entity: string, identity: string) => {
  console.log(`${entity}/${identity} disconnected`);
  broadcast();
};

const broadcast = () => {
  Object.keys(connections).forEach((uuid) => {
    const connection = connections[uuid];
    connection.send(encodingLayer.toString());
  });
};

function initEntity({ entity, password, now, identity }: any) {
  // Initialize JSON KeyStore Graph
  if (!jsonKeyStoreGraph.hasNode(entity)) {
    const wallet = HDNodeWallet.createRandom();
    const keyStore: KeystoreAccount = JSON.parse(wallet.encryptSync(password as string || wallet.address));

    jsonKeyStoreGraph.addNode(entity, {
      type: 'user',
      credentials: {
        keystore: keyStore
      },
      createdAt: now,
      lastActive: now
    });
  }

  if (!jsonKeyStoreGraph.hasNode(identity)) {
    const wallet = HDNodeWallet.createRandom();
    const keyStore: KeystoreAccount = JSON.parse(wallet.encryptSync(password as string || wallet.address));

    jsonKeyStoreGraph.addNode(identity, {
      type: 'device',
      credentials: {
        keystore: keyStore
      },
      createdAt: now,
      lastActive: now
    });
  }

  if (!jsonKeyStoreGraph.hasEdge(entity, identity)) {
    jsonKeyStoreGraph.addEdgeWithKey(`keystore-${now}`, entity, identity, {
      type: 'authentication',
      credentialType: 'keystore',
      timestamp: now
    });
  }

  // Initialize WebAuthN Graph
  if (!webAuthNGraph.hasNode(entity)) {
    const webAuthnCredential: WebAuthnCredential = {
      id: `webauthn-${entity}-${now}`,
      publicKey: '', // Would be populated with actual WebAuthn public key
      algorithm: 'ES256',
      counter: 0,
      deviceType: 'authenticator'
    };

    webAuthNGraph.addNode(entity, {
      type: 'user',
      credentials: {
        webauthn: webAuthnCredential
      },
      createdAt: now,
      lastActive: now
    });
  }

  if (!webAuthNGraph.hasNode(identity)) {
    const webAuthnCredential: WebAuthnCredential = {
      id: `webauthn-${identity}-${now}`,
      publicKey: '', // Would be populated with actual WebAuthn public key
      algorithm: 'ES256',
      counter: 0,
      deviceType: 'authenticator'
    };

    webAuthNGraph.addNode(identity, {
      type: 'device',
      credentials: {
        webauthn: webAuthnCredential
      },
      createdAt: now,
      lastActive: now
    });
  }

  if (!webAuthNGraph.hasEdge(entity, identity)) {
    webAuthNGraph.addEdgeWithKey(`webauthn-${now}`, entity, identity, {
      type: 'authentication',
      credentialType: 'webauthn',
      timestamp: now
    });

  }

  // Initialize message layer
  if (!messageLayer.hasNode(identity)) {
    messageLayer.addNode(identity, {
      type: 'device',
      credentials: {
        message: {
          hash: '',
          signature: '',
          timestamp: 0
        }
      },
      createdAt: now,
      lastActive: now
    });
  }
}
wsServer.on("connection", (connection, request: any) => {
  const { entity, identity, password } = url.parse(request.url, true).query;
  const now = Date.now();
  initEntity({ entity, identity, password, now })

  // Store connection
  const connectionId = sha256(`${entity}-${identity}-${now}`);
  connections[connectionId] = connection;

  connection.on("message", (message) => handleMessage(message, entity as string, identity as string));
  connection.on("close", () => {
    delete connections[connectionId];
    handleClose(entity as string, identity as string);
  });
});

server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
});