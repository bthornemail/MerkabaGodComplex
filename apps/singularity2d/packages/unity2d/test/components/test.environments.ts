import { SigningKey, HDNodeWallet } from 'ethers';
// import { io, Socket } from 'socket.io-client';
import { ScriptWorker, OnlineEnvironment, blue, reset, yellow, bright, red, getDirName, formatMarkdown, getAllFilesInDirectory, green, WorkerBot } from "../..";
// import express, { Request, Response, Application } from "express";
// import { Server } from "socket.io";
// import { createServer } from "http";
// import { join } from "path";
import { generateTester } from '../bin/generate.tester';
import { TestPeer } from './test.peer';
import { TestUser } from './test.user';
import Graphology from 'graphology';
import { MerkleTree } from 'merkletreejs';
import { ClientEnvironment, ServerEnvironment } from '../../types/environment/online.environment';
// import { ENV_GRAPH } from '../../../unity2d/types/environment/context/env.graph';
// import { SCGCN } from '../workers/scgcn';

const protocol = "ws";
const host = "127.0.0.1";
export class TestEnvironment {
  identity: string = "Test_Environment"
  clusters = new Map<any, any>();
  // protected extendedKey: string;
  // private express: Application = express()
  // private listener;
  setGenerator: Set<any> = new Set()
  mapGenerator: Map<any, any> = new Map()
  peers: OnlineEnvironment[];
  currentUser: OnlineEnvironment;
  getProvider(): ServerEnvironment {
    const user = HDNodeWallet.fromPhrase("window strategy famous zone jungle allow soda dismiss current produce right visual");
    const password = "window strategy famous zone jungle allow soda dismiss current produce right visual";
    const testUser = TestUser({ identity: "Unity 2D", host, protocol, port: 8888, encryptedWallet: user.encryptSync(password), password })
    const env = new ServerEnvironment(testUser());
    return env;
  }
  getProviders(count: number = 1): ServerEnvironment[] {
    // const user = HDNodeWallet.fromPhrase("window strategy famous zone jungle allow soda dismiss current produce right visual");
    // const password = "window strategy famous zone jungle allow soda dismiss current produce right visual";
    // const testUser = TestUser({ identity: "Unity 2D", host, protocol, port: 8888, encryptedWallet: user.encryptSync(password), password })
    // const env = new ServerEnvironment(testUser());
    // return env;
    const peerEnv: ServerEnvironment[] = ([
      [8888, "Vault2D", "type bullet alley learn crumble now size tube design abstract debate toy"],
      [3800, "Unity2D", "special govern replace virus mistake marriage tail nurse able high garage salmon"],
      [3802, "Chat2D", "regular about daughter wide autumn pony assault woman treat claim trial supreme"],
      [3803, "Marketplace2D", "dawn gallery history crime knock income blossom catalog piece kiss arrive culture"],
      [3804, "University2D", "sense hybrid relax island palm elbow you want tattoo grape connect cash"]
    ] as [number, string, string][])
    .slice(0, count)
    .map(([port, identity, phrase]) => {
      const env = new ServerEnvironment(TestPeer(generateTester(identity, phrase, undefined, undefined, "127.0.0.1", undefined, port))());
      return env;
    });
    return peerEnv;
  }
  getUser(): ClientEnvironment {
    const user = HDNodeWallet.fromPhrase("window strategy famous zone jungle allow soda dismiss current produce right visual");
    const password = "window strategy famous zone jungle allow soda dismiss current produce right visual";
    const testUser = TestUser({ identity: "Brian Thorne", host, protocol, port: 8888, encryptedWallet: user.encryptSync(password), password })
    const env = new ClientEnvironment(testUser());
    return env;
  }
  getPeers(count: number = 1): ClientEnvironment[] {
    const peerEnv: ClientEnvironment[] = ([
      [8888, "Client", "type bullet alley learn crumble now size tube design abstract debate toy"],
      [8888, "Broker", "special govern replace virus mistake marriage tail nurse able high garage salmon"],
      [8888, "Host", "regular about daughter wide autumn pony assault woman treat claim trial supreme"],
      [8888, "Provider", "dawn gallery history crime knock income blossom catalog piece kiss arrive culture"],
      [8888, "Consumer", "sense hybrid relax island palm elbow you want tattoo grape connect cash"]
    ] as [number, string, string][])
    .slice(0, count)
    .map(([port, identity, phrase]) => {
      const env = new ClientEnvironment(TestPeer(generateTester(identity, phrase, undefined, undefined, "127.0.0.1", undefined, port))());
      return env;
    });
    return peerEnv;
  }
  constructor(identity: string) {
    // super({ user, history, network }: ENV_PARAMS_REMOTE)
    this.identity = identity;
  }
};