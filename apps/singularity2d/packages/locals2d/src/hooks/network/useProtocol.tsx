import { pipe } from 'it-pipe'
import { createContext, useEffect, useRef, useState } from "react"
import Graphology from 'graphology';
import { Attributes, EdgeEntry, NodeEntry, SerializedGraph } from 'graphology-types';
import { HDNodeVoidWallet, HDNodeWallet, sha256 } from 'ethers';
import { MerkleTree } from 'merkletreejs';
import { stdout } from 'process';

export const defaultLayers: LAYER_PROTOCOL = {
  "m/0": {
    details: {
      author: "local2d",
      title: "local2d",
      summary: "Home",
      version: "0.0.0"
    }
  },
  "m/1": {
    details: {
      author: "local2d",
      title: "profile",
      summary: "Profile",
      version: "0.0.0"
    }
  },
  "m/1/0": {
    details: {
      author: "local2d",
      title: "bytes",//"Bytes",
      summary: "Messages",
      version: "0.0.0"
    }
  },
  "m/1/1": {
    details: {
      author: "local2d",
      title: "documents",
      summary: "Documents",
      version: "0.0.0"
    }
  },
  "m/1/2": {
    details: {
      author: "local2d",
      title: "assets",
      summary: "Assets",
      version: "0.0.0"
    }
  },
  "m/1/3": {
    details: {
      author: "local2d",
      title: "services",
      summary: "Services",
      version: "0.0.0"
    }
  },
  "m/2": {
    details: {
      author: "local2d",
      title: "graph",
      summary: "Graph",
      version: "0.0.0"
    }
  },
  "m/3": {
    details: {
      author: "local2d",
      title: "ratings",
      summary: "Ratings",
      version: "0.0.0"
    }
  },
  "m/4": {
    details: {
      author: "local2d",
      title: "reviews",
      summary: "Reviews",
      version: "0.0.0"
    }
  },
  "and": {
    details: {
      author: "local2d",
      title: "and",
      summary: "and",
      version: "0.0.0"
    }
  },
}

export const ProtocolContext = createContext<PROTOCOL_PARAMETERS & PROTOCOL_FUNCTIONS & any>(null);

// 3. Provider Component
export const ProtocolProvider = ({ children }: any) => {
  const contextValues = useProtocol(); // Use the custom hook here

  return (
    <ProtocolContext.Provider value={contextValues}>
      {children}
    </ProtocolContext.Provider>
  );
};
export type PROTOCOL_PARAMETERS = {
  entity: string;
  identity: Attributes;
  options: Attributes;
  attributes: Attributes;
  links: Attributes;
  layers: Attributes;
}
export type LAYER_PARAMETERS = {
  entity: string;
  identity: Attributes;
  options: Attributes;
  attributes: Attributes;
  inputs: Attributes & { entity?: string };
  outputs: Attributes;
  sources: Attributes;
  targets: Attributes;
}
export interface PROTOCOL_FUNCTIONS {
  register: (...content: any[]) => Promise<any>;
  record: (...content: any[]) => Promise<any>;
  review: (...content: any[]) => Promise<any>;
  relay: (...content: any[]) => Promise<any>;
}

export type LAYER_PROTOCOL = Record<string, {
  details: {
    author: string,
    title: string,
    summary: string,
    version: string
  }
} & Attributes>// & Record<string, Attributes>;
export const useProtocol = (): PROTOCOL_PARAMETERS & PROTOCOL_FUNCTIONS => {
  const [identity, setIdentity] = useState<Attributes>({});
  const [entity, setEntity] = useState<string>("");

  const [options, setOptions] = useState<Attributes>({});
  const [attributes, setAttributes] = useState<Attributes>({});

  const [links, setLinks] = useState<Record<string, Attributes>>({});
  const [layers, setLayers] = useState<Record<string, LAYER_PROTOCOL>>(defaultLayers);

  async function register(libp2p: any, protocol: string, topology: {
    filter?: any;
    notifyOnLimitedConnection?: boolean;
    onConnect?(peerId: any, conn: any): void;
    onDisconnect?(peerId: any): void;
  }): Promise<string> {
    const handler = ({ connection, stream, protocol }: any) => {
      // use stream or connection according to the needs
      console.log({ connection, stream, protocol })
    }

    libp2p.handle('/echo/1.0.0', handler, {
      maxInboundStreams: 5,
      maxOutboundStreams: 5
    })
    const id = await libp2p.register('/echo/1.0.0', topology)
    return id
  }
  async function record(libp2p: any, remotePeerId: string, protocols: string[]) {

    const { stream, protocol } = await libp2p.dialProtocol(remotePeerId, protocols)

    // Use this new stream like any other duplex stream
    pipe([1, 2, 3], stream, stdout.write)
  }
  async function review(libp2p: any, peerId: string) {
    const update = {
      peerId,
      protocols: libp2p.getProtocols(),
      connections: []
    } as any;
    for (const pendingDial of libp2p.getDialQueue()) {
      console.log(pendingDial)
    }
    return update;
  }
  async function relay(libp2p: any, peerId: string) {
    const update = {
      peerId,
      protocols: libp2p.getProtocols(),
      connections: []
    } as any;
    // const metric = libp2p.metrics.registerMetric({ 'my-metric'})
    // // later
    // metric.update(5)
    for (const connection of libp2p.getConnections()) {
      update.connections.push(connection.remoteAddr.toString())
    }
    return update;
  }
  return {
    entity, identity,
    options, attributes,
    layers, links,
    register, record, review, relay
  } as const
}