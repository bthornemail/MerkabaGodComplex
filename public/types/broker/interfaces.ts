import { HDNodeWallet, SigningKey, sha256 } from "ethers";
import Tools from "../../../unity2d/agents/tools";
import { iRegisterEvents } from "../../../unity2d/types/environment/event.register";
import * as THREE from 'three';
import { MerkleTree } from 'merkletreejs'
import { Script } from "node:vm";
// import { iEntity, iDefinitions, iDescription, iContent } from "../vault/interfaces";
import { BLOCK_MATRIX } from "../blockchain/types";

export interface iBroker {
    // tools: Tools;
    // model: string;
    // modelfile: string;
    broadcastEvents: {
        [event: string]: Array<(...args: any[]) => void>;
    };
}